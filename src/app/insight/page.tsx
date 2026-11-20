"use client";

import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import ScreenHeader from "@/components/ScreenHeader";
import InteractiveInsightCharts from "@/components/InteractiveInsightCharts";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Flame,
  Lock,
  Lightbulb,
  AlertTriangle,
  BarChart3,
  TrendingUp,
} from "lucide-react";

type DayStatus = "done" | "today" | "missed" | "locked";

type WeeklyDay = {
  day: string;
  date: number;
  status: DayStatus;
  activities: string[];
  summary: string;
};

type WeekSet = {
  label: string;
  range: string;
  days: WeeklyDay[];
};

const SAMPLE_WEEKS: WeekSet[] = [
  {
    label: "Minggu Lalu",
    range: "13 - 19 April 2026 (Contoh)",
    days: [
      {
        day: "Sen",
        date: 13,
        status: "done",
        summary: "Stabil",
        activities: ["Check-in pagi", "Latihan pernapasan"],
      },
      {
        day: "Sel",
        date: 14,
        status: "missed",
        summary: "Terlewat",
        activities: ["Belum ada aktivitas tercatat"],
      },
      {
        day: "Rab",
        date: 15,
        status: "done",
        summary: "Tenang",
        activities: ["Baca modul Bab 1", "Minum air 2 gelas"],
      },
      {
        day: "Kam",
        date: 16,
        status: "done",
        summary: "Fokus",
        activities: ["Check-in malam", "Jurnal 3 menit"],
      },
      {
        day: "Jum",
        date: 17,
        status: "done",
        summary: "Baik",
        activities: ["Urge surfing 2 menit"],
      },
      {
        day: "Sab",
        date: 18,
        status: "missed",
        summary: "Terlewat",
        activities: ["Belum ada aktivitas tercatat"],
      },
      {
        day: "Min",
        date: 19,
        status: "done",
        summary: "Refleksi",
        activities: ["Evaluasi mingguan"],
      },
    ],
  },
  {
    label: "Minggu Ini",
    range: "20 - 26 April 2026 (Contoh)",
    days: [
      {
        day: "Sen",
        date: 20,
        status: "done",
        summary: "Tenang",
        activities: ["Check-in pagi", "Latihan pernafasan", "Jurnal 3 menit"],
      },
      {
        day: "Sel",
        date: 21,
        status: "done",
        summary: "Kuat",
        activities: ["Check-in malam", "Baca modul Bab 1"],
      },
      {
        day: "Rab",
        date: 22,
        status: "done",
        summary: "Bertumbuh",
        activities: ["Urge surfing", "Minum air 2 gelas", "Evaluasi harian"],
      },
      {
        day: "Kam",
        date: 23,
        status: "missed",
        summary: "Berat",
        activities: ["Belum ada aktivitas"],
      },
      {
        day: "Jum",
        date: 24,
        status: "today",
        summary: "Aktif",
        activities: ["Check-in hari ini", "Misi kecil belum selesai"],
      },
      {
        day: "Sab",
        date: 25,
        status: "locked",
        summary: "Besok",
        activities: ["Tersedia besok"],
      },
      {
        day: "Min",
        date: 26,
        status: "locked",
        summary: "Mendatang",
        activities: ["Tersedia nanti"],
      },
    ],
  },
];

const statusStyle: Record<DayStatus, string> = {
  done: "bg-[#257B5A] text-white border-[#257B5A]",
  today: "bg-[#EDBF45] text-[#0F172A] border-[#EDBF45]",
  missed: "bg-slate-600 text-white border-slate-600",
  locked: "bg-muted text-muted-foreground border-border",
};

const statusLabel: Record<DayStatus, string> = {
  done: "Selesai",
  today: "Hari ini",
  missed: "Terlewat",
  locked: "Terkunci",
};

