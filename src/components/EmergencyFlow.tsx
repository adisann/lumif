"use client";

import { useEffect, useMemo, useState } from "react";
import { HiArrowLeft, HiCheck, HiXMark } from "react-icons/hi2";
import { FiAlertCircle, FiThumbsUp } from "react-icons/fi";

type FlowStep = "intro" | "breathing" | "afterBreathing" | "success";
type BreathPhase = "inhale" | "exhale";

interface EmergencyFlowProps {
  isOpen: boolean;
  onClose: () => void;
}

const BREATH_STEPS: Array<{
  phase: BreathPhase;
  title: string;
  helper: string;
  color: string;
  outer: string;
  middle: string;
  inner: string;
}> = [
    {
      phase: "inhale",
      title: "Tarik Nafas",
      helper: "Pelan-pelan saja...",
      color: "#16895F",
      outer: "bg-[#9BCDBB]",
      middle: "bg-[#48A57F]",
      inner: "bg-[#188B5F]",
    },
    {
      phase: "exhale",
      title: "Hembuskan",
      helper: "Pelan-pelan saja...",
      color: "#F57C12",
      outer: "bg-[#DCCC95]",
      middle: "bg-[#BFA340]",
      inner: "bg-[#B89A2A]",
    },
    {
      phase: "inhale",
      title: "Tarik Nafas",
      helper: "Pelan-pelan saja...",
      color: "#16895F",
      outer: "bg-[#9BCDBB]",
      middle: "bg-[#48A57F]",
      inner: "bg-[#188B5F]",
    },
    {
      phase: "exhale",
      title: "Hembuskan",
      helper: "Pelan-pelan saja...",
      color: "#F57C12",
      outer: "bg-[#DCCC95]",
      middle: "bg-[#BFA340]",
      inner: "bg-[#B89A2A]",
    },
  ];

const AFTER_ACTIONS = [
  { id: "wash-face", emoji: "👐", label: "Cuci muka" },
  { id: "music", emoji: "🎧", label: "Dengar lagu favorit" },
  { id: "move-room", emoji: "🚪", label: "Pindah ruangan" },
];

