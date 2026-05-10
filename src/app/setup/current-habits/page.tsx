"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TopNav from "@/components/TopNav";
import ProgressDots from "@/components/ProgressDots";
import { HiArrowLongRight, HiChevronUpDown } from "react-icons/hi2";

export default function CurrentHabitsScreen() {
  const router = useRouter();
  const [frequency, setFrequency] = useState<number>(20);

  return (
    <div className="flex flex-col h-full bg-white relative font-sans pt-[20px]">
      <TopNav
        onBack={() => router.back()}
        onSkip={() => {}}
        skipText="Lewati"
      />
      
      <div className="px-[24px] pt-[24px] flex-1 flex flex-col items-center justify-center">
        <div className="w-full flex justify-center absolute top-[107px]">
           <ProgressDots total={6} current={3} />
        </div>

        <h1 className="text-[20px] font-bold text-black text-center tracking-[-0.4px] mb-[56px] w-full">
          Seberapa sering kamu mengakses konten tersebut?
        </h1>

        <div className="flex gap-[16px] items-center justify-center mb-auto w-full">
           <div className="flex items-center gap-[4px]">
             <div className="flex flex-col items-center justify-center text-black">
                <HiChevronUpDown className="h-[45px] w-[45px] text-black cursor-pointer" />
             </div>
             <div className="text-[58px] font-bold text-black leading-none flex items-center justify-center h-[72px]">
               {frequency}
             </div>
           </div>
           <div className="text-[16px] text-black font-medium leading-[36px]">
             Kali / Minggu
           </div>
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
