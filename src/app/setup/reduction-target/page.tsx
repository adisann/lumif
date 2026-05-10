"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TopNav from "@/components/TopNav";
import ProgressDots from "@/components/ProgressDots";
import { HiArrowLongRight } from "react-icons/hi2";

export default function ReductionTargetScreen() {
  const router = useRouter();
  const [target, setTarget] = useState<number>(-3);
  
  const options = [-1, -2, -3, -4];

  return (
    <div className="flex flex-col h-full bg-white relative font-sans pt-[20px]">
      <TopNav
        onBack={() => router.back()}
        onSkip={() => {}}
        skipText="Lewati"
      />
      
      <div className="px-[24px] pt-[24px] flex-1 flex flex-col items-center justify-center">
        <div className="w-full flex justify-center absolute top-[107px]">
           <ProgressDots total={6} current={4} />
        </div>

        <h1 className="text-[20px] font-bold text-black text-center tracking-[-0.4px] mb-[56px] w-full">
          Apa target batasanmu minggu ini?
        </h1>

        <div className="flex gap-[16px] items-center justify-center mb-auto w-full">
          {options.map((opt) => {
            const isActive = target === opt;
            return (
              <button
                key={opt}
                onClick={() => setTarget(opt)}
                className={`flex flex-col items-center justify-center p-[10px] rounded-[12px] w-[80px] h-[60px] transition-colors ${
                  isActive ? "bg-[#071013] text-white" : "bg-[#d9d9d9] text-[#0f172a]"
                }`}
              >
                <span className="text-[20px] font-bold tracking-[-0.4px]">
                  {opt}
                </span>
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button className="bg-[#2d936c] hover:bg-[#257a5a] transition-colors w-full rounded-[10px] py-[14px] flex items-center justify-center gap-[12px] mb-[24px] absolute bottom-0 left-[24px] w-[calc(100%-48px)]">
          <span className="text-[16px] font-bold text-white tracking-[-0.32px]">
            Selanjutnya
          </span>
          <HiArrowLongRight className="text-white h-[20px] w-[20px]" />
        </button>
      </div>
    </div>
  );
}
