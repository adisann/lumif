"use client";

import { useState } from "react";
import { HiCheck } from "react-icons/hi2";

interface DailyMissionProps {
  mission?: string;
}

export default function DailyMission({ 
  mission = "Sadari kapan urge pertama muncul hari ini." 
}: DailyMissionProps) {
  const [isCompleted, setIsCompleted] = useState(false);

  if (isCompleted) return null;

  return (
    <div className="px-[24px] mb-[24px]">
      <h2 className="font-poppins text-[12px] font-bold text-black mb-[12px]">Misi Kecil Hari Ini</h2>
      <div className="bg-white rounded-[16px] shadow-[0px_3px_22px_rgba(0,0,0,0.1)] p-[16px] flex justify-between items-center gap-[16px]">
        <p className="text-[14px] text-[#071013] flex-1 leading-[1.5]">{mission}</p>
        <button
          onClick={() => setIsCompleted(!isCompleted)}
          className={`shrink-0 h-[48px] w-[48px] rounded-full flex items-center justify-center transition-all active:scale-90 ${
            isCompleted
              ? "bg-[#2D936C] text-white"
              : "bg-[#e4e7e6] text-[#666]"
          }`}
        >
          <HiCheck className="w-[24px] h-[24px]" />
        </button>
      </div>
    </div>
  );
}
