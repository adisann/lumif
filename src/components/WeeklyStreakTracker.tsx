"use client";

import { HiCheck, HiFire, HiLockClosed } from "react-icons/hi2";

const DAYS_OF_WEEK = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

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
  done: "bg-[#2D936C] text-white border-[#2D936C]",
  today: "bg-[#FF9F1C] text-white border-[#FF9F1C] shadow-[0px_8px_18px_rgba(255,159,28,0.28)]",
  missed: "bg-[#777C7A] text-white border-[#777C7A]",
  locked: "bg-[#F2F3F5] text-[#9CA3AF] border-[#ECEEF2]",
};

const circleStyle: Record<DayStatus, string> = {
  done: "bg-white/25 text-white",
  today: "bg-white/25 text-white",
  missed: "bg-white/20 text-white",
  locked: "bg-white text-[#A5ACB8] border border-[#E2E5EA]",
};


export default function WeeklyStreakTracker({

  weekData = DUMMY_WEEKLY_DATA,
}: WeeklyStreakTrackerProps) {
  const completedCount = weekData.filter((item) => item.status === "done" || item.status === "today").length;
  const cleanStreak = 3;
  const todayData = weekData.find((item) => item.status === "today");

  return (
    <section className="mb-[24px] px-[24px]">
      <div className="mb-[12px] flex items-center justify-between">
        <div>
          <p className="font-poppins text-[12px] font-bold text-black">Weekly Streak</p>
          <p className="mt-[2px] font-poppins text-[11px] text-[#8B8FA0]">
            Dummy data minggu ini
          </p>
        </div>

        <div className="flex items-center gap-[6px] rounded-full bg-[#FFF3DF] px-[10px] py-[6px] font-poppins text-[11px] font-bold text-[#FF8A00]">
          <HiFire className="h-[14px] w-[14px]" />
          {cleanStreak} hari bersih
        </div>
      </div>

      <div className="rounded-[16px] bg-white p-[16px] shadow-[0px_3px_22px_rgba(0,0,0,0.1)]">
        <div className="grid grid-cols-7 gap-[6px]">
          {weekData.map((item) => (
            <button
              key={`${item.day}-${item.date}`}
              type="button"
              title={`${item.day}, ${item.date}: ${item.activities.join(", ")}`}
              className={`flex min-h-[84px] flex-col items-center justify-between rounded-[14px] border p-[7px] transition active:scale-95 ${statusStyle[item.status]}`}
            >
              <span className="font-poppins text-[10px] font-bold uppercase leading-none">
                {item.day}
              </span>

              <span className="font-poppins text-[13px] font-bold leading-none">
                {item.date}
              </span>

              <span className={`flex h-[26px] w-[26px] items-center justify-center rounded-full ${circleStyle[item.status]}`}>
                {(item.status === "done" || item.status === "today") && (
                  <HiCheck className="h-[15px] w-[15px]" />
                )}
                {item.status === "missed" && <span className="text-[13px]">•</span>}
                {item.status === "locked" && <HiLockClosed className="h-[13px] w-[13px]" />}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-[14px] rounded-[14px] bg-[#F7F8FA] px-[12px] py-[10px]">
          <div className="mb-[8px] flex items-center justify-between">
            <p className="font-poppins text-[11px] font-bold text-[#28293D]">
              Ringkasan Minggu Ini
            </p>
            <p className="font-poppins text-[11px] font-bold text-[#2D936C]">
              {completedCount}/7 aktif
            </p>
          </div>

          <div className="h-[8px] overflow-hidden rounded-full bg-[#E8EBEF]">
            <div
              className="h-full rounded-full bg-[#2D936C] transition-all"
              style={{ width: `${(completedCount / 7) * 100}%` }}
            />
          </div>

          <p className="mt-[8px] font-poppins text-[11px] leading-[17px] text-[#6F7280]">
            Hari ini: <span className="font-bold text-[#28293D]">{todayData?.activities[0] ?? "Belum ada aktivitas"}</span>. Lanjutkan misi kecil supaya streak tetap jalan.
          </p>
        </div>
      </div>
    </section>
  );
}
