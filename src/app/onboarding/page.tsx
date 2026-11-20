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
  Focus,
  HeartHandshake,
  LineChart,
  Minus,
  Moon,
  Plus,
  ShieldCheck,
  Target,
  Wind,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  saveOnboardingData,
  type OnboardingMethod,
  type OnboardingReason,
  type OnboardingRoutine,
  type OnboardingTrigger,
} from "@/lib/onboarding";

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

const STEPS: OnboardingStep[] = [
  {
    kind: "intro",
    title: "Mulai dari satu langkah yang jujur",
    description:
      "Lumif membantu kamu memetakan kebiasaan, memilih jalur pemulihan, dan menjaga progres tanpa rasa dihakimi.",
    image: "/assets/onboarding-calm.png",
    accent: "bg-[#EAF7F1]",
  },
  {
    kind: "intro",
    title: "Rencana yang ikut ritmemu",
    description:
      "Pilih berhenti total atau bertahap, lalu dapatkan rutinitas kecil yang bisa kamu jalankan setiap hari.",
    image: "/assets/onboarding-journey.png",
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
        icon: Focus,
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
        icon: Moon,
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
        icon: Wind,
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

    saveOnboardingData({
      reason: answers.reason as OnboardingReason,
      trigger: answers.trigger as OnboardingTrigger,
      method: answers.method as OnboardingMethod,
      routine: answers.routine as OnboardingRoutine,
      frequency,
    });
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
    <main className="relative flex min-h-dvh w-full flex-col bg-surface-soft px-4 py-5 font-sans text-foreground sm:px-6 sm:py-8">
      <header className="mx-auto flex w-full max-w-[540px] shrink-0 items-center justify-between pb-4">
        <button
          type="button"
          onClick={goBack}
          className="flex size-11 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-xs transition hover:bg-muted active:scale-95"
          aria-label="Kembali"
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
        </button>

        {!isSummary && (
          <button
            type="button"
            onClick={skip}
            className="min-h-[44px] rounded-xl px-3 font-heading text-sm font-bold text-muted-foreground transition hover:bg-muted hover:text-primary"
          >
            Lewati
          </button>
        )}
      </header>

      <div className="mx-auto flex w-full max-w-[540px] flex-1 flex-col items-center justify-center pb-4">
        <section className="w-full rounded-3xl border border-border bg-card p-6 shadow-xs sm:p-8">
          {!isIntro && (
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between font-poppins text-xs font-semibold">
                <span className="text-brand-orange-ink">Quiz awal</span>
                <span className="text-muted-foreground">
                  {quizProgress}/{quizStepCount}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${(quizProgress / quizStepCount) * 100}%` }}
                />
              </div>
            </div>
          )}

          <div key={step} className="animate-fadeInUp">
            {isIntro && (
              <div
                className={cn(
                  "mx-auto mb-6 flex aspect-square w-full max-w-[240px] items-center justify-center overflow-hidden rounded-[24px] border border-border/60 shadow-xs sm:max-w-[272px]",
                  currentStep.accent,
                )}
              >
                <div className="relative h-full w-full">
                  <Image
                    src={currentStep.image}
                    alt={currentStep.title}
                    fill
                    sizes="(min-width: 640px) 272px, 240px"
                    priority={step < 2}
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            <div className="mx-auto max-w-[42ch] text-center">
              {isIntro && (
                <p className="mb-2 font-poppins text-xs font-bold text-brand-orange-ink">
                  Langkah {step + 1} dari 2
                </p>
              )}
              <h1 className="font-poppins text-2xl font-bold leading-snug tracking-tight text-foreground">
                {currentStep.title}
              </h1>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                {currentStep.description}
              </p>
            </div>

            {currentStep.kind === "quiz" && (
              <div className="mt-7 flex flex-col gap-3">
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
                      aria-pressed={isActive}
                      className={cn(
                        "flex min-h-[76px] w-full items-center gap-4 rounded-2xl border p-4 text-left transition active:scale-[0.99]",
                        isActive
                          ? "border-primary bg-primary-light"
                          : "border-border bg-surface-soft hover:border-primary/40",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-11 shrink-0 items-center justify-center rounded-xl",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "bg-card text-muted-foreground",
                        )}
                      >
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-poppins text-sm font-bold text-foreground">
                          {choice.label}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                          {choice.description}
                        </span>
                      </span>
                      {isActive && (
                        <Check
                          className="size-5 shrink-0 text-primary"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {currentStep.kind === "frequency" && (
              <div className="mt-7 rounded-2xl border border-border bg-surface-soft p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setFrequency((value) => Math.max(0, value - 1))}
                    className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-xs transition hover:bg-muted active:scale-95"
                    aria-label="Turunkan frekuensi"
                  >
                    <Minus className="size-5" aria-hidden="true" />
                  </button>

                  <div className="flex items-baseline justify-center gap-2">
                    <span className="font-poppins text-5xl font-bold leading-none tabular-nums text-brand-orange">
                      {frequency}
                    </span>
                    <span className="text-sm font-semibold text-muted-foreground">
                      kali/minggu
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setFrequency((value) => Math.min(35, value + 1))}
                    className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-xs transition hover:bg-muted active:scale-95"
                    aria-label="Naikkan frekuensi"
                  >
                    <Plus className="size-5" aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-5">
                  <input
                    type="range"
                    min={0}
                    max={35}
                    value={frequency}
                    onChange={(event) => setFrequency(Number(event.target.value))}
                    aria-label="Frekuensi kebiasaan per minggu"
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
                  />
                  <div className="mt-2 flex justify-between text-[11px] font-medium text-muted-foreground">
                    <span>0 kali</span>
                    <span>14 kali</span>
                    <span>35 kali</span>
                  </div>
                </div>
              </div>
            )}

            {isSummary && (
              <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
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

          <div className="mt-7">
            {isIntro && (
              <div className="mb-5 flex items-center justify-center gap-2">
                {STEPS.slice(0, 2).map((_, index) => (
                  <span
                    key={index}
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      step === index ? "w-8 bg-primary" : "w-2 bg-border",
                    )}
                  />
                ))}
              </div>
            )}

            <Button
              type="button"
              onClick={goNext}
              disabled={!canContinue}
              className="h-12 w-full rounded-xl bg-primary font-heading text-sm font-bold text-primary-foreground shadow-xs hover:bg-primary-dark sm:text-base"
            >
              {isSummary ? "Lanjut ke Login" : isIntro ? "Selanjutnya" : "Simpan jawaban"}
              <ArrowRight className="size-4 sm:size-5" aria-hidden="true" />
            </Button>
          </div>
        </section>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <button
            type="button"
            onClick={() => router.push("/auth/login")}
            className="font-bold text-primary hover:underline"
          >
            Masuk
          </button>
        </p>
      </div>
    </main>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface-soft px-4 py-3.5 text-left">
      <p className="text-xs font-semibold text-brand-orange-ink">{label}</p>
      <p className="mt-1 font-poppins text-sm font-bold text-foreground">
        {value}
      </p>
    </div>
  );
}
