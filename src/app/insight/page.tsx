"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import InteractiveInsightCharts from "@/components/InteractiveInsightCharts";
import {
  HiArrowLeft,
  HiCheck,
  HiChevronRight,
  HiFire,
  HiLockClosed,
  HiSparkles,
  HiLightBulb,
  HiExclamationTriangle,
  HiChartBar,
} from "react-icons/hi2";

type DayStatus = "done" | "today" | "missed" | "locked";

type WeeklyDay = {
  day: string;
  date: number;
  status: DayStatus;
  activities: string[];
  mood: string;
};

const DUMMY_WEEKLY_DATA: WeeklyDay[] = [
  {
    day: "Sen",
    date: 20,
    status: "done",
    mood: "😌",
    activities: ["Check-in pagi", "Latihan pernafasan", "Jurnal 3 menit"],
  },
  {
    day: "Sel",
    date: 21,
    status: "done",
    mood: "💪",
    activities: ["Check-in malam", "Baca modul Bab 1"],
  },
  {
    day: "Rab",
    date: 22,
    status: "done",
    mood: "🌱",
    activities: ["Urge surfing", "Minum air 2 gelas", "Evaluasi harian"],
  },
  {
    day: "Kam",
    date: 23,
    status: "missed",
    mood: "😔",
    activities: ["Belum ada aktivitas"],
  },
  {
    day: "Jum",
    date: 24,
    status: "today",
    mood: "⚡",
    activities: ["Check-in hari ini", "Misi kecil belum selesai"],
  },
  {
    day: "Sab",
    date: 25,
    status: "locked",
    mood: "🔒",
    activities: ["Tersedia besok"],
  },
  {
    day: "Min",
    date: 26,
    status: "locked",
    mood: "🔒",
    activities: ["Tersedia nanti"],
  },
];

const statusStyle: Record<DayStatus, string> = {
  done: "bg-[#1B8E5A] text-white border-[#1B8E5A]",
  today:
    "bg-[#FF9F1C] text-white border-[#FF9F1C] shadow-[0px_8px_18px_rgba(255,159,28,0.28)]",
  missed: "bg-[#777C7A] text-white border-[#777C7A]",
  locked: "bg-[#F2F3F5] text-[#9CA3AF] border-[#ECEEF2]",
};

const statusLabel: Record<DayStatus, string> = {
  done: "Selesai",
  today: "Hari ini",
  missed: "Terlewat",
  locked: "Terkunci",
};

