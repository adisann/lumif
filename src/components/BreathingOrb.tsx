"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";

export type BreathingPhase = "inhale" | "exhale";

export type BreathingStep = {
  phase: BreathingPhase;
  title: string;
  subtitle?: string;
  helper: string;
  duration: number;
};

type BreathingOrbProps = {
  steps: BreathingStep[];
  active?: boolean;
  compact?: boolean;
  onPhaseChange?: (phase: BreathingPhase, stepIndex: number) => void;
  onBreathMix?: (mix: number) => void;
  onComplete: () => void;
};

export default function BreathingOrb({
  steps,
  active = true,
  compact = false,
  onPhaseChange,
  onBreathMix,
  onComplete,
}: BreathingOrbProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [phaseFraction, setPhaseFraction] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const accumulatedMsRef = useRef(0);
  const lastFrameRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);
  const onPhaseChangeRef = useRef(onPhaseChange);
  const onBreathMixRef = useRef(onBreathMix);
  const completedRef = useRef(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    onPhaseChangeRef.current = onPhaseChange;
  }, [onPhaseChange]);

  useEffect(() => {
    onBreathMixRef.current = onBreathMix;
  }, [onBreathMix]);

  const safeStepIndex = Math.min(stepIndex, Math.max(0, steps.length - 1));
  const currentStep = steps[safeStepIndex];

  useEffect(() => {
    onPhaseChangeRef.current?.(currentStep.phase, safeStepIndex);
  }, [currentStep.phase, safeStepIndex]);

  useEffect(() => {
    if (!active || isPaused || completedRef.current) {
      lastFrameRef.current = null;
      return;
    }

    let rafId = 0;
    const durationMs = Math.max(1000, currentStep.duration * 1000);

    const tick = (now: number) => {
      if (lastFrameRef.current === null) {
        lastFrameRef.current = now;
      }

      const delta = Math.min(100, now - lastFrameRef.current);
      lastFrameRef.current = now;
      accumulatedMsRef.current += delta;

      const rawProgress = Math.min(1, accumulatedMsRef.current / durationMs);
      const tickEased = (1 - Math.cos(Math.PI * rawProgress)) / 2;
      const tickMix =
        currentStep.phase === "inhale" ? tickEased : 1 - tickEased;
      onBreathMixRef.current?.(tickMix);
      setPhaseFraction(rawProgress);

      if (rawProgress >= 1) {
        accumulatedMsRef.current = 0;
        lastFrameRef.current = now;

        if (safeStepIndex + 1 >= steps.length) {
          completedRef.current = true;
          onCompleteRef.current();
          return;
        }

        setPhaseFraction(0);
        setStepIndex((prev) => prev + 1);
        return;
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(rafId);
      lastFrameRef.current = null;
    };
    }, [active, isPaused, currentStep.duration, currentStep.phase, safeStepIndex, steps.length]);

  const isInhale = currentStep.phase === "inhale";
  const eased = (1 - Math.cos(Math.PI * phaseFraction)) / 2;
  const breathMix = isInhale ? eased : 1 - eased;

  const remainingSeconds = Math.max(
    1,
    Math.ceil(currentStep.duration * (1 - phaseFraction))
  );

  const outerScale = 0.78 + breathMix * 0.34;
  const middleScale = 0.8 + breathMix * 0.28;
  const coreScale = 0.86 + breathMix * 0.2;

  const palette = isInhale
    ? {
        outer: "#B8E6D4",
        middle: "#47A480",
        core: "#257B5A",
        text: "#257B5A",
        ringStroke: "#EDBF45",
      }
    : {
        outer: "#FFE1BF",
        middle: "#FFA23A",
        core: "#E06D00",
        text: "#CC6500",
        ringStroke: "#FFFFFF",
      };

  const ringRadius = 67;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - phaseFraction);

  const advanceStep = () => {
    accumulatedMsRef.current = 0;
    lastFrameRef.current = null;
    setPhaseFraction(0);
    if (safeStepIndex + 1 >= steps.length) {
      completedRef.current = true;
      onComplete();
      return;
    }
    setStepIndex((prev) => prev + 1);
  };

  const resetAll = () => {
    completedRef.current = false;
    accumulatedMsRef.current = 0;
    lastFrameRef.current = null;
    setIsPaused(false);
    setPhaseFraction(0);
    setStepIndex(0);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Breathing Orb */}
      <button
        type="button"
        onClick={advanceStep}
        className={`relative flex items-center justify-center rounded-full focus-visible:outline-2 ${
          compact
            ? "h-[164px] w-[164px] lg:h-[280px] lg:w-[280px]"
            : "h-[280px] w-[280px]"
        }`}
        aria-label={`${currentStep.title}, sisa ${remainingSeconds} detik. Klik untuk lanjut ke tahap berikutnya.`}
      >
        {/* Outer Halo */}
        <span
          aria-hidden="true"
          className={`pointer-events-none rounded-full transition-colors duration-700 ${
            compact
              ? "absolute h-[142px] w-[142px] lg:h-[240px] lg:w-[240px]"
              : "absolute h-[240px] w-[240px]"
          }`}
          style={{
            backgroundColor: palette.outer,
            opacity: 0.45 + breathMix * 0.45,
            transform: `scale(${outerScale})`,
            boxShadow: `0 0 ${18 + breathMix * 28}px ${isInhale ? "rgba(45, 147, 108, 0.22)" : "rgba(255, 130, 0, 0.22)"}`,
          }}
        />

        {/* Middle Ring */}
        <span
          aria-hidden="true"
          className={`pointer-events-none rounded-full transition-colors duration-700 ${
            compact
              ? "absolute h-[114px] w-[114px] lg:h-[192px] lg:w-[192px]"
              : "absolute h-[192px] w-[192px]"
          }`}
          style={{
            backgroundColor: palette.middle,
            opacity: 0.78 + breathMix * 0.2,
            transform: `scale(${middleScale})`,
          }}
        />

        {/* Core Breathing Sphere + 60fps Progress Arc */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute flex items-center justify-center rounded-full shadow-lg transition-colors duration-700 ${
            compact
              ? "h-[90px] w-[90px] lg:h-[146px] lg:w-[146px]"
              : "h-[146px] w-[146px]"
          }`}
          style={{
            backgroundColor: palette.core,
            transform: `scale(${coreScale})`,
          }}
        >
          <svg
            className={`-rotate-90 ${
              compact
                ? "h-[90px] w-[90px] lg:h-[146px] lg:w-[146px]"
                : "h-[146px] w-[146px]"
            }`}
            viewBox="0 0 146 146"
          >
            <circle
              cx="73"
              cy="73"
              r={ringRadius}
              fill="none"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="4"
            />
            <circle
              cx="73"
              cy="73"
              r={ringRadius}
              fill="none"
              stroke={palette.ringStroke}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={ringCircumference}
              strokeDashoffset={ringOffset}
            />
          </svg>
        </span>

        <span className="relative z-10 flex flex-col items-center text-white select-none">
          <span
            className={`font-heading font-bold tracking-tight ${
              compact ? "text-xs lg:text-lg" : "text-base sm:text-lg"
            }`}
          >
            {currentStep.title}
          </span>
          <span
            className={`mt-0.5 font-heading font-extrabold leading-none tabular-nums ${
              compact ? "text-2xl lg:mt-1 lg:text-4xl" : "mt-1 text-4xl"
            }`}
          >
            {remainingSeconds}
          </span>
        </span>
      </button>

      {/* Instruction Copy */}
      <div className={compact ? "mt-2 text-center lg:mt-5" : "mt-5 text-center"}>
        <h2
          className={`font-heading font-bold tracking-tight transition-colors duration-500 ${
            compact ? "text-lg lg:text-2xl" : "text-2xl"
          }`}
          style={{ color: palette.text }}
        >
          {currentStep.helper}
        </h2>

        {currentStep.subtitle && (
          <p
            className={`max-w-xs leading-relaxed text-muted-foreground ${
              compact ? "mt-0.5 text-xs lg:mt-1.5 lg:text-sm" : "mt-1.5 text-sm"
            }`}
          >
            {currentStep.subtitle}
          </p>
        )}
      </div>

      {/* Smooth Continuous Phase Progress Bars */}
      <div
        className={`flex items-center justify-center gap-2 ${
          compact ? "mt-3 lg:mt-6" : "mt-6"
        }`}
      >
        {steps.map((step, index) => {
          const widthPct =
            index < safeStepIndex
              ? 100
              : index === safeStepIndex
                ? Math.round(phaseFraction * 1000) / 10
                : 0;

          return (
            <button
              key={`${step.phase}-${index}`}
              type="button"
              onClick={() => {
                accumulatedMsRef.current = 0;
                lastFrameRef.current = null;
                setPhaseFraction(0);
                setStepIndex(index);
              }}
              className="h-2.5 w-12 overflow-hidden rounded-full bg-muted"
              aria-label={`Tahap ${index + 1}: ${step.title}`}
            >
              <span
                className="block h-full rounded-full bg-brand-orange"
                style={{ width: `${widthPct}%` }}
              />
            </button>
          );
        })}
      </div>

      {/* Interactive Controls */}
      <div
        className={`flex items-center gap-3 ${
          compact ? "mt-3 lg:mt-5" : "mt-5"
        }`}
      >
        <button
          type="button"
          onClick={() => setIsPaused((prev) => !prev)}
          className={`inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 text-xs font-bold text-foreground shadow-xs transition hover:bg-muted ${
            compact ? "min-h-[38px] lg:min-h-[44px]" : "min-h-[44px]"
          }`}
        >
          {isPaused ? (
            <>
              <Play className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span>Lanjutkan</span>
            </>
          ) : (
            <>
              <Pause className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span>Jeda</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={resetAll}
          className={`inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 text-xs font-bold text-muted-foreground shadow-xs transition hover:bg-muted hover:text-foreground ${
            compact ? "min-h-[38px] lg:min-h-[44px]" : "min-h-[44px]"
          }`}
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Ulang</span>
        </button>
      </div>

      <p
        className={`text-xs font-semibold text-muted-foreground ${
          compact ? "mt-2 lg:mt-3" : "mt-3"
        }`}
      >
        Tahap {safeStepIndex + 1} dari {steps.length}
      </p>
    </div>
  );
}