function WeeklyStreakTracker() {
  const [weekIdx, setWeekIdx] = useState(1);
  const currentWeek = SAMPLE_WEEKS[weekIdx];
  const [selectedDay, setSelectedDay] = useState<WeeklyDay>(currentWeek.days[4]);

  const changeWeek = (nextIdx: number) => {
    setWeekIdx(nextIdx);
    setSelectedDay(SAMPLE_WEEKS[nextIdx].days[0]);
  };

  const completedCount = currentWeek.days.filter(
    (item) => item.status === "done" || item.status === "today"
  ).length;
  const progressPercent = Math.round((completedCount / 7) * 100);

  return (
    <section>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-heading text-sm font-bold text-foreground">
            Streak Mingguan
          </h2>

          <div className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300">
            <Flame className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
            <span className="font-heading text-xs font-bold">
              {completedCount}/7 hari aktif
            </span>
          </div>
        </div>

        <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
          Data Contoh Offline
        </span>
      </div>

      <div className="rounded-3xl border border-border bg-card p-5 shadow-xs">
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            disabled={weekIdx === 0}
            onClick={() => changeWeek(Math.max(0, weekIdx - 1))}
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
            disabled={weekIdx === SAMPLE_WEEKS.length - 1}
            onClick={() => changeWeek(Math.min(SAMPLE_WEEKS.length - 1, weekIdx + 1))}
            aria-label="Lihat minggu berikutnya"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-border text-foreground transition hover:bg-muted disabled:opacity-40"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
          {currentWeek.days.map((item) => {
            const isSelected =
              selectedDay.day === item.day && selectedDay.date === item.date;

            return (
              <button
                key={`${item.day}-${item.date}`}
                type="button"
                onClick={() => setSelectedDay(item)}
                aria-pressed={isSelected}
                aria-label={`${item.day} ${item.date} April, ${statusLabel[item.status]}`}
                className={`flex min-h-[82px] flex-col items-center justify-between rounded-2xl border p-2 transition ${
                  statusStyle[item.status]
                } ${isSelected ? "ring-2 ring-foreground ring-offset-2 ring-offset-card" : ""}`}
              >
                <span className="font-heading text-[10px] font-bold uppercase leading-none">
                  {item.day}
                </span>

                <span className="font-heading text-sm font-bold leading-none">
                  {item.date}
                </span>

                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/10">
                  {item.status === "done" && (
                    <Check className="h-3.5 w-3.5 stroke-[2.5]" aria-hidden="true" />
                  )}
                  {item.status === "today" && (
                    <Flame className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  {item.status === "missed" && (
                    <span className="text-xs font-bold" aria-hidden="true">-</span>
                  )}
                  {item.status === "locked" && (
                    <Lock className="h-3 w-3" aria-hidden="true" />
                  )}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 rounded-2xl bg-surface-soft p-4">
          <div className="mb-2.5 flex items-center justify-between">
            <div>
              <p className="font-heading text-sm font-bold text-foreground">
                {selectedDay.day}, {selectedDay.date} April
              </p>
              <p className="text-xs font-semibold text-muted-foreground">
                Status: {statusLabel[selectedDay.status]} ({selectedDay.summary})
              </p>
            </div>

            <span className="rounded-lg bg-primary-light px-2.5 py-1 text-xs font-bold text-primary">
              {progressPercent}% minggu ini
            </span>
          </div>

          <div className="mb-3 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <ul className="space-y-1.5">
            {selectedDay.activities.map((activity) => (
              <li key={activity} className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                <span>{activity}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function FullInsightPanel() {
  const insightItems = [
    {
      icon: <AlertTriangle className="h-4 w-4" aria-hidden="true" />,
      title: "Pola Trigger",
      label: "Stres & lelah",
      description:
        "Dorongan paling sering muncul saat kamu merasa lelah, bosan, atau sedang sendirian. Siapkan pengalihan sebelum kondisi makin berat.",
      color: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
    },
    {
      icon: <BarChart3 className="h-4 w-4" aria-hidden="true" />,
      title: "Ringkasan Contoh",
      label: "Data prototipe",
      description:
        "Grafik menggunakan contoh seri check-in dan rutinitas offline. Setelah koneksi Supabase aktif, ringkasan akan ditarik dari check-in milikmu.",
      color: "bg-primary-light text-primary",
    },
    {
      icon: <Lightbulb className="h-4 w-4" aria-hidden="true" />,
      title: "Rekomendasi Hari Ini",
      label: "Aksi kecil",
      description:
        "Pilih satu aksi ringan: minum air, jalan 5 menit, cuci muka, atau latihan pernafasan. Fokusnya menjaga langkah kecil tetap berjalan.",
      color: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
    },
    {
      icon: <TrendingUp className="h-4 w-4" aria-hidden="true" />,
      title: "Konsistensi",
      label: "Ritme pemulihan",
      description:
        "Check-in singkat setiap hari membantu mengenali jam rawan tanpa harus menilai diri sendiri secara keras.",
      color: "bg-primary-light text-primary",
    },
  ];

  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-xs">
      <div className="mb-4">
        <h3 className="font-heading text-base font-bold text-card-foreground">
          Ringkasan Pola (Contoh Offline)
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Catatan di bawah mencontohkan pola analisis sebelum database Supabase tersambung.
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

              <div>
                <h4 className="font-heading text-sm font-bold text-foreground">
                  {item.title}
                </h4>
                <p className="text-[11px] font-semibold text-muted-foreground">
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
  const [showFullInsight, setShowFullInsight] = useState(true);

  return (
    <div className="lumif-with-nav relative flex min-h-dvh flex-col bg-surface-soft font-sans text-foreground">
      <ScreenHeader
        title="Analisis Progres Kamu"
        subtitle="Statistik & insight pemulihan"
      />

      <main className="flex-1 px-4 pb-[calc(110px+env(safe-area-inset-bottom))] pt-5 md:px-8 md:pb-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            <div className="xl:col-span-5">
              <WeeklyStreakTracker />
            </div>

            <div className="xl:col-span-7">
              <InteractiveInsightCharts />
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
                Penjelasan pemicu, progres, dan langkah pencegahan.
              </p>
            </div>

            <ChevronRight
              className={`h-5 w-5 text-primary transition-transform ${
                showFullInsight ? "rotate-90" : ""
              }`}
              aria-hidden="true"
            />
          </button>

          {showFullInsight && <FullInsightPanel />}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
