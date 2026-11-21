"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import BottomNav from "@/components/BottomNav";
import ScreenHeader from "@/components/ScreenHeader";
import InteractiveInsightCharts, {
  type CheckInDatum,
  type ModuleDatum,
  type RoutineDatum,
} from "@/components/InteractiveInsightCharts";
import { createClient } from "@/lib/supabase/client";
import { MODULES_DATA } from "@/lib/modulesData";
import { loadOnboardingData, TRIGGER_LABELS } from "@/lib/onboarding";
import { readUserCache, writeUserCache } from "@/lib/userCache";
import StreakFlame from "@/components/StreakFlame";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle,
  BarChart3,
  Check,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Lock,
  TrendingUp,
} from "lucide-react";

type DayStatus = "done" | "today" | "missed" | "locked";

type WeeklyDay = {
  dateKey: string;
  day: string;
  date: number;
  monthShort: string;
  status: DayStatus;
  activities: string[];
  summary: string;
};

type WeekSet = {
  label: string;
  range: string;
  days: WeeklyDay[];
};

type RawCheckinRow = {
  created_at: string;
  mood_score: number | null;
  urge_score: number | null;
  energy_score: number | null;
  note: string | null;
};

type RawMissionRow = {
  mission_date: string;
  text: string;
  completed: boolean;
};

type InsightBundle = {
  isAuthenticated: boolean;
  weeks: WeekSet[];
  checkInSeries: CheckInDatum[];
  routineSeries: RoutineDatum[];
  topTriggers: string[];
  totalCheckins: number;
  avgMood: number | null;
  avgUrge: number | null;
};

const DAY_NAMES_ID = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

function toLocalDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getMondayOfCurrentWeek(today: Date): Date {
  const d = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const dayOfWeek = d.getDay(); // 0 = Sun, 1 = Mon
  const diffToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  d.setDate(d.getDate() + diffToMon);
  return d;
}

function formatWeekRange(start: Date, end: Date, isDemo: boolean): string {
  const startFmt = start.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
  const endFmt = end.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return isDemo ? `${startFmt} - ${endFmt} (Demo Offline)` : `${startFmt} - ${endFmt}`;
}

function parseTriggersFromNote(note: string | null): string[] {
  if (!note) return [];
  try {
    const parsed = JSON.parse(note) as {
      triggers?: unknown;
      feelings?: unknown;
    };
    const arr = Array.isArray(parsed.triggers)
      ? parsed.triggers
      : Array.isArray(parsed.feelings)
      ? parsed.feelings
      : [];
    return arr.filter((x): x is string => typeof x === "string" && x.trim().length > 0);
  } catch {
    return [];
  }
}

function buildModuleProgress(): ModuleDatum[] {
  if (typeof window === "undefined") {
    return MODULES_DATA.map((mod) => ({
      id: mod.id,
      title: `Bab ${mod.number}: ${mod.title}`,
      progress: 0,
      status: "belum",
      lastActivity: `Tersedia ${mod.sections.length} bagian bacaan (${mod.readMinutes} menit).`,
    }));
  }

  let doneMap: Record<string, string[]> = {};
  let completedMods: string[] = [];

  try {
    const rawSec = window.localStorage.getItem("lumif_module_sections_done");
    if (rawSec) doneMap = JSON.parse(rawSec) as Record<string, string[]>;
    const rawMod = window.localStorage.getItem("lumif_modules_completed");
    if (rawMod) completedMods = JSON.parse(rawMod) as string[];
  } catch {
    // Ignore storage read errors
  }

  return MODULES_DATA.map((mod) => {
    const total = mod.sections.length;
    const doneCount = completedMods.includes(mod.id)
      ? total
      : Math.min(total, (doneMap[mod.id] ?? []).length);
    const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

    return {
      id: mod.id,
      title: `Bab ${mod.number}: ${mod.title}`,
      progress: pct,
      status: pct >= 100 ? "selesai" : pct > 0 ? "berjalan" : "belum",
      lastActivity:
        pct >= 100
          ? "Bab ini sudah ditandai selesai dibaca."
          : pct > 0
          ? `${doneCount} dari ${total} bagian sudah dipahami.`
          : `Belum dimulai · ${total} bagian bacaan (${mod.readMinutes} menit).`,
    };
  });
}

