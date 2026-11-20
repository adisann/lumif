"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import TopNav from "@/components/TopNav";
import ProgressDots from "@/components/ProgressDots";
import { ArrowRight, ChevronUp, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { saveOnboardingData, syncOnboardingToSupabase } from "@/lib/onboarding";

export default function CurrentHabitsScreen() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [frequency, setFrequency] = useState<number>(20);

  const handleNext = async () => {
    saveOnboardingData({ frequency });
    await syncOnboardingToSupabase(supabase, { frequency });
    router.push("/setup/method");
  };

  return (
    <div className="relative flex h-full flex-col bg-background font-sans pt-5">
      <TopNav
        onBack={() => router.back()}
        onSkip={() => router.push("/setup/method")}
        skipText="Lewati"
      />
      
      <div className="flex flex-1 flex-col items-center justify-center px-6 pt-6">
        <div className="absolute top-[107px] flex w-full justify-center">
          <ProgressDots total={6} current={3} />
        </div>

        <h1 className="mb-14 w-full text-center font-poppins text-xl font-bold tracking-tight text-foreground">
          Seberapa sering kamu mengakses konten tersebut?
        </h1>

        <div className="mb-auto flex w-full items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center justify-center gap-1 text-foreground">
              <button
                type="button"
                onClick={() => setFrequency((prev) => Math.min(prev + 1, 100))}
                className="rounded-lg p-1.5 transition hover:bg-muted active:scale-95"
                aria-label="Tambah frekuensi"
              >
                <ChevronUp className="h-7 w-7 text-foreground" />
              </button>
              <button
                type="button"
                onClick={() => setFrequency((prev) => Math.max(prev - 1, 1))}
                className="rounded-lg p-1.5 transition hover:bg-muted active:scale-95"
                aria-label="Kurangi frekuensi"
              >
                <ChevronDown className="h-7 w-7 text-foreground" />
              </button>
            </div>
            <div className="flex h-[72px] items-center justify-center font-poppins text-6xl font-extrabold leading-none text-foreground">
              {frequency}
            </div>
          </div>
          <div className="font-poppins text-base font-medium leading-9 text-muted-foreground">
            Kali / Minggu
          </div>
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={handleNext}
          className="absolute bottom-0 left-6 mb-6 flex h-13 w-[calc(100%-48px)] cursor-pointer items-center justify-center gap-3 rounded-2xl bg-primary shadow-md transition hover:bg-primary-dark active:scale-[0.98]"
        >
          <span className="font-poppins text-base font-bold text-white tracking-tight">
            Selanjutnya
          </span>
          <ArrowRight className="h-5 w-5 text-white" />
        </button>
      </div>
    </div>
  );
}
