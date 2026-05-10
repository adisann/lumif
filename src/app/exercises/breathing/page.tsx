"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { HiArrowLeft } from "react-icons/hi2";

type BreathingPhase = "inhale" | "exhale";

type BreathingStep = {
  phase: BreathingPhase;
  title: string;
  subtitle: string;
  helper: string;
  duration: number;
  theme: {
    main: string;
    middle: string;
    outer: string;
    text: string;
    progress: string;
  };
};

const BREATHING_STEPS: BreathingStep[] = [
  {
    phase: "inhale",
    title: "Tarik Nafas",
    subtitle: "Tarik nafas perlahan melalui hidung",
    helper: "Pelan-pelan saja...",
    duration: 4,
    theme: {
      main: "#178B5D",
      middle: "#3C9F78",
      outer: "#9ACDBA",
      text: "#178B5D",
      progress: "#FF7A00",
    },
  },
  {
    phase: "exhale",
    title: "Hembuskan",
    subtitle: "Hembuskan perlahan melalui mulut",
    helper: "Pelan-pelan saja...",
    duration: 4,
    theme: {
      main: "#B79A28",
      middle: "#C5AD4E",
      outer: "#DED09B",
      text: "#FF7A00",
      progress: "#FF7A00",
    },
  },
  {
    phase: "inhale",
    title: "Tarik Nafas",
    subtitle: "Tarik nafas perlahan melalui hidung",
    helper: "Pelan-pelan saja...",
    duration: 4,
    theme: {
      main: "#178B5D",
      middle: "#3C9F78",
      outer: "#9ACDBA",
      text: "#178B5D",
      progress: "#FF7A00",
    },
  },
  {
    phase: "exhale",
    title: "Hembuskan",
    subtitle: "Hembuskan perlahan melalui mulut",
    helper: "Pelan-pelan saja...",
    duration: 4,
    theme: {
      main: "#B79A28",
      middle: "#C5AD4E",
      outer: "#DED09B",
      text: "#FF7A00",
      progress: "#FF7A00",
    },
  },
];