function WeeklyStreakTracker() {
  const [selectedDay, setSelectedDay] = useState<WeeklyDay>(
    DUMMY_WEEKLY_DATA[4]
  );

  const completedCount = DUMMY_WEEKLY_DATA.filter(
    (item) => item.status === "done" || item.status === "today"
  ).length;

  const cleanStreak = 3;
  const progressPercent = Math.round((completedCount / 7) * 100);

  return (
    <section>
      <div className="mb-[10px] flex items-center justify-between">
        <div className="flex items-center gap-[8px]">
          <p className="font-poppins text-[13px] font-bold text-black">
            Streak Saat Ini
          </p>

          <div className="flex items-center gap-[4px] rounded-full bg-[#FFF3DF] px-[9px] py-[5px]">
            <HiFire className="h-[14px] w-[14px] text-[#FF8A00]" />
            <p className="font-poppins text-[12px] font-bold text-[#FF8A00]">
              {cleanStreak} hari bersih
            </p>
          </div>
        </div>

        <p className="font-poppins text-[11px] font-semibold text-[#8B8FA0]">
          {completedCount}/7 aktif
        </p>
      </div>

      <div className="rounded-[24px] border border-[#F0F0F0] bg-white p-[16px] shadow-[0px_4px_18px_rgba(0,0,0,0.08)]">
        <div className="mb-[14px] flex items-center justify-between">
          <button
            type="button"
            className="flex h-[32px] w-[32px] items-center justify-center rounded-full transition active:scale-95"
          >
            <span className="text-[22px] leading-none text-[#777]">‹</span>
          </button>

          <div className="text-center">
            <p className="font-poppins text-[15px] font-bold text-black">
              Minggu Ini
            </p>
            <p className="mt-[2px] text-[11px] font-medium text-[#8B8FA0]">
              20 - 26 April 2026
            </p>
          </div>

          <button
            type="button"
            className="flex h-[32px] w-[32px] items-center justify-center rounded-full transition active:scale-95"
          >
            <span className="text-[22px] leading-none text-[#777]">›</span>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-[6px]">
          {DUMMY_WEEKLY_DATA.map((item) => {
            const isSelected =
              selectedDay.day === item.day && selectedDay.date === item.date;

            return (
              <button
                key={`${item.day}-${item.date}`}
                type="button"
                onClick={() => setSelectedDay(item)}
                className={`flex min-h-[86px] flex-col items-center justify-between rounded-[16px] border p-[7px] transition active:scale-95 ${statusStyle[item.status]
                  } ${isSelected
                    ? "ring-2 ring-[#1B1B1B] ring-offset-2"
                    : "ring-0"
                  }`}
              >
                <span className="font-poppins text-[10px] font-bold uppercase leading-none">
                  {item.day}
                </span>

                <span className="font-poppins text-[14px] font-bold leading-none">
                  {item.date}
                </span>

                <span className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-white/25 text-[15px]">
                  {item.status === "done" && (
                    <HiCheck className="h-[16px] w-[16px]" />
                  )}

                  {item.status === "today" && <span>⚡</span>}

                  {item.status === "missed" && <span>•</span>}

                  {item.status === "locked" && (
                    <HiLockClosed className="h-[14px] w-[14px]" />
                  )}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-[16px] rounded-[18px] bg-[#F7F8FA] px-[14px] py-[12px]">
          <div className="mb-[10px] flex items-center justify-between">
            <div>
              <p className="font-poppins text-[12px] font-bold text-[#28293D]">
                {selectedDay.day}, {selectedDay.date} April
              </p>
              <p className="mt-[2px] text-[11px] font-semibold text-[#8B8FA0]">
                {statusLabel[selectedDay.status]}
              </p>
            </div>

            <div className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-white text-[20px] shadow-sm">
              {selectedDay.mood}
            </div>
          </div>

          <div className="mb-[10px] h-[8px] overflow-hidden rounded-full bg-[#E8EBEF]">
            <div
              className="h-full rounded-full bg-[#1B8E5A] transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="space-y-[6px]">
            {selectedDay.activities.map((activity) => (
              <div key={activity} className="flex items-start gap-[6px]">
                <span className="mt-[2px] text-[12px] text-[#1B8E5A]">●</span>
                <p className="text-[11px] leading-[16px] text-[#5F6370]">
                  {activity}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FullInsightPanel() {
  const insightItems = [
    {
      icon: <HiExclamationTriangle className="h-[18px] w-[18px]" />,
      title: "Pola Trigger",
      label: "Stress & capek",
      description:
        "Dorongan paling sering muncul saat kamu merasa lelah, bosan, atau sedang sendirian. Ini berarti strategi distraksi perlu disiapkan sebelum kondisi makin berat.",
      color: "bg-[#FFF3DF] text-[#FF8A00]",
    },
    {
      icon: <HiChartBar className="h-[18px] w-[18px]" />,
      title: "Progress Pemulihan",
      label: "Mulai stabil",
      description:
        "Data dummy menunjukkan intensitas dorongan mulai turun di April. Streak mingguan juga mulai terbentuk lewat check-in, pernafasan, dan rutinitas kecil.",
      color: "bg-[#E7F4EE] text-[#1B8E5A]",
    },
    {
      icon: <HiLightBulb className="h-[18px] w-[18px]" />,
      title: "Rekomendasi Hari Ini",
      label: "Aksi kecil",
      description:
        "Pilih satu aksi ringan: minum air, jalan 5 menit, cuci muka, atau latihan pernafasan. Fokusnya bukan sempurna, tapi tetap bergerak.",
      color: "bg-[#EEF2FF] text-[#4F46E5]",
    },
    {
      icon: <HiSparkles className="h-[18px] w-[18px]" />,
      title: "Kesimpulan",
      label: "Konsistensi",
      description:
        "Kamu sudah punya pola pemulihan yang bisa dikembangkan. Hal paling penting sekarang adalah menjaga konsistensi kecil setiap hari.",
      color: "bg-[#F5F3FF] text-[#7C3AED]",
    },
  ];

  return (
    <section className="animate-fadeIn rounded-[24px] border border-[#F0F0F0] bg-white p-[18px] shadow-[0px_4px_18px_rgba(0,0,0,0.08)]">
      <div className="mb-[16px]">
        <p className="font-poppins text-[16px] font-bold text-[#28293D]">
          Insight Lengkap
        </p>
        <p className="mt-[4px] text-[12px] leading-[18px] text-[#6F7280]">
          Ringkasan ini masih memakai dummy data. Nanti bagian ini bisa diganti
          dari database check-in, rutinitas, modul, dan komunitas.
        </p>
      </div>

      <div className="space-y-[12px]">
        {insightItems.map((item) => (
          <button
            key={item.title}
            type="button"
            className="w-full rounded-[18px] bg-[#F7F8FA] px-[14px] py-[13px] text-left transition active:scale-[0.99]"
          >
            <div className="mb-[8px] flex items-center justify-between gap-[12px]">
              <div className="flex items-center gap-[10px]">
                <div
                  className={`flex h-[34px] w-[34px] items-center justify-center rounded-[12px] ${item.color}`}
                >
                  {item.icon}
                </div>

                <div>
                  <p className="font-poppins text-[13px] font-bold text-[#28293D]">
                    {item.title}
                  </p>
                  <p className="mt-[2px] text-[10px] font-semibold text-[#8B8FA0]">
                    {item.label}
                  </p>
                </div>
              </div>

              <HiChevronRight className="h-[18px] w-[18px] shrink-0 text-[#A0A3B5]" />
            </div>

            <p className="text-[12px] leading-[18px] text-[#6F7280]">
              {item.description}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}

export default function InsightScreen() {
  const router = useRouter();
  const [showFullInsight, setShowFullInsight] = useState(false);

  return (
    <main className="relative flex h-dvh w-full flex-col overflow-hidden bg-[#FAFAFA] font-lexend text-black">
      <header className="shrink-0 bg-white px-[24px] pb-[16px] pt-[20px]">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] border border-[#E8E8E8] bg-white transition active:scale-95"
          >
            <HiArrowLeft className="h-[17px] w-[17px] text-black" />
          </button>

          <h1 className="mr-[34px] flex-1 text-center font-poppins text-[18px] font-bold tracking-[-0.36px] text-black">
            Analisis Progres Kamu
          </h1>
        </div>
      </header>

      <section className="flex-1 overflow-y-auto px-[24px] pb-[calc(130px+env(safe-area-inset-bottom))] pt-[24px]">
        <div className="flex flex-col gap-[24px]">
          <WeeklyStreakTracker />

          <InteractiveInsightCharts />

          <button
            type="button"
            onClick={() => setShowFullInsight((prev) => !prev)}
            className="relative z-10 flex w-full items-center justify-between rounded-[20px] bg-[#E7F4EE] px-[18px] py-[16px] text-left transition active:scale-[0.98]"
          >
            <div>
              <p className="font-poppins text-[14px] font-bold text-[#1B8E5A]">
                {showFullInsight
                  ? "Tutup Insight Lengkap"
                  : "Lihat Insight Lengkap"}
              </p>
              <p className="mt-[2px] text-[12px] text-[#557768]">
                Analisis pola, trigger, dan progres pemulihanmu.
              </p>
            </div>

            <HiChevronRight
              className={`h-[20px] w-[20px] text-[#1B8E5A] transition-transform ${showFullInsight ? "rotate-90" : ""
                }`}
            />
          </button>

          {showFullInsight && <FullInsightPanel />}
        </div>
      </section>

      <BottomNav />
    </main>
  );
}