function computeWeeksAndRoutines(
  now: Date,
  checkins: RawCheckinRow[],
  missions: RawMissionRow[],
  isAuthenticated: boolean
): { weeks: WeekSet[]; routineSeries: RoutineDatum[] } {
  const todayKey = toLocalDateKey(now);
  const currentMon = getMondayOfCurrentWeek(now);
  const prevMon = new Date(currentMon);
  prevMon.setDate(prevMon.getDate() - 7);

  // Also check local routine completions for today
  let localDoneRoutinesToday: string[] = [];
  let localTotalRoutines = 0;
  if (typeof window !== "undefined") {
    try {
      const rawRoutines = window.localStorage.getItem("lumif_routines");
      if (rawRoutines) {
        const list = JSON.parse(rawRoutines) as Array<{
          title?: string;
          completed?: boolean;
        }>;
        localTotalRoutines = list.length;
        localDoneRoutinesToday = list
          .filter((r) => r.completed && r.title)
          .map((r) => `Rutinitas: ${r.title}`);
      }
    } catch {
      // Ignore
    }
  }

  const checkinsByDay = new Map<string, number>();
  for (const c of checkins) {
    const key = toLocalDateKey(new Date(c.created_at));
    checkinsByDay.set(key, (checkinsByDay.get(key) ?? 0) + 1);
  }

  const missionsByDay = new Map<string, RawMissionRow[]>();
  for (const m of missions) {
    const arr = missionsByDay.get(m.mission_date) ?? [];
    arr.push(m);
    missionsByDay.set(m.mission_date, arr);
  }

  const buildWeek = (label: string, mon: Date): WeekSet => {
    const days: WeeklyDay[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(mon);
      d.setDate(mon.getDate() + i);
      const dateKey = toLocalDateKey(d);
      const monthShort = d.toLocaleDateString("id-ID", { month: "short" });
      const dayName = DAY_NAMES_ID[d.getDay()];
      const dayCheckins = checkinsByDay.get(dateKey) ?? 0;
      const dayMissions = missionsByDay.get(dateKey) ?? [];
      const doneMissions = dayMissions.filter((m) => m.completed);

      const isFuture = dateKey > todayKey;
      const isToday = dateKey === todayKey;

      const activities: string[] = [];
      if (dayCheckins > 0) {
        activities.push(`${dayCheckins} check-in atau catatan hasrat`);
      }
      for (const dm of doneMissions.slice(0, 3)) {
        activities.push(`Misi selesai: ${dm.text}`);
      }
      if (isToday) {
        for (const lr of localDoneRoutinesToday.slice(0, 2)) {
          activities.push(lr);
        }
      }

      let status: DayStatus = "missed";
      let summary = "Belum tercatat";
      if (isFuture) {
        status = "locked";
        summary = "Mendatang";
        activities.push("Tersedia pada harinya nanti");
      } else if (isToday) {
        status = "today";
        summary = activities.length > 0 ? "Aktif" : "Belum ada aktivitas";
        if (activities.length === 0) {
          activities.push("Belum ada check-in atau misi selesai hari ini");
        }
      } else if (activities.length > 0) {
        status = "done";
        summary = "Tercatat";
      } else {
        status = "missed";
        summary = "Kosong";
        activities.push("Tidak ada check-in atau misi tercatat");
      }

      days.push({
        dateKey,
        day: dayName,
        date: d.getDate(),
        monthShort,
        status,
        activities,
        summary,
      });
    }

    const sun = new Date(mon);
    sun.setDate(mon.getDate() + 6);
    return {
      label,
      range: formatWeekRange(mon, sun, !isAuthenticated),
      days,
    };
  };

  const prevWeek = buildWeek("Minggu Lalu", prevMon);
  const currWeek = buildWeek("Minggu Ini", currentMon);

  const routineSeries: RoutineDatum[] = currWeek.days.map((dayObj) => {
    const mRows = missionsByDay.get(dayObj.dateKey) ?? [];
    const isToday = dayObj.dateKey === todayKey;
    const missionDoneCount = mRows.filter((m) => m.completed).length;
    const localDoneTodayCount = isToday ? localDoneRoutinesToday.length : 0;
    const completed = missionDoneCount + localDoneTodayCount;
    const target = Math.max(
      3,
      mRows.length + (isToday ? localTotalRoutines : 0)
    );

    let detail = "Belum ada catatan penyelesaian misi.";
    if (dayObj.status === "locked") {
      detail = "Hari belum berjalan.";
    } else if (completed > 0) {
      detail = `${completed} aktivitas misi atau rutinitas diselesaikan.`;
    }

    return {
      day: dayObj.day,
      completed,
      target,
      detail,
    };
  });

  return {
    weeks: [prevWeek, currWeek],
    routineSeries,
  };
}

