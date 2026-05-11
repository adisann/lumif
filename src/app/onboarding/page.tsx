"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronUp,
  HeartHandshake,
  LineChart,
  ShieldCheck,
  Sparkles,
  Target,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type IntroStep = {
  kind: "intro";
  title: string;
  description: string;
  image: string;
  accent: string;
};

type Choice = {
  label: string;
  description: string;
  icon: LucideIcon;
  value: string;
};

type QuizStep = {
  kind: "quiz";
  id: "reason" | "trigger" | "method" | "routine";
  title: string;
  description: string;
  image: string;
  choices: Choice[];
};

type FrequencyStep = {
  kind: "frequency";
  id: "frequency";
  title: string;
  description: string;
  image: string;
};

type SummaryStep = {
  kind: "summary";
  title: string;
  description: string;
  image: string;
};

type OnboardingStep = IntroStep | QuizStep | FrequencyStep | SummaryStep;

const STEP_VISUALS: Partial<Record<QuizStep["id"] | FrequencyStep["id"], LucideIcon>> = {
  frequency: LineChart,
  reason: Sparkles,
  trigger: ShieldCheck,
  method: Target,
  routine: HeartHandshake,
};

const STEPS: OnboardingStep[] = [
  {
    kind: "intro",
    title: "Mulai dari satu langkah yang jujur",
    description:
      "Lumif membantu kamu memetakan kebiasaan, memilih jalur pemulihan, dan menjaga progres tanpa rasa dihakimi.",
    image: "/assets/Onboarding Person.png",
    accent: "bg-[#EAF7F1]",
  },
  {
    kind: "intro",
    title: "Rencana yang ikut ritmemu",
    description:
      "Pilih berhenti total atau bertahap, lalu dapatkan rutinitas kecil yang bisa kamu jalankan setiap hari.",
    image: "/assets/journeybro.png",
    accent: "bg-[#FFF5E6]",
  },
  {
    kind: "quiz",
    id: "reason",
    title: "Apa alasan terbesarmu ingin berubah?",
    description: "Jawaban ini membantu Lumif menyesuaikan dukungan awal.",
    image: "/assets/Onboarding 1.png",
    choices: [
      {
        label: "Fokus dan produktivitas",
        description: "Aku ingin energi mentalku kembali stabil.",
        icon: Sparkles,
        value: "focus",
      },
      {
        label: "Relasi lebih sehat",
        description: "Aku ingin hadir lebih utuh untuk orang terdekat.",
        icon: HeartHandshake,
        value: "relationship",
      },
      {
        label: "Kesehatan diri",
        description: "Aku ingin tubuh dan emosiku lebih terawat.",
        icon: ShieldCheck,
        value: "health",
      },
    ],
  },
  {
    kind: "frequency",
    id: "frequency",
    title: "Seberapa sering kebiasaan ini muncul?",
    description: "Geser perlahan sampai angkanya terasa paling mendekati.",
    image: "/assets/chart.png",
  },
  {
    kind: "quiz",
    id: "trigger",
    title: "Pemicu mana yang paling sering datang?",
    description: "Pilih pola yang paling sering kamu rasakan belakangan ini.",
    image: "/assets/Mengenal Pemicu Utama.png",
    choices: [
      {
        label: "Stres atau cemas",
        description: "Muncul saat kepala terlalu penuh.",
        icon: LineChart,
        value: "stress",
      },
      {
        label: "Bosan dan sendirian",
        description: "Datang saat tidak ada aktivitas jelas.",
        icon: CalendarDays,
        value: "boredom",
      },
      {
        label: "Kebiasaan malam",
        description: "Paling sering terjadi sebelum tidur.",
        icon: BookOpen,
        value: "night",
      },
    ],
  },
  {
    kind: "quiz",
    id: "method",
    title: "Kamu ingin mulai dengan cara apa?",
    description: "Tidak ada jawaban paling benar, pilih yang paling realistis.",
    image: "/assets/Onboarding 3.png",
    choices: [
      {
        label: "Berhenti total",
        description: "Mulai dengan batas yang jelas sejak hari ini.",
        icon: Target,
        value: "total",
      },
      {
        label: "Kurangi bertahap",
        description: "Turunkan frekuensi minggu demi minggu.",
        icon: LineChart,
        value: "gradual",
      },
    ],
  },
  {
    kind: "quiz",
    id: "routine",
    title: "Rutinitas pengganti mana yang mau dicoba?",
    description: "Lumif akan menaruh ini sebagai misi awalmu.",
    image: "/assets/routine_breathing.png",
    choices: [
      {
        label: "Latihan napas",
        description: "Cocok untuk meredakan dorongan mendadak.",
        icon: Sparkles,
        value: "breathing",
      },
      {
        label: "Menulis jurnal",
        description: "Bantu kamu membaca pola dan emosi.",
        icon: BookOpen,
        value: "journaling",
      },
      {
        label: "Olahraga ringan",
        description: "Alihkan energi ke gerak yang sehat.",
        icon: Target,
        value: "workout",
      },
    ],
  },
  {
    kind: "summary",
    title: "Rencana awalmu sudah siap",
    description:
      "Masuk ke akun untuk menyimpan hasil quiz, membuka misi harian, dan melanjutkan perjalananmu di Lumif.",
    image: "/assets/check-circle.png",
  },
];

