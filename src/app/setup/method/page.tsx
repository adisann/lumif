"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import TopNav from "@/components/TopNav";
import ProgressDots from "@/components/ProgressDots";
import { ArrowRight, Calendar as CalendarIcon, BarChart3 } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { createClient } from "@/lib/supabase/client";
import { saveOnboardingData, syncOnboardingToSupabase } from "@/lib/onboarding";

export default function MethodScreen() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [method, setMethod] = useState<"total" | "gradual" | null>("total");
  const [date, setDate] = useState<Date>(new Date(2026, 1, 14)); // Feb 14, 2026
  const [showPicker, setShowPicker] = useState(true); // Open by default for this specific design

  const handleNext = async () => {
    const chosenMethod = method ?? "total";
    const isoDate =
      chosenMethod === "total" ? format(date, "yyyy-MM-dd") : null;
    saveOnboardingData({ method: chosenMethod, targetQuitDate: isoDate });
    await syncOnboardingToSupabase(supabase, {
      method: chosenMethod,
      targetQuitDate: isoDate,
    });
    router.push("/setup/reduction-target");
  };

  return (
    <div className="relative flex h-full flex-col bg-background font-sans pt-5">
      <TopNav
        onBack={() => router.back()}
        onSkip={() => router.push("/setup/reduction-target")}
        skipText="Lewati"
      />
      
      <div className="flex flex-1 flex-col px-6 pt-6">
        <ProgressDots total={6} current={3} />

        <h1 className="mb-8 text-center font-poppins text-xl font-bold tracking-tight text-foreground">
          Bagaimana kamu ingin memulai?
        </h1>

        <div className="mb-auto flex gap-3">
          {/* Total Stop Card */}
          <div
            onClick={() => {
              setMethod("total");
              setShowPicker(true);
            }}
            className={`flex flex-1 cursor-pointer flex-col gap-1 rounded-2xl border-2 p-3 transition-colors ${
              method === "total"
                ? "border-accent-gold bg-accent-gold/10"
                : "border-border bg-card"
            }`}
          >
            <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-lg bg-accent-gold/20 text-accent-gold">
              <CalendarIcon className="h-4 w-4" />
            </div>
            <div className="font-poppins text-xs font-semibold text-foreground">
              Berhenti Total
            </div>
            <div className="text-[11px] text-muted-foreground">
              Setop sepenuhnya {format(date, "MMM dd yyyy")}
            </div>
          </div>

          {/* Gradual Card */}
          <div
            onClick={() => {
              setMethod("gradual");
              setShowPicker(false);
            }}
            className={`flex flex-1 cursor-pointer flex-col gap-1 rounded-2xl border-2 p-3 transition-colors ${
              method === "gradual"
                ? "border-accent-gold bg-accent-gold/10"
                : "border-border bg-card"
            }`}
          >
            <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
            </div>
            <div className="font-poppins text-xs font-semibold text-foreground">
              Bertahap
            </div>
            <div className="text-[11px] text-muted-foreground">
              Kurangi perlahan-lahan.
            </div>
          </div>
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={handleNext}
          className="mb-6 flex h-13 w-full cursor-pointer items-center justify-center gap-3 rounded-2xl bg-primary shadow-md transition hover:bg-primary-dark active:scale-[0.98]"
        >
          <span className="font-poppins text-base font-bold text-white tracking-tight">
            Selanjutnya
          </span>
          <ArrowRight className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* Bottom Sheet for Date Picker */}
      {showPicker && method === "total" && (
        <>
          <div className="absolute inset-0 z-20 bg-black/40 backdrop-blur-xs" onClick={() => setShowPicker(false)} />
          <div className="absolute bottom-0 left-0 right-0 z-30 flex flex-col items-center rounded-t-3xl border-t border-border bg-card p-6 shadow-xl">
            <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-4 shadow-xs">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => {
                  if (d) setDate(d);
                }}
                className="w-full"
              />
            </div>
            
            <div className="mt-5 w-full max-w-xs rounded-2xl border border-border bg-background px-5 py-3 text-center shadow-xs">
              <span className="font-poppins text-sm font-medium text-foreground">
                Pilih tanggal berhenti
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