function buildCheckInSeries(
  checkins: RawCheckinRow[],
  isAuthenticated: boolean,
  now: Date
): CheckInDatum[] {
  if (!isAuthenticated && checkins.length === 0) {
    // Only show current-date demo bars when truly in offline demo mode
    const monthNow = now.toLocaleDateString("id-ID", { month: "short" });
    return [
      {
        label: monthNow,
        stress: 5,
        tenang: 6,
        count: 2,
        catatan: "Contoh tampilan offline sebelum kamu login ke akun Supabase.",
      },
    ];
  }

  if (checkins.length === 0) {
    return [];
  }

  // Group by local YYYY-MM-DD for recent real clarity (up to last 7 recorded days)
  const grouped = new Map<
    string,
    { label: string; urgeSum: number; moodSum: number; count: number }
  >();

  const sorted = [...checkins].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  for (const row of sorted) {
    const dt = new Date(row.created_at);
    const key = toLocalDateKey(dt);
    const label = dt.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
    const entry = grouped.get(key) ?? {
      label,
      urgeSum: 0,
      moodSum: 0,
      count: 0,
    };
    entry.urgeSum += typeof row.urge_score === "number" ? row.urge_score : 5;
    entry.moodSum += typeof row.mood_score === "number" ? row.mood_score : 5;
    entry.count += 1;
    grouped.set(key, entry);
  }

  return Array.from(grouped.values())
    .slice(-7)
    .map((entry) => {
      const avgUrge = Number((entry.urgeSum / entry.count).toFixed(1));
      const avgMood = Number((entry.moodSum / entry.count).toFixed(1));
      return {
        label: entry.label,
        stress: avgUrge,
        tenang: avgMood,
        count: entry.count,
        catatan:
          avgUrge >= 7
            ? "Intensitas dorongan cukup tinggi; jaga jeda singkat dan hidrasi."
            : "Intensitas terkendali; pertahankan ritme harianmu.",
      };
    });
}

const statusStyle: Record<DayStatus, string> = {
  done: "bg-[#257B5A] text-white border-[#257B5A]",
  today: "bg-[#FFF8DE] text-[#071013] border-[#EDBF45]",
  missed: "bg-slate-600 text-white border-slate-600",
  locked: "bg-muted text-muted-foreground border-border",
};

const litTodayStyle =
  "bg-gradient-to-b from-[#FFE68C] via-[#EDBF45] to-[#FF9E2C] text-[#071013] border-[#FF8200] animate-streak-card-glow";

const statusLabel: Record<DayStatus, string> = {
  done: "Tercatat",
  today: "Hari ini",
  missed: "Kosong",
  locked: "Mendatang",
};