const quizStepCount = STEPS.filter((step) => step.kind !== "intro").length;

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({
    reason: "focus",
    trigger: "stress",
    method: "total",
    routine: "breathing",
  });
  const [frequency, setFrequency] = useState(8);

  const currentStep = STEPS[step];
  const isIntro = currentStep.kind === "intro";
  const isSummary = currentStep.kind === "summary";
  const quizProgress = useMemo(() => {
    const completedSteps = STEPS.slice(0, step + 1).filter(
      (item) => item.kind !== "intro",
    ).length;

    return Math.max(1, completedSteps);
  }, [step]);

  const canContinue =
    currentStep.kind === "quiz" ? Boolean(answers[currentStep.id]) : true;

  const goNext = () => {
    if (step < STEPS.length - 1) {
      setStep((prev) => prev + 1);
      return;
    }

    window.localStorage.setItem(
      "lumif_onboarding",
      JSON.stringify({ ...answers, frequency }),
    );
    router.push("/auth/login");
  };

  const goBack = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
      return;
    }

    router.push("/");
  };

  const skip = () => router.push("/auth");

  return (
    <main className="relative flex min-h-dvh w-full flex-col overflow-y-auto bg-[#FAFAFA] font-lexend text-black">
      <header className="z-20 flex h-[96px] shrink-0 items-center justify-between px-6 pt-6">
        <button
          type="button"
          onClick={goBack}
          className="flex size-12 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white shadow-sm transition active:scale-95"
          aria-label="Kembali"
        >
          <ArrowLeft className="size-5" />
        </button>

        {!isSummary && (
          <button
            type="button"
            onClick={skip}
            className="font-poppins text-sm font-bold text-[#667085] transition hover:text-[#2D936C]"
          >
            Lewati
          </button>
        )}
      </header>

      <section className="flex flex-1 flex-col px-6 pb-4">
        {!isIntro && (
          <div className="mx-auto mb-8 w-full max-w-[416px]">
            <div className="mb-2 flex items-center justify-between font-poppins text-xs font-semibold text-[#667085]">
              <span>Quiz awal</span>
              <span>
                {quizProgress}/{quizStepCount}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#E5E7EB]">
              <div
                className="h-full rounded-full bg-[#2D936C] transition-all duration-500"
                style={{ width: `${(quizProgress / quizStepCount) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div
          key={step}
          className={cn(
            "flex flex-1 flex-col animate-fadeInUp",
            isIntro ? "justify-center" : "justify-start",
          )}
        >
          {isIntro ? (
            <div
              className={cn(
                "mx-auto mb-9 flex aspect-square w-full max-w-[252px] items-center justify-center overflow-hidden rounded-[28px]",
                currentStep.accent,
              )}
            >
              <div className="relative h-[82%] w-[82%]">
                <Image
                  src={currentStep.image}
                  alt={currentStep.title}
                  fill
                  sizes="252px"
                  priority={step < 2}
                  className="object-contain"
                />
              </div>
            </div>
          ) : (
            <StepVisual step={currentStep} />
          )}

          <div className="mx-auto w-full max-w-[380px] text-center">
            <h1 className="font-poppins text-[24px] font-bold leading-[1.18] tracking-normal text-[#101828]">
              {currentStep.title}
            </h1>
            <p className="mx-auto mt-3 max-w-[334px] text-sm leading-6 text-[#667085]">
              {currentStep.description}
            </p>
          </div>

          {currentStep.kind === "quiz" && (
            <div className="mx-auto mt-9 flex w-full max-w-[416px] flex-col gap-4">
              {currentStep.choices.map((choice) => {
                const isActive = answers[currentStep.id] === choice.value;
                const Icon = choice.icon;

                return (
                  <button
                    key={choice.value}
                    type="button"
                    onClick={() =>
                      setAnswers((prev) => ({
                        ...prev,
                        [currentStep.id]: choice.value,
                      }))
                    }
                    className={cn(
                      "flex min-h-[88px] w-full items-center gap-4 rounded-lg border bg-white p-4 text-left shadow-sm transition active:scale-[0.99]",
                      isActive
                        ? "border-[#2D936C] bg-[#F0FBF6]"
                        : "border-[#EAECF0] hover:border-[#B8E4D2]",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-12 shrink-0 items-center justify-center rounded-lg",
                        isActive
                          ? "bg-[#2D936C] text-white"
                          : "bg-[#F2F4F7] text-[#667085]",
                      )}
                    >
                      <Icon className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-poppins text-sm font-bold text-[#101828]">
                        {choice.label}
                      </span>
                      <span className="mt-1.5 block text-xs leading-5 text-[#667085]">
                        {choice.description}
                      </span>
                    </span>
                    {isActive && <Check className="size-5 text-[#2D936C]" />}
                  </button>
                );
              })}
            </div>
          )}

          {currentStep.kind === "frequency" && (
            <div className="mx-auto mt-10 flex w-full max-w-[340px] items-center justify-center gap-4">
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setFrequency((value) => Math.min(35, value + 1))}
                  className="flex size-11 items-center justify-center rounded-lg border border-[#EAECF0] bg-white shadow-sm transition active:scale-95"
                  aria-label="Naikkan frekuensi"
                >
                  <ChevronUp className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setFrequency((value) => Math.max(0, value - 1))}
                  className="flex size-11 items-center justify-center rounded-lg border border-[#EAECF0] bg-white shadow-sm transition active:scale-95"
                  aria-label="Turunkan frekuensi"
                >
                  <ChevronDown className="size-5" />
                </button>
              </div>

              <div className="flex items-end gap-2 rounded-lg bg-white px-6 py-4 shadow-sm">
                <span className="font-poppins text-[56px] font-bold leading-none text-[#101828]">
                  {frequency}
                </span>
                <span className="pb-2 text-sm font-semibold text-[#667085]">
                  kali/minggu
                </span>
              </div>
            </div>
          )}

          {isSummary && (
            <div className="mx-auto mt-9 grid w-full max-w-[416px] grid-cols-2 gap-4">
              <SummaryCard label="Frekuensi" value={`${frequency}x/minggu`} />
              <SummaryCard
                label="Metode"
                value={answers.method === "total" ? "Berhenti total" : "Bertahap"}
              />
              <SummaryCard
                label="Pemicu"
                value={
                  answers.trigger === "stress"
                    ? "Stres"
                    : answers.trigger === "boredom"
                      ? "Bosan"
                      : "Malam"
                }
              />
              <SummaryCard
                label="Misi awal"
                value={
                  answers.routine === "breathing"
                    ? "Latihan napas"
                    : answers.routine === "journaling"
                      ? "Jurnal"
                      : "Olahraga"
                }
              />
            </div>
          )}
        </div>
      </section>

      <footer className="shrink-0 px-6 pb-[calc(48px+env(safe-area-inset-bottom))] pt-8">
        {isIntro && (
          <div className="mb-7 flex items-center justify-center gap-2">
            {STEPS.slice(0, 2).map((_, index) => (
              <span
                key={index}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  step === index ? "w-8 bg-[#2D936C]" : "w-2 bg-[#D0D5DD]",
                )}
              />
            ))}
          </div>
        )}

        <Button
          type="button"
          onClick={goNext}
          disabled={!canContinue}
          className="h-[52px] w-full rounded-lg bg-[#2D936C] font-poppins text-base font-bold text-white shadow-[0_12px_28px_rgba(45,147,108,0.2)] hover:bg-[#257A5A]"
        >
          {isSummary ? "Lanjut ke Login" : isIntro ? "Selanjutnya" : "Simpan jawaban"}
          <ArrowRight className="size-5" />
        </Button>

        <p className="pt-5 text-center text-sm text-[#475467]">
          Sudah punya akun?{" "}
          <button
            type="button"
            onClick={() => router.push("/auth/login")}
            className="font-bold text-[#2D936C]"
          >
            Masuk
          </button>
        </p>
      </footer>
    </main>
  );
}

function StepVisual({ step }: { step: Exclude<OnboardingStep, IntroStep> }) {
  if (step.kind === "summary") {
    return (
      <div className="mx-auto mb-9 flex size-24 items-center justify-center rounded-full bg-[#EAF7F1] shadow-sm">
        <div className="relative size-14">
          <Image
            src={step.image}
            alt={step.title}
            fill
            sizes="56px"
            className="object-contain"
          />
        </div>
      </div>
    );
  }

  const Icon = STEP_VISUALS[step.id] ?? Sparkles;

  return (
    <div className="mx-auto mb-9 flex size-20 items-center justify-center rounded-[24px] bg-[#EAF7F1] text-[#2D936C] shadow-sm">
      <Icon className="size-9" strokeWidth={2.2} />
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#EAECF0] bg-white px-4 py-3 text-left shadow-sm">
      <p className="text-xs font-semibold text-[#667085]">{label}</p>
      <p className="mt-1 font-poppins text-sm font-bold text-[#101828]">
        {value}
      </p>
    </div>
  );
}
