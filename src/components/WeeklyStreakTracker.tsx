"use client";

import { Check, Flame, Lock } from "lucide-react";

type DayStatus = "done" | "today" | "missed" | "locked";

type WeeklyDay = {
  day: string;
  date: number;
  status: DayStatus;
  activities: string[];
};

const DUMMY_WEEKLY_DATA: WeeklyDay[] = [
  {
    day: "Sen",
    date: 20,
    status: "done",
    activities: ["Check-in pagi", "Latihan pernafasan", "Jurnal 3 menit"],
  },
  {
    day: "Sel",
    date: 21,
    status: "done",
    activities: ["Check-in malam", "Baca modul Bab 1"],
  },
  {
    day: "Rab",
    date: 22,
    status: "done",
    activities: ["Urge surfing", "Minum air 2 gelas", "Evaluasi harian"],
  },
  {
    day: "Kam",
    date: 23,
    status: "missed",
    activities: ["Belum ada aktivitas"],
  },
  {
    day: "Jum",
    date: 24,
    status: "today",
    activities: ["Check-in hari ini", "Misi kecil belum selesai"],
  },
  {
    day: "Sab",
    date: 25,
    status: "locked",
    activities: ["Tersedia besok"],
  },
  {
    day: "Min",
    date: 26,
    status: "locked",
    activities: ["Tersedia nanti"],
  },
];

interface WeeklyStreakTrackerProps {
  weekData?: WeeklyDay[];
}

const statusStyle: Record<DayStatus, string> = {
  done: "bg-primary text-white border-primary",
  today: "bg-accent-gold text-white border-accent-gold shadow-md shadow-accent-gold/25",
  missed: "bg-muted-foreground/50 text-white border-transparent",
  locked: "bg-muted/70 text-muted-foreground border-border/60",
};

const circleStyle: Record<DayStatus, string> = {
  done: "bg-white/25 text-white",
  today: "bg-white/25 text-white",
  missed: "bg-white/20 text-white",
  locked: "bg-white text-muted-foreground border border-border/80",
};

export default function WeeklyStreakTracker({
  weekData = DUMMY_WEEKLY_DATA,
}: WeeklyStreakTrackerProps) {
  const completedCount = weekData.filter((item) => item.status === "done" || item.status === "today").length;
  const cleanStreak = 3;
  const todayData = weekData.find((item) => item.status === "today");

  return (
    <section className="mb-6 px-6">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="font-poppins text-xs font-bold uppercase tracking-wider text-muted-foreground">Weekly Streak</p>
          <p className="mt-0.5 text-xs text-muted-foreground/80">
            Aktivitas minggu ini
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-full bg-accent-gold/15 px-3 py-1 font-poppins text-xs font-bold text-accent-gold">
          <Flame className="h-3.5 w-3.5 fill-current" />
          {cleanStreak} hari bersih
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
        <div className="grid grid-cols-7 gap-1.5">
          {weekData.map((item) => (
            <button
              key={`${item.day}-${item.date}`}
              type="button"
              title={`${item.day}, ${item.date}: ${item.activities.join(", ")}`}
              className={`flex min-h-[84px] flex-col items-center justify-between rounded-xl border p-2 transition active:scale-95 ${statusStyle[item.status]}`}
            >
              <span className="font-poppins text-[10px] font-bold uppercase leading-none">
                {item.day}
              </span>

              <span className="font-poppins text-xs font-bold leading-none">
                {item.date}
              </span>

              <span className={`flex h-6 w-6 items-center justify-center rounded-full ${circleStyle[item.status]}`}>
                {(item.status === "done" || item.status === "today") && (
                  <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                )}
                {item.status === "missed" && <span className="text-xs leading-none">•</span>}
                {item.status === "locked" && <Lock className="h-3 w-3" />}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-3.5 rounded-xl border border-border/60 bg-muted/40 p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="font-poppins text-xs font-semibold text-foreground">
              Ringkasan Minggu Ini
            </p>
            <p className="font-poppins text-xs font-bold text-primary">
              {completedCount}/7 aktif
            </p>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${(completedCount / 7) * 100}%` }}
            />
          </div>

          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Hari ini: <span className="font-semibold text-foreground">{todayData?.activities[0] ?? "Belum ada aktivitas"}</span>. Lanjutkan misi kecil agar streak tetap terjaga.
          </p>
        </div>
      </div>
    </section>
  );
}
