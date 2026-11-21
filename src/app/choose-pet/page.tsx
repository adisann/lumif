"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Egg, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import {
  getPetSpecies,
  selectStarterEgg,
  STARTER_EGGS,
  type PetSpeciesId,
} from "@/lib/pets";
import { syncOnboardingToSupabase } from "@/lib/onboarding";

const LumifMascot3D = dynamic(() => import("@/components/LumifMascot3D"), {
  ssr: false,
});

export default function ChoosePetPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [selectedId, setSelectedId] = useState<PetSpeciesId>("duck");
  const [nickname, setNickname] = useState(getPetSpecies("duck").defaultNickname);
  const [greetingSignal, setGreetingSignal] = useState(0);
  const [isHatching, setIsHatching] = useState(false);

  const selectedEgg = useMemo(
    () => STARTER_EGGS.find((item) => item.speciesId === selectedId) ?? STARTER_EGGS[0],
    [selectedId]
  );
  const selectedSpecies = useMemo(() => getPetSpecies(selectedId), [selectedId]);

  useEffect(() => {
    let active = true;
    const checkAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!active) return;
        if (!user) {
          const demoUser =
            typeof window !== "undefined"
              ? window.localStorage.getItem("lumif_demo_user")
              : null;
          if (!demoUser) {
            router.replace("/login");
          }
        }
      } catch {
        const demoUser =
          typeof window !== "undefined"
            ? window.localStorage.getItem("lumif_demo_user")
            : null;
        if (active && !demoUser) {
          router.replace("/login");
        }
      }
    };
    checkAuth();
    return () => {
      active = false;
    };
  }, [router, supabase]);

  const handleSelectEgg = (speciesId: PetSpeciesId) => {
    if (isHatching) return;
    setSelectedId(speciesId);
    setNickname(getPetSpecies(speciesId).defaultNickname);
    setGreetingSignal((prev) => prev + 1);
  };

  const handleConfirm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isHatching) return;

    const finalNickname = nickname.trim() || selectedSpecies.defaultNickname;
    setIsHatching(true);
    setGreetingSignal((prev) => prev + 1);

    selectStarterEgg(selectedId, finalNickname);

    try {
      await supabase.auth.updateUser({
        data: {
          pet_species: selectedId,
          pet_name: finalNickname,
        },
      });
      await syncOnboardingToSupabase(supabase, {
        petSpecies: selectedId,
        petName: finalNickname,
      });
    } catch {
      // Offline demo fallback already saved to localStorage
    }

    window.setTimeout(() => {
      router.replace("/home");
    }, 850);
  };

  return (
    <main className="relative flex min-h-dvh w-full flex-col justify-center bg-surface-soft px-4 py-8 font-sans text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-6 text-center md:mb-8">
          <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Pilih <span className="text-brand-orange-ink">Telur Pendampingmu</span>
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
            Pilih satu telur pendamping secara gratis. Pendamping ini akan menetas dan menemanimu menjaga rutinitas harian di beranda.
          </p>
        </div>

        <form
          onSubmit={handleConfirm}
          className="grid grid-cols-1 gap-6 rounded-3xl border border-border bg-card p-5 shadow-xs sm:p-7 lg:grid-cols-12 lg:items-center"
        >
          {/* Left: 3D Egg Stage */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-border bg-surface-soft p-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-primary">
                  {isHatching ? "Sedang Menetas..." : "Tahap Telur"}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  Calon: {selectedEgg.hatchPreviewName}
                </span>
              </div>

              <LumifMascot3D
                modelUrl={
                  isHatching
                    ? "/models/hatching-egg-ff3379.glb"
                    : "/models/manutara-egg-d257f8.glb"
                }
                stage="egg"
                isEggStage={true}
                tintHex={selectedEgg.shellHex}
                showHabitat={true}
                greetingSignal={greetingSignal}
                heightClass="h-[240px] sm:h-[280px]"
              />

              <div className="mt-3 rounded-xl bg-card px-3.5 py-2.5 text-center">
                <p className="font-heading text-sm font-bold text-foreground">
                  {selectedEgg.eggName}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {selectedEgg.eggSubtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Right: 4 Free Starter Eggs + Nickname + CTA */}
          <div className="flex flex-col gap-5 lg:col-span-7">
            <div>
              <p className="mb-2.5 text-xs font-bold text-muted-foreground">
                Pilih 1 dari 4 telur pendamping gratis
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {STARTER_EGGS.map((egg) => {
                  const isSelected = egg.speciesId === selectedId;

                  return (
                    <button
                      key={egg.speciesId}
                      type="button"
                      disabled={isHatching}
                      onClick={() => handleSelectEgg(egg.speciesId)}
                      aria-pressed={isSelected}
                      className={`flex min-h-[82px] items-start justify-between gap-3 rounded-2xl border p-3.5 text-left transition-colors ${
                        isSelected
                          ? "border-primary bg-primary-light"
                          : "border-border bg-surface-soft hover:border-primary/40"
                      }`}
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <span
                          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-black/10"
                          style={{ backgroundColor: egg.shellHex }}
                          aria-hidden="true"
                        >
                          <Egg className="h-4 w-4 text-[#1E293B]" />
                        </span>
                        <div className="min-w-0">
                          <p className="font-heading text-sm font-bold text-foreground">
                            {egg.eggName}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Menetas: {egg.hatchPreviewName}
                          </p>
                        </div>
                      </div>

                      {isSelected && (
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <PenLine className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                Beri nama panggilan pendampingmu
              </span>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                disabled={isHatching}
                maxLength={24}
                placeholder={`Contoh: ${selectedSpecies.defaultNickname}`}
                className="h-12 w-full rounded-xl border border-input bg-background px-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </label>

            <Button
              type="submit"
              disabled={isHatching}
              className="h-12 w-full rounded-xl bg-primary font-heading text-sm font-bold text-primary-foreground hover:bg-primary-dark"
            >
              {isHatching ? (
                "Menetaskan telur..."
              ) : (
                <>
                  Tetaskan Telur & Masuk Beranda
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