function WeeklyStreakTracker({
  weeks,
  isAuthenticated,
}: {
  weeks: WeekSet[];
  isAuthenticated: boolean;
}) {
  const [weekIdx, setWeekIdx] = useState(1);
  const currentWeek = weeks[weekIdx] ?? weeks[0];

  const todayIdx = currentWeek.days.findIndex((d) => d.status === "today");
  const defaultDay =
    todayIdx >= 0 ? currentWeek.days[todayIdx] : currentWeek.days[0];

  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const selectedDay =
    currentWeek.days.find((d) => d.dateKey === selectedDateKey) ?? defaultDay;

  const activeDaysCount = currentWeek.days.filter(
    (item) => item.status === "done" || (item.status === "today" && item.summary === "Aktif")
  ).length;
  const elapsedDays = currentWeek.days.filter(
    (item) => item.status !== "locked"
  ).length;
  const progressPercent =
    elapsedDays > 0 ? Math.round((activeDaysCount / elapsedDays) * 100) : 0;

  return (
    <section>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-heading text-sm font-bold text-foreground">
            Streak Mingguan
          </h2>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <StreakFlame
              active={activeDaysCount > 0}
              size="sm"
              showSparks={activeDaysCount > 0}
            />
            <span className="font-heading">
              {activeDaysCount}/{Math.max(1, elapsedDays)} hari aktif
            </span>
          </div>
        </div>

        {!isAuthenticated && (
          <span className="text-xs font-medium text-muted-foreground">
            Mode Demo Offline
          </span>
        )}
      </div>

      <div className="rounded-3xl border border-border bg-card p-5 shadow-xs">
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            disabled={weekIdx === 0}
            onClick={() => {
              const next = Math.max(0, weekIdx - 1);
              setWeekIdx(next);
              setSelectedDateKey(weeks[next]?.days[0]?.dateKey ?? null);
            }}
            aria-label="Lihat minggu sebelumnya"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-border text-foreground transition hover:bg-muted disabled:opacity-40"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="text-center">
            <p className="font-heading text-sm font-bold text-card-foreground">
              {currentWeek.label}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {currentWeek.range}
            </p>
          </div>

          <button
            type="button"
            disabled={weekIdx === weeks.length - 1}
            onClick={() => {
              const next = Math.min(weeks.length - 1, weekIdx + 1);
              setWeekIdx(next);
              setSelectedDateKey(null);
            }}
            aria-label="Lihat minggu berikutnya"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-border text-foreground transition hover:bg-muted disabled:opacity-40"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
          {currentWeek.days.map((item) => {
            const isSelected = selectedDay?.dateKey === item.dateKey;
            const isLitToday = item.status === "today" && item.summary === "Aktif";

            return (
              <button
                key={item.dateKey}
                type="button"
                onClick={() => setSelectedDateKey(item.dateKey)}
                aria-pressed={isSelected}
                aria-label={`${item.day} ${item.date} ${item.monthShort}, ${statusLabel[item.status]}`}
                className={`relative flex min-h-[82px] flex-col items-center justify-between rounded-2xl border p-2 transition ${
                  isLitToday ? litTodayStyle : statusStyle[item.status]
                } ${isSelected ? "ring-2 ring-foreground ring-offset-2 ring-offset-card" : ""}`}
              >
                <span className="font-heading text-[10px] font-bold uppercase leading-none">
                  {item.day}
                </span>

                <span className="font-heading text-sm font-bold leading-none">
                  {item.date}
                </span>

                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full ${
                    isLitToday
                      ? "bg-white/75 shadow-xs"
                      : "bg-black/10"
                  }`}
                >
                  {item.status === "done" && (
                    <Check className="h-3.5 w-3.5 stroke-[2.5]" aria-hidden="true" />
                  )}
                  {item.status === "today" && (
                    <StreakFlame
                      active={isLitToday}
                      size="sm"
                      showSparks={isLitToday}
                    />
                  )}
                  {item.status === "missed" && (
                    <span className="text-xs font-bold" aria-hidden="true">
                      -
                    </span>
                  )}
                  {item.status === "locked" && (
                    <Lock className="h-3 w-3" aria-hidden="true" />
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {selectedDay && (
          <div className="mt-4 rounded-2xl bg-surface-soft p-4">
            <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-heading text-sm font-bold text-foreground">
                  {selectedDay.day}, {selectedDay.date} {selectedDay.monthShort}
                </p>
                <p className="text-xs font-semibold text-muted-foreground">
                  Status: {statusLabel[selectedDay.status]} ({selectedDay.summary})
                </p>
              </div>

              <span className="rounded-lg bg-primary-light px-2.5 py-1 text-xs font-bold text-primary">
                {progressPercent}% hari tercatat
              </span>
            </div>

            <div className="mb-3 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <ul className="space-y-1.5">
              {selectedDay.activities.map((activity, idx) => (
                <li
                  key={`${selectedDay.dateKey}-${idx}`}
                  className="flex items-start gap-2 text-xs text-muted-foreground"
                >
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                  <span>{activity}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

function FullInsightPanel({ bundle }: { bundle: InsightBundle }) {
  const onboarding = loadOnboardingData();
  const onboardingTrigger = onboarding
    ? TRIGGER_LABELS[onboarding.trigger]
    : "Stres atau Lelah";

  const triggerText =
    bundle.topTriggers.length > 0
      ? bundle.topTriggers.slice(0, 3).join(", ")
      : onboardingTrigger;

  const insightItems = [
    {
      icon: <AlertTriangle className="h-4 w-4" aria-hidden="true" />,
      title: "Pemicu Terbanyak",
      label: triggerText,
      description:
        bundle.topTriggers.length > 0
          ? `Berdasarkan ${bundle.totalCheckins} catatan check-in milikmu, pemicu yang paling sering muncul adalah ${triggerText}.`
          : `Pemicu awal pilihanmu saat onboarding adalah ${onboardingTrigger}. Terus catat check-in untuk melihat polanya.`,
      color: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
    },
    {
      icon: <BarChart3 className="h-4 w-4" aria-hidden="true" />,
      title: "Ringkasan Angka Aktual",
      label: `${bundle.totalCheckins} check-in tersimpan`,
      description:
        bundle.avgMood !== null && bundle.avgUrge !== null
          ? `Rata-rata ketenanganmu ${bundle.avgMood}/10 dengan intensitas dorongan rata-rata ${bundle.avgUrge}/10.`
          : "Belum ada angka rata-rata check-in pada akun ini. Evaluasi pertamamu akan langsung mengisi statistik ini.",
      color: "bg-primary-light text-primary",
    },
    {
      icon: <Lightbulb className="h-4 w-4" aria-hidden="true" />,
      title: "Langkah Pencegahan Terarah",
      label: "Intervensi dini",
      description:
        "Saat tanda HALT (lapar, kesal, sepi, atau lelah) muncul, lakukan jeda napas 4-4-6 atau buka 1 permainan ketenangan sebelum bereaksi.",
      color: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
    },
    {
      icon: <TrendingUp className="h-4 w-4" aria-hidden="true" />,
      title: "Konsistensi Nyata",
      label: bundle.isAuthenticated ? "Sinkron Supabase" : "Penyimpanan Lokal",
      description:
        bundle.isAuthenticated
          ? "Seluruh grafik di halaman ini ditarik dari catatan riil akunmu dengan cache per pengguna yang aman."
          : "Kamu sedang memakai mode demo offline. Masuk dengan akun untuk menyinkronkan data lintas sesi.",
      color: "bg-primary-light text-primary",
    },
  ];

  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-xs">
      <div className="mb-4">
        <h3 className="font-heading text-base font-bold text-card-foreground">
          {bundle.isAuthenticated
            ? "Ringkasan Pola Aktual Akunmu"
            : "Ringkasan Pola (Mode Demo Offline)"}
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {bundle.isAuthenticated
            ? "Dihitung langsung dari check-in, misi harian, dan preferensi pemulihanmu."
            : "Menampilkan kondisi awal perangkatmu sebelum terhubung ke akun."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {insightItems.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-border/70 bg-surface-soft p-4"
          >
            <div className="mb-2 flex items-center gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.color}`}
              >
                {item.icon}
              </div>

              <div className="min-w-0">
                <h4 className="font-heading text-sm font-bold text-foreground">
                  {item.title}
                </h4>
                <p className="truncate text-[11px] font-semibold text-muted-foreground">
                  {item.label}
                </p>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function InsightScreen() {
  const supabase = useMemo(() => createClient(), []);
  const [isLoading, setIsLoading] = useState(true);
  const [showFullInsight, setShowFullInsight] = useState(true);
  const [moduleData, setModuleData] = useState<ModuleDatum[]>([]);
  const [bundle, setBundle] = useState<InsightBundle>({
    isAuthenticated: false,
    weeks: [],
    checkInSeries: [],
    routineSeries: [],
    topTriggers: [],
    totalCheckins: 0,
    avgMood: null,
    avgUrge: null,
  });

  const loadInsights = useCallback(async () => {
    const now = new Date();
    setModuleData(buildModuleProgress());

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        const { weeks, routineSeries } = computeWeeksAndRoutines(now, [], [], false);
        setBundle({
          isAuthenticated: false,
          weeks,
          checkInSeries: buildCheckInSeries([], false, now),
          routineSeries,
          topTriggers: [],
          totalCheckins: 0,
          avgMood: null,
          avgUrge: null,
        });
        setIsLoading(false);
        return;
      }

      const cached = readUserCache<InsightBundle>(user.id, "insight_bundle", 60_000);
      if (cached) {
        setBundle(cached.data);
        setIsLoading(false);
        if (cached.isFresh) return;
      }

      const sinceDate = new Date(now);
      sinceDate.setDate(sinceDate.getDate() - 21);
      const sinceKey = toLocalDateKey(sinceDate);

      const [checkinsRes, missionsRes] = await Promise.all([
        supabase
          .from("checkins")
          .select("created_at, mood_score, urge_score, energy_score, note")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(60),
        supabase
          .from("daily_missions")
          .select("mission_date, text, completed")
          .eq("user_id", user.id)
          .gte("mission_date", sinceKey)
          .order("created_at", { ascending: true }),
      ]);

      const checkins = (checkinsRes.data ?? []) as RawCheckinRow[];
      const missions = (missionsRes.data ?? []) as RawMissionRow[];

      const { weeks, routineSeries } = computeWeeksAndRoutines(
        now,
        checkins,
        missions,
        true
      );
      const checkInSeries = buildCheckInSeries(checkins, true, now);

      const triggerFreq = new Map<string, number>();
      let moodSum = 0;
      let moodCount = 0;
      let urgeSum = 0;
      let urgeCount = 0;

      for (const c of checkins) {
        if (typeof c.mood_score === "number") {
          moodSum += c.mood_score;
          moodCount += 1;
        }
        if (typeof c.urge_score === "number") {
          urgeSum += c.urge_score;
          urgeCount += 1;
        }
        for (const t of parseTriggersFromNote(c.note)) {
          triggerFreq.set(t, (triggerFreq.get(t) ?? 0) + 1);
        }
      }

      const topTriggers = Array.from(triggerFreq.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([label]) => label);

      const nextBundle: InsightBundle = {
        isAuthenticated: true,
        weeks,
        checkInSeries,
        routineSeries,
        topTriggers,
        totalCheckins: checkins.length,
        avgMood: moodCount > 0 ? Number((moodSum / moodCount).toFixed(1)) : null,
        avgUrge: urgeCount > 0 ? Number((urgeSum / urgeCount).toFixed(1)) : null,
      };

      writeUserCache(user.id, "insight_bundle", nextBundle);
      setBundle(nextBundle);
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => {
      void loadInsights();
    });
    const onUpdate = () => {
      void loadInsights();
    };
    window.addEventListener("lumif:data-updated", onUpdate);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("lumif:data-updated", onUpdate);
    };
  }, [loadInsights]);

  return (
    <div className="lumif-with-nav relative flex min-h-dvh flex-col bg-surface-soft font-sans text-foreground">
      <ScreenHeader
        title="Analisis Progres Kamu"
        subtitle="Statistik & insight pemulihan berbasis catatan nyatamu"
      />

      <main className="flex-1 px-4 pb-[calc(110px+env(safe-area-inset-bottom))] pt-5 md:px-8 md:pb-10">
        {isLoading ? (
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6" aria-busy="true" aria-label="Memuat statistik insight">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
              <div className="space-y-3 xl:col-span-5">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-44" />
                  <Skeleton className="h-5 w-28 rounded-md" />
                </div>
                <div className="rounded-3xl border border-border bg-card p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-11 w-11 rounded-xl" />
                    <div className="space-y-1.5 text-center">
                      <Skeleton className="mx-auto h-4 w-24" />
                      <Skeleton className="mx-auto h-3 w-32" />
                    </div>
                    <Skeleton className="h-11 w-11 rounded-xl" />
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                      <Skeleton key={d} className="h-[82px] w-full rounded-2xl" />
                    ))}
                  </div>
                  <Skeleton className="h-24 w-full rounded-2xl" />
                </div>
              </div>
              <div className="space-y-4 xl:col-span-7">
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((t) => (
                    <Skeleton key={t} className="h-11 w-full rounded-2xl" />
                  ))}
                </div>
                <div className="rounded-3xl border border-border bg-card p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-10 w-44 rounded-xl" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                  <Skeleton className="h-[220px] w-full rounded-2xl" />
                  <Skeleton className="h-16 w-full rounded-2xl" />
                </div>
              </div>
            </div>
            <Skeleton className="h-[60px] w-full rounded-2xl" />
            <div className="grid grid-cols-1 gap-3 rounded-3xl border border-border bg-card p-6 md:grid-cols-2">
              {[1, 2, 3, 4].map((c) => (
                <Skeleton key={c} className="h-28 w-full rounded-2xl" />
              ))}
            </div>
          </div>
        ) : (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            <div className="xl:col-span-5">
              <WeeklyStreakTracker
                weeks={bundle.weeks}
                isAuthenticated={bundle.isAuthenticated}
              />
            </div>

            <div className="xl:col-span-7">
              <InteractiveInsightCharts
                checkInData={bundle.checkInSeries}
                moduleData={moduleData}
                routineData={bundle.routineSeries}
                isAuthenticated={bundle.isAuthenticated}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowFullInsight((prev) => !prev)}
            aria-expanded={showFullInsight}
            className="flex min-h-[60px] w-full items-center justify-between rounded-2xl border border-primary/25 bg-primary-light px-5 py-4 text-left transition hover:border-primary/50"
          >
            <div>
              <p className="font-heading text-sm font-bold text-primary">
                {showFullInsight
                  ? "Sembunyikan Ringkasan Pola"
                  : "Lihat Ringkasan Pola"}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Penjelasan pemicu, progres aktual, dan langkah pencegahan.
              </p>
            </div>

            <ChevronRight
              className={`h-5 w-5 text-primary transition-transform ${
                showFullInsight ? "rotate-90" : ""
              }`}
              aria-hidden="true"
            />
          </button>

          {showFullInsight && <FullInsightPanel bundle={bundle} />}
        </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
