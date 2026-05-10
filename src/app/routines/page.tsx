"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { HiArrowLeft, HiCheckCircle } from "react-icons/hi2";

const ROUTINES_DATA = [
  {
    id: "breathing",
    title: "Latihan Pernapasan",
    emoji: "🧘",
    completed: true,
  },
  {
    id: "workout",
    title: "Olahraga",
    emoji: "💪",
    completed: true,
  },
  {
    id: "journaling",
    title: "Menulis Jurnal",
    emoji: "📔",
    completed: true,
  },
  {
    id: "reading",
    title: "Membaca Buku",
    emoji: "📚",
    completed: true,
  },
];

export default function RoutinesScreen() {
  const router = useRouter();
  const [routines, setRoutines] = useState(ROUTINES_DATA);

  const toggleRoutineCompletion = (id: string) => {
    setRoutines(prev =>
      prev.map(routine =>
        routine.id === id ? { ...routine, completed: !routine.completed } : routine
      )
    );
  };

  return (
    <div className="bg-[#FAFAFA] relative h-full w-full flex flex-col font-lexend overflow-hidden">

      {/* Top Nav */}
      <div className="flex items-center px-[24px] pt-[20px] pb-[16px] shrink-0 bg-white">
        <button
          onClick={() => router.back()}
          className="flex h-[32px] w-[32px] items-center justify-center rounded-[8px] bg-white border border-[#e5e5e5] active:scale-95 transition-transform"
        >
          <HiArrowLeft className="h-[16px] w-[16px] text-black" />
        </button>
        <h1 className="flex-1 text-center font-poppins text-[18px] font-bold text-black tracking-[-0.36px] mr-[32px]">
          Rutinitas
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-[24px] pt-[24px] pb-[100px]">
        {/* Info Text */}
        <p className="text-[14px] text-[#666] mb-[24px]">
          Rutinitas akan direset setiap harinya
        </p>

        {/* Routines List */}
        <div className="flex flex-col gap-[16px]">
          {routines.map((routine) => (
            <div
              key={routine.id}
              className="bg-white rounded-[20px] shadow-sm border border-[#f0f0f0] p-[16px] flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-[16px]">
                <div className="w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] shrink-0 bg-gradient-to-br from-[#2D936C]/20 to-[#257B5A]/20 rounded-[16px] flex items-center justify-center text-[32px] sm:text-[40px]">
                  {routine.emoji}
                </div>
                <span className="font-poppins font-bold text-[16px] text-black">
                  {routine.title}
                </span>
              </div>
              <button
                onClick={() => toggleRoutineCompletion(routine.id)}
                className="active:scale-95 transition-transform"
                title={routine.completed ? "Tandai belum selesai" : "Tandai selesai"}
              >
                <HiCheckCircle
                  className={`w-[32px] h-[32px] transition-colors ${
                    routine.completed ? "text-[#2D936C]" : "text-[#d9d9d9]"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