export default function BreathingExerciseScreen() {
  const router = useRouter();

  const [stepIndex, setStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(BREATHING_STEPS[0].duration);
  const [isFinished, setIsFinished] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const currentStep = BREATHING_STEPS[stepIndex];
  const isInhale = currentStep.phase === "inhale";

  const completedSteps = useMemo(() => {
    return isFinished ? BREATHING_STEPS.length : stepIndex;
  }, [isFinished, stepIndex]);

  const totalDuration = currentStep.duration;
  const elapsed = totalDuration - timeLeft;
  const phaseProgress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

  useEffect(() => {
    if (isFinished) return;

    const timer = window.setTimeout(() => {
      if (timeLeft > 1) {
        setTimeLeft((prev) => prev - 1);
        return;
      }

      const nextIndex = stepIndex + 1;

      if (nextIndex >= BREATHING_STEPS.length) {
        setIsFinished(true);
        return;
      }

      setStepIndex(nextIndex);
      setTimeLeft(BREATHING_STEPS[nextIndex].duration);
      setAnimationKey((prev) => prev + 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [timeLeft, stepIndex, isFinished]);

  const handleRestart = () => {
    setStepIndex(0);
    setTimeLeft(BREATHING_STEPS[0].duration);
    setIsFinished(false);
    setAnimationKey((prev) => prev + 1);
  };

  if (isFinished) {
    return (
      <main className="relative flex h-dvh w-full flex-col overflow-hidden bg-white font-lexend text-black">
        <header className="shrink-0 px-[24px] pb-[16px] pt-[20px]">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[#E5E5E5] bg-white transition active:scale-95"
            >
              <HiArrowLeft className="h-[18px] w-[18px] text-black" />
            </button>

            <h1 className="mr-[34px] flex-1 text-center font-poppins text-[20px] font-bold tracking-[-0.4px]">
              Bantuan Darurat
            </h1>
          </div>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center px-[24px] pb-[120px] text-center">
          <div className="mb-[22px] text-[58px] leading-none">👍</div>

          <h2 className="font-poppins text-[28px] font-extrabold leading-[34px] tracking-[-0.7px] text-black">
            KAMU HEBAT
          </h2>

          <p className="mt-[10px] max-w-[330px] text-[17px] font-medium leading-[25px] text-[#1E1E1E]">
            Kamu baru saja membuktikan kalau kamu lebih besar dari dorongan.
            Kemenangan kecil ini akan menjadi senjatamu
          </p>

          <div className="mt-[34px] flex w-full flex-col gap-[12px]">
            <button
              type="button"
              onClick={() => router.back()}
              className="h-[54px] w-full rounded-[10px] bg-[#178B5D] font-poppins text-[16px] font-bold text-white transition active:scale-[0.98]"
            >
              Kembali ke Dashboard
            </button>

            <button
              type="button"
              onClick={handleRestart}
              className="h-[54px] w-full rounded-[10px] border border-[#E5E5E5] bg-white font-poppins text-[16px] font-bold text-[#178B5D] transition active:scale-[0.98]"
            >
              Ulangi Pernafasan
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="relative flex h-dvh w-full flex-col overflow-hidden bg-white font-lexend text-black">
      <header className="shrink-0 px-[24px] pb-[16px] pt-[20px]">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[#E5E5E5] bg-white transition active:scale-95"
          >
            <HiArrowLeft className="h-[18px] w-[18px] text-black" />
          </button>

          <h1 className="mr-[34px] flex-1 text-center font-poppins text-[20px] font-bold tracking-[-0.4px]">
            Bantuan Darurat
          </h1>
        </div>
      </header>

      <section className="flex flex-1 flex-col items-center px-[24px] pt-[92px]">
        <button
          key={animationKey}
          type="button"
          onClick={() => {
            const nextIndex = stepIndex + 1;

            if (nextIndex >= BREATHING_STEPS.length) {
              setIsFinished(true);
              return;
            }

            setStepIndex(nextIndex);
            setTimeLeft(BREATHING_STEPS[nextIndex].duration);
            setAnimationKey((prev) => prev + 1);
          }}
          className="relative flex h-[258px] w-[258px] items-center justify-center rounded-full transition active:scale-[0.98]"
          aria-label="Lanjut ke tahap pernafasan berikutnya"
        >
          <div
            className="absolute inset-0 rounded-full transition-all ease-in-out"
            style={{
              backgroundColor: currentStep.theme.outer,
              transform: isInhale ? "scale(1)" : "scale(1.16)",
              opacity: isInhale ? 0.95 : 0.9,
              transitionDuration: `${currentStep.duration * 1000}ms`,
            }}
          />

          <div
            className="absolute h-[200px] w-[200px] rounded-full transition-all ease-in-out"
            style={{
              backgroundColor: currentStep.theme.middle,
              transform: isInhale ? "scale(1.05)" : "scale(0.9)",
              transitionDuration: `${currentStep.duration * 1000}ms`,
            }}
          />

          <div
            className="absolute h-[148px] w-[148px] rounded-full transition-all ease-in-out"
            style={{
              backgroundColor: currentStep.theme.main,
              transform: isInhale ? "scale(1.08)" : "scale(0.86)",
              transitionDuration: `${currentStep.duration * 1000}ms`,
            }}
          />

          <div className="relative z-10 flex flex-col items-center">
            <p className="font-poppins text-[18px] font-bold text-white">
              {currentStep.title}
            </p>

            <p className="mt-[4px] font-poppins text-[30px] font-extrabold leading-none text-white">
              {timeLeft}
            </p>
          </div>

          <div
            className="absolute -bottom-[16px] h-[26px] w-[120px] rounded-full blur-[22px] transition-all duration-700"
            style={{
              backgroundColor: currentStep.theme.outer,
              opacity: 0.45,
            }}
          />
        </button>

        <div className="mt-[26px] text-center">
          <h2
            className="font-poppins text-[20px] font-bold tracking-[-0.3px]"
            style={{ color: currentStep.theme.text }}
          >
            {currentStep.helper}
          </h2>

          <p className="mt-[8px] max-w-[280px] text-[13px] leading-[19px] text-[#8B8FA0]">
            {currentStep.subtitle}
          </p>
        </div>

        <div className="mt-[46px] flex items-center justify-center gap-[10px]">
          {BREATHING_STEPS.map((step, index) => {
            const isActive = index === stepIndex;
            const isCompleted = index < completedSteps;

            return (
              <button
                key={`${step.phase}-${index}`}
                type="button"
                onClick={() => {
                  setStepIndex(index);
                  setTimeLeft(BREATHING_STEPS[index].duration);
                  setIsFinished(false);
                  setAnimationKey((prev) => prev + 1);
                }}
                className="h-[7px] overflow-hidden rounded-full bg-[#DEDEE0] transition-all active:scale-95"
                style={{
                  width: isActive || isCompleted ? 44 : 44,
                }}
                aria-label={`Tahap ${index + 1}: ${step.title}`}
              >
                <span
                  className="block h-full rounded-full transition-all duration-500"
                  style={{
                    width: isCompleted
                      ? "100%"
                      : isActive
                        ? `${phaseProgress}%`
                        : "0%",
                    backgroundColor: currentStep.theme.progress,
                  }}
                />
              </button>
            );
          })}
        </div>

        <div className="mt-[28px] flex items-center gap-[8px] rounded-full bg-[#F7F8FA] px-[14px] py-[9px]">
          <span className="h-[8px] w-[8px] rounded-full bg-[#178B5D]" />
          <p className="text-[12px] font-semibold text-[#6F7280]">
            {stepIndex + 1} dari {BREATHING_STEPS.length} tahap
          </p>
        </div>
      </section>
    </main>
  );
}