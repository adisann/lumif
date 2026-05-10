"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TopNav from "@/components/TopNav";
import ProgressDots from "@/components/ProgressDots";
import { HiArrowLongRight, HiCalendar, HiChartBar } from "react-icons/hi2";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

export default function MethodScreen() {
  const router = useRouter();
  const [method, setMethod] = useState<"total" | "gradual" | null>("total");
  const [date, setDate] = useState<Date>(new Date(2026, 1, 14)); // Feb 14, 2026
  const [showPicker, setShowPicker] = useState(true); // Open by default for this specific design

  return (
    <div className="flex flex-col h-full bg-white relative font-sans pt-[20px]">
      <TopNav
        onBack={() => router.back()}
        onSkip={() => {}}
        skipText="Lewati"
      />
      
      <div className="px-[24px] pt-[24px] flex-1 flex flex-col">
        <ProgressDots total={6} current={3} />

        <h1 className="text-[20px] font-bold text-black text-center tracking-[-0.4px] mb-[32px]">
          Bagaimana kamu ingin memulai?
        </h1>

        <div className="flex gap-[12px] mb-auto">
          {/* Total Stop Card */}
          <div
            onClick={() => {
              setMethod("total");
              setShowPicker(true);
            }}
            className={`flex-1 flex flex-col gap-[4px] p-[12px] rounded-[12px] border-2 cursor-pointer transition-colors ${
              method === "total"
                ? "border-[#d97706] bg-orange-50/10"
                : "border-[#c4c4c4] bg-white"
            }`}
          >
            <div className="h-[32px] w-[32px] rounded-[6px] bg-[#f9e9d6] flex items-center justify-center text-[#d97706] mb-[4px]">
              <HiCalendar className="h-[20px] w-[20px]" />
            </div>
            <div className="text-[12px] text-black font-semibold">
              Berhenti Total
            </div>
            <div className="text-[10px] text-[#666]">
              Setop sepenuhnya {format(date, "MMM dd yyyy")}
            </div>
          </div>

          {/* Gradual Card */}
          <div
            onClick={() => {
              setMethod("gradual");
              setShowPicker(false);
            }}
            className={`flex-1 flex flex-col gap-[4px] p-[12px] rounded-[12px] border-2 cursor-pointer transition-colors ${
              method === "gradual"
                ? "border-[#d97706] bg-orange-50/10"
                : "border-[#c4c4c4] bg-white"
            }`}
          >
            <div className="h-[32px] w-[32px] rounded-[6px] bg-neutral-100 flex items-center justify-center text-neutral-500 mb-[4px]">
              <HiChartBar className="h-[20px] w-[20px]" />
            </div>
            <div className="text-[12px] text-black font-semibold">
              Bertahap
            </div>
            <div className="text-[10px] text-[#666]">
              Kurangi perlahan-lahan.
            </div>
          </div>
        </div>

        {/* Next Button */}
        <button className="bg-[#2d936c] hover:bg-[#257a5a] transition-colors w-full rounded-[10px] py-[14px] flex items-center justify-center gap-[12px] mb-[24px]">
          <span className="text-[16px] font-bold text-white tracking-[-0.32px]">
            Selanjutnya
          </span>
          <HiArrowLongRight className="text-white h-[20px] w-[20px]" />
        </button>
      </div>

      {/* Bottom Sheet for Date Picker */}
      {showPicker && method === "total" && (
        <>
          <div className="absolute inset-0 bg-black/40 z-20" onClick={() => setShowPicker(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-[#f5f5f5] rounded-t-[16px] z-30 shadow-[0_1px_2px_0_rgba(0,14,51,0.25)] flex flex-col items-center p-[24px]">
            {/* The calendar container from the design */}
            <div className="bg-white rounded-[16px] p-[16px] w-full max-w-[378px] mx-auto shadow-sm">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => {
                  if (d) setDate(d);
                }}
                className="w-full"
              />
            </div>
            
            <div className="mt-[24px] bg-white rounded-[16px] px-[20px] py-[16px] w-full max-w-[233px] text-center shadow-sm">
              <span className="text-[18px] font-medium text-black">
                Pilih tanggal berhenti
              </span>
            </div>
            
          </div>
        </>
      )}
    </div>
  );
}
