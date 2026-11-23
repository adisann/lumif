"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Check, X, AlertCircle, ThumbsUp } from "lucide-react";
import BreathingOrb, { type BreathingStep } from "@/components/BreathingOrb";

type FlowStep = "intro" | "breathing" | "afterBreathing" | "success";

interface EmergencyFlowProps {
  isOpen: boolean;
  onClose: () => void;
}

const BREATH_STEPS: BreathingStep[] = [
  {
    phase: "inhale",
    title: "Tarik Nafas",
    subtitle: "Tarik nafas perlahan melalui hidung",
    helper: "Pelan-pelan saja...",
    duration: 4,
  },
  {
    phase: "exhale",
    title: "Hembuskan",
    subtitle: "Hembuskan perlahan melalui mulut",
    helper: "Lepaskan ketegangan...",
    duration: 4,
  },
  {
    phase: "inhale",
    title: "Tarik Nafas",
    subtitle: "Tarik nafas perlahan melalui hidung",
    helper: "Pelan-pelan saja...",
    duration: 4,
  },
  {
    phase: "exhale",
    title: "Hembuskan",
    subtitle: "Hembuskan perlahan melalui mulut",
    helper: "Lepaskan ketegangan...",
    duration: 4,
  },
];

const AFTER_ACTIONS = [
  { id: "wash-face", emoji: "👐", label: "Cuci muka" },
  { id: "music", emoji: "🎧", label: "Dengar lagu favorit" },
  { id: "move-room", emoji: "🚪", label: "Pindah ruangan" },
];

