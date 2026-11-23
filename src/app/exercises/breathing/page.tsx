"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import ScreenHeader from "@/components/ScreenHeader";
import BreathingOrb, {
  type BreathingPhase,
  type BreathingStep,
} from "@/components/BreathingOrb";
import { RotateCcw, Home, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Mascot3DSkeleton from "@/components/Mascot3DSkeleton";
import {
  awardPetXp,
  DEFAULT_PET_STATE,
  getPetProgress,
  getPetSpecies,
  loadPetState,
  type PetState,
} from "@/lib/pets";

const LumifMascot3D = dynamic(() => import("@/components/LumifMascot3D"), {
  ssr: false,
  loading: () => <Mascot3DSkeleton heightClass="h-[168px] sm:h-[200px] lg:h-[230px]" />,
});

const BREATHING_STEPS: BreathingStep[] = [
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

export default function BreathingExerciseScreen() {
  const router = useRouter();

  const [isFinished, setIsFinished] = useState(false);
  const [activePhase, setActivePhase] = useState<BreathingPhase>("inhale");
  const [sessionRunKey, setSessionRunKey] = useState(0);
  const [petState, setPetState] = useState<PetState>(DEFAULT_PET_STATE);
  const [isPetReady, setIsPetReady] = useState(false);
  const breathMixRef = useRef(0);

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => {
      setPetState(loadPetState());
      setIsPetReady(true);
    });
    return () => window.cancelAnimationFrame(raf);
  }, []);

  const handleComplete = useCallback(() => {
    awardPetXp(20);
    setIsFinished(true);
  }, []);

  const handleRestart = () => {
    setIsFinished(false);
    setActivePhase("inhale");
    setSessionRunKey((prev) => prev + 1);
  };

  if (isFinished) {
    return (
      <main className="relative flex min-h-dvh w-full flex-col bg-surface-soft font-sans text-foreground">
        <ScreenHeader
          title="Bantuan Darurat"
          subtitle="Latihan Pernapasan Relaksasi"
          onBack={() => router.back()}
        />

        <section className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-12 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-light text-primary shadow-xs">
            <CheckCircle2 className="h-10 w-10" aria-hidden="true" />
          </div>

          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
            Kamu Hebat
          </h2>

          <p className="mt-3 text-base font-medium leading-relaxed text-muted-foreground">
            Kamu baru saja membuktikan kalau kamu lebih besar dari dorongan.
            Kemenangan kecil ini membantu pikiranmu kembali tenang.
          </p>

          <div className="mt-8 flex w-full flex-col gap-3">
            <button
              type="button"
              onClick={() => router.push("/home")}
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-primary font-heading text-base font-semibold text-primary-foreground shadow-xs transition hover:bg-primary-dark"
            >
              <Home className="h-5 w-5" aria-hidden="true" />
              Kembali ke Beranda
            </button>

            <button
              type="button"
              onClick={handleRestart}
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card font-heading text-base font-semibold text-primary shadow-xs transition hover:bg-muted"
            >
              <RotateCcw className="h-5 w-5" aria-hidden="true" />
              Ulangi Pernapasan
            </button>
          </div>
        </section>
      </main>
    );
  }

  const species = getPetSpecies(petState.speciesId);
  const progress = getPetProgress(petState.xp, species);
  const asset = species.stages[progress.stage];

  return (
    <main className="relative flex min-h-dvh w-full flex-col bg-surface-soft font-sans text-foreground">
      <ScreenHeader
        title="Bantuan Darurat"
        subtitle="Latihan Pernapasan 4-4"
        onBack={() => router.back()}
      />

      <section className="mx-auto flex w-full max-w-5xl flex-1 items-start justify-center px-4 py-3 lg:items-center lg:px-6 lg:py-8">
        <div className="grid w-full grid-cols-1 items-center gap-4 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col items-center lg:col-span-7">
            <BreathingOrb
              key={sessionRunKey}
              steps={BREATHING_STEPS}
              active={!isFinished}
              compact
              onPhaseChange={(phase) => setActivePhase(phase)}
              onBreathMix={(mix) => {
                breathMixRef.current = mix;
              }}
              onComplete={handleComplete}
            />
          </div>

          <div className="rounded-3xl border border-border bg-card p-3.5 shadow-xs sm:p-5 lg:col-span-5">
            {!isPetReady ? (
              <div className="space-y-2.5" aria-busy="true" aria-label="Memuat pendamping napas">
                <Skeleton className="h-4 w-44" />
                <Skeleton className="h-3 w-56" />
                <Mascot3DSkeleton heightClass="h-[168px] sm:h-[200px] lg:h-[230px]" />
              </div>
            ) : (
              <>
                <div className="mb-2 flex items-baseline justify-between gap-2 lg:block lg:mb-3">
                  <h3 className="font-heading text-sm font-bold text-card-foreground sm:text-base">
                    Bernapas Bersama {petState.nickname}
                  </h3>
                  <p className="text-[11px] text-muted-foreground lg:mt-1 lg:text-xs">
                    {species.name} ·{" "}
                    {species.hasEvolution
                      ? `Lv. ${progress.level} (${progress.stageLabel})`
                      : `Lv. ${progress.level}`}
                    <span className="hidden lg:inline">. Ikuti gerakan perlahan saat menarik dan menghembuskan napas.</span>
                  </p>
                </div>
                <LumifMascot3D
                  modelUrl={asset.modelUrl}
                  stage={progress.stage}
                  isEggStage={progress.stage === "egg" && species.hasEvolution}
                  mode="breathing"
                  breathPhase={activePhase}
                  breathMixRef={breathMixRef}
                  heightClass="h-[168px] sm:h-[200px] lg:h-[230px]"
                />
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