export default function EmergencyFlow({ isOpen, onClose }: EmergencyFlowProps) {
  const [step, setStep] = useState<FlowStep>("intro");
  const [breathIndex, setBreathIndex] = useState(0);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const currentBreath = useMemo(() => BREATH_STEPS[breathIndex], [breathIndex]);

  useEffect(() => {
    if (!isOpen) return;
    setStep("intro");
    setBreathIndex(0);
    setSelectedAction(null);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || step !== "breathing") return;

    const timer = window.setTimeout(() => {
      if (breathIndex < BREATH_STEPS.length - 1) {
        setBreathIndex((prev) => prev + 1);
      } else {
        setStep("afterBreathing");
      }
    }, 3200);

    return () => window.clearTimeout(timer);
  }, [isOpen, step, breathIndex]);

  if (!isOpen) return null;

  const closeFlow = () => {
    setStep("intro");
    setBreathIndex(0);
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
      setBreathIndex(0);
      return;
    }

    if (step === "afterBreathing") {
      setStep("breathing");
      setBreathIndex(BREATH_STEPS.length - 1);
      return;
    }

    setStep("afterBreathing");
  };

  const nextBreathStep = () => {
    if (breathIndex < BREATH_STEPS.length - 1) {
      setBreathIndex((prev) => prev + 1);
    } else {
      setStep("afterBreathing");
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-white font-lexend text-[#111111]">
      {step === "intro" && (
        <section className="relative flex min-h-dvh flex-col px-6 pb-[calc(28px+env(safe-area-inset-bottom))] pt-[60px]">
          <Header title="Bantuan Darurat" onBack={goBack} />

          <div className="flex flex-1 flex-col items-center justify-center pb-28 text-center">
            <div className="relative mb-7 flex h-[86px] w-full items-center justify-center">
              <span className="absolute -left-3 top-11 text-[42px] leading-none">☁️</span>
              <div className="flex h-[84px] w-[84px] items-center justify-center rounded-full border-[3px] border-black bg-[#16895F] shadow-[inset_0_0_0_8px_rgba(0,0,0,0.08)]">
                <FiAlertCircle className="h-10 w-10 text-black" strokeWidth={2.4} />
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
        <section className="relative flex min-h-dvh flex-col px-6 pt-[60px]">
          <Header title="Bantuan Darurat" onBack={goBack} />

          <button
            onClick={closeFlow}
            aria-label="Tutup bantuan darurat"
            className="absolute right-6 top-[60px] hidden h-9 w-9 items-center justify-center rounded-full bg-[#F4F4F4] text-[#111111] active:scale-95"
          >
            <HiXMark className="h-5 w-5" />
          </button>

          <div className="flex flex-1 flex-col items-center justify-start pt-[150px] text-center">
            <button
              onClick={nextBreathStep}
              className="relative flex h-[258px] w-[258px] items-center justify-center rounded-full transition active:scale-[0.98]"
              aria-label="Lanjut tahap pernapasan"
            >
              <div
                className={`absolute h-[258px] w-[258px] rounded-full ${currentBreath.outer} transition-all duration-[1400ms] ${currentBreath.phase === "inhale" ? "scale-100" : "scale-95"
                  }`}
              />
              <div
                className={`absolute h-[176px] w-[176px] rounded-full ${currentBreath.middle} transition-all duration-[1400ms] ${currentBreath.phase === "inhale" ? "scale-100" : "scale-90"
                  }`}
              />
              <div
                className={`absolute flex h-[128px] w-[128px] items-center justify-center rounded-full ${currentBreath.inner} transition-all duration-[1400ms] ${currentBreath.phase === "inhale" ? "scale-100" : "scale-95"
                  }`}
              >
                <span className="font-poppins text-[17px] font-extrabold text-white">
                  {currentBreath.title}
                </span>
              </div>
            </button>

            <p
              className="mt-6 font-poppins text-[18px] font-extrabold"
              style={{ color: currentBreath.color }}
            >
              {currentBreath.helper}
            </p>

            <div className="mt-12 flex items-center gap-3">
              {BREATH_STEPS.map((item, index) => {
                const isDoneOrActive = index <= breathIndex;
                return (
                  <div
                    key={`${item.phase}-${index}`}
                    className={`h-[7px] w-[44px] rounded-full transition-all duration-300 ${isDoneOrActive ? "bg-[#F57C12]" : "bg-[#DEDFE1]"
                      }`}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}

      {step === "afterBreathing" && (
        <section className="relative flex min-h-dvh flex-col px-6 pb-[calc(28px+env(safe-area-inset-bottom))] pt-[60px]">
          <Header title="Bantuan Darurat" onBack={goBack} />

          <div className="flex flex-1 flex-col items-center justify-start pt-[115px] text-center">
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
                    {active && <HiCheck className="ml-auto h-6 w-6 text-[#16895F]" />}
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
        <section className="relative flex min-h-dvh flex-col px-6 pb-[calc(28px+env(safe-area-inset-bottom))] pt-[60px]">
          <Header title="Bantuan Darurat" onBack={goBack} />

          <div className="flex flex-1 flex-col items-center justify-center pb-28 text-center">
            <div className="mb-8 flex h-[92px] w-[92px] items-center justify-center text-[58px] leading-none">
              <FiThumbsUp className="h-16 w-16 text-black" />
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
            Kembali ke Dashboard
          </button>
        </section>
      )}
    </div>
  );
}

function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <header className="absolute left-0 top-[60px] flex w-full items-center justify-center px-6">
      <button
        onClick={onBack}
        aria-label="Kembali"
        className="absolute left-6 flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[#E1E1E1] bg-white text-black transition active:scale-95"
      >
        <HiArrowLeft className="h-[19px] w-[19px]" />
      </button>
      <h1 className="font-poppins text-[21px] font-extrabold leading-none tracking-[-0.3px]">
        {title}
      </h1>
    </header>
  );
}