export default function EmergencyFlow({ isOpen, onClose }: EmergencyFlowProps) {
  const [step, setStep] = useState<FlowStep>("intro");
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const handleBreathingComplete = useCallback(() => {
    setStep("afterBreathing");
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const closeFlow = () => {
    setStep("intro");
    setSelectedAction(null);
    onClose();
  };

  const goBack = () => {
    if (step === "intro") {
      closeFlow();
      return;
    }

    if (step === "breathing") {
      setStep("intro");
      return;
    }

    if (step === "afterBreathing") {
      setStep("breathing");
      return;
    }

    setStep("afterBreathing");
  };

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-y-auto bg-white font-lexend text-[#111111]"
      role="dialog"
      aria-modal="true"
      aria-label="Alur bantuan darurat"
    >
      <div className="mx-auto w-full max-w-2xl">
      {step === "intro" && (
        <section className="relative flex min-h-dvh flex-col px-6 pb-[calc(28px+env(safe-area-inset-bottom))] pt-5">
          <Header title="Bantuan Darurat" onBack={goBack} />

          <div className="flex flex-1 flex-col items-center justify-center pb-16 pt-6 text-center">
            <div className="relative mb-7 flex h-[86px] w-full items-center justify-center">
              <span className="absolute -left-3 top-11 text-[42px] leading-none">☁️</span>
              <div className="flex h-[84px] w-[84px] items-center justify-center rounded-full border-[3px] border-black bg-[#16895F] shadow-[inset_0_0_0_8px_rgba(0,0,0,0.08)]">
                <AlertCircle className="h-10 w-10 text-black" strokeWidth={2.4} />
              </div>
              <span className="absolute -right-2 top-4 text-[42px] leading-none">☁️</span>
            </div>

            <h2 className="mb-2 max-w-[310px] font-poppins text-[27px] font-extrabold italic leading-[1.05] tracking-[-0.7px]">
              Tenang dulu ya...
            </h2>
            <p className="max-w-[265px] text-[16px] leading-[1.35] tracking-[-0.2px]">
              Dorongan ini cuma sementara. Kamu nggak harus lakukan apapun. Mari atur nafas sebentar
            </p>
          </div>

          <button
            onClick={() => setStep("breathing")}
            className="h-[54px] w-full rounded-[10px] bg-[#16895F] text-[15px] font-extrabold text-white transition active:scale-[0.98]"
          >
            Atur pernafasan →
          </button>
        </section>
      )}

      {step === "breathing" && (
        <section className="relative flex min-h-dvh flex-col px-6 pb-8 pt-5">
          <Header title="Bantuan Darurat" onBack={goBack} />

          <button
            onClick={closeFlow}
            aria-label="Tutup bantuan darurat"
            className="absolute right-6 top-5 hidden h-9 w-9 items-center justify-center rounded-full bg-[#F4F4F4] text-[#111111] active:scale-95"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-1 flex-col items-center justify-center pt-4 text-center">
            <BreathingOrb
              steps={BREATH_STEPS}
              active={isOpen && step === "breathing"}
              onComplete={handleBreathingComplete}
            />
          </div>
        </section>
      )}

      {step === "afterBreathing" && (
        <section className="relative flex min-h-dvh flex-col px-6 pb-[calc(28px+env(safe-area-inset-bottom))] pt-5">
          <Header title="Bantuan Darurat" onBack={goBack} />

          <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
            <div className="mb-7 text-[64px] leading-none">🧘‍♀️</div>
            <h2 className="mb-3 max-w-[250px] font-poppins text-[27px] font-extrabold leading-[0.95] tracking-[-0.7px]">
              Bagus, kamu sudah tenang
            </h2>
            <p className="mb-9 max-w-[250px] text-[14px] leading-[1.45]">
              Pilih tindakan di bawah ini buat ‘memutus’ alur pikiran tadi
            </p>

            <div className="flex w-full flex-col gap-3">
              {AFTER_ACTIONS.map((action) => {
                const active = selectedAction === action.id;
                return (
                  <button
                    key={action.id}
                    onClick={() => setSelectedAction(action.id)}
                    className={`flex h-[71px] w-full items-center gap-5 rounded-[10px] border px-8 text-left transition active:scale-[0.99] ${active
                        ? "border-[#16895F] bg-[#E7F3EF] shadow-[0_8px_20px_rgba(22,137,95,0.12)]"
                        : "border-[#E0E0E0] bg-white"
                      }`}
                  >
                    <span className="w-[31px] text-center text-[28px] leading-none">{action.emoji}</span>
                    <span className="text-[17px] font-medium tracking-[-0.2px]">{action.label}</span>
                    {active && <Check className="ml-auto h-6 w-6 text-[#16895F]" />}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setStep("success")}
            className="h-[51px] w-full rounded-[9px] bg-[#16895F] text-[15px] font-extrabold text-white transition active:scale-[0.98] disabled:opacity-50"
          >
            Aku merasa lebih aman
          </button>
        </section>
      )}

      {step === "success" && (
        <section className="relative flex min-h-dvh flex-col px-6 pb-[calc(28px+env(safe-area-inset-bottom))] pt-5">
          <Header title="Bantuan Darurat" onBack={goBack} />

          <div className="flex flex-1 flex-col items-center justify-center pb-12 pt-6 text-center">
            <div className="mb-8 flex h-[92px] w-[92px] items-center justify-center text-[58px] leading-none">
              <ThumbsUp className="h-16 w-16 text-black" />
            </div>
            <h2 className="mb-3 font-poppins text-[27px] font-extrabold uppercase leading-none tracking-[-0.7px]">
              Kamu Hebat
            </h2>
            <p className="max-w-[335px] text-[17px] leading-[1.25] tracking-[-0.2px]">
              Kamu baru saja membuktikan kalau kamu lebih besar dari dorongan. Kemenangan kecil ini akan menjadi senjatamu
            </p>
          </div>

          <button
            onClick={closeFlow}
            className="h-[51px] w-full rounded-[9px] bg-[#16895F] text-[15px] font-extrabold text-white transition active:scale-[0.98]"
          >
            Kembali ke Beranda
          </button>
        </section>
      )}
      </div>
    </div>
  );
}

function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <header className="relative flex w-full shrink-0 items-center justify-center py-2">
      <button
        onClick={onBack}
        aria-label="Kembali"
        className="absolute left-0 flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[#E1E1E1] bg-white text-black transition active:scale-95"
      >
        <ArrowLeft className="h-[19px] w-[19px]" />
      </button>
      <h1 className="font-poppins text-[21px] font-extrabold leading-none tracking-[-0.3px]">
        {title}
      </h1>
    </header>
  );
}
