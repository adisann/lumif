"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import TopNav from "@/components/TopNav";
import ProgressDots from "@/components/ProgressDots";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { saveOnboardingData, syncOnboardingToSupabase } from "@/lib/onboarding";

export default function ReductionTargetScreen() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [target, setTarget] = useState<number>(-3);

  const options = [-1, -2, -3, -4];

  const handleNext = async () => {
    saveOnboardingData({ weeklyReductionTarget: target });
    await syncOnboardingToSupabase(supabase, { weeklyReductionTarget: target });
    router.push("/home");
  };

  return (
    <div className="relative flex min-h-dvh flex-col bg-background font-sans pt-5">
      <TopNav
        onBack={() => router.back()}
        onSkip={() => router.push("/home")}
        skipText="Lewati"
      />
      
      <div className="flex flex-1 flex-col items-center justify-center px-6 pt-6">
        <div className="mb-8 flex w-full justify-center">
          <ProgressDots total={6} current={4} />
        </div>

        <h1 className="mb-14 w-full text-center font-poppins text-xl font-bold tracking-tight text-foreground">
          Apa target batasanmu minggu ini?
        </h1>

        <div className="mb-auto flex w-full items-center justify-center gap-4">
          {options.map((opt) => {
            const isActive = target === opt;
            return (
              <button
                key={opt}
                onClick={() => setTarget(opt)}
                className={`flex h-16 w-20 flex-col items-center justify-center rounded-2xl border transition-all active:scale-95 ${
                  isActive 
                    ? "border-primary bg-primary text-white shadow-md shadow-primary/20" 
                    : "border-border bg-card text-foreground hover:bg-muted"
                }`}
              >
                <span className="font-poppins text-2xl font-bold tracking-tight">
                  {opt}
                </span>
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={handleNext}
          className="mt-8 mb-6 flex h-13 w-full cursor-pointer items-center justify-center gap-3 rounded-2xl bg-primary shadow-md transition hover:bg-primary-dark active:scale-[0.98]"
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
