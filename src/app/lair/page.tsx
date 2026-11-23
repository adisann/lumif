"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import BottomNav from "@/components/BottomNav";
import ScreenHeader from "@/components/ScreenHeader";
import PetPurchaseConfirmDialog from "@/components/PetPurchaseConfirmDialog";
import Mascot3DSkeleton from "@/components/Mascot3DSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import {
  careForPet,
  DEFAULT_PET_STATE,
  getPetCondition,
  getPetProgress,
  getPetSpecies,
  getSpeciesNickname,
  getSpeciesXp,
  loadPetState,
  PET_SPECIES,
  renamePetSpecies,
  setActivePet,
  subscribePetState,
  unlockPetSpecies,
  type PetSpeciesId,
  type PetStage,
  type PetState,
} from "@/lib/pets";
import {
  Award,
  Check,
  ChevronLeft,
  ChevronRight,
  Coins,
  Heart,
  Lock,
  PenLine,
} from "lucide-react";

const LumifMascot3D = dynamic(() => import("@/components/LumifMascot3D"), {
  ssr: false,
  loading: () => <Mascot3DSkeleton heightClass="h-[240px] sm:h-[280px]" />,
});

export default function PetLairPage() {
  const [petState, setPetState] = useState<PetState>(DEFAULT_PET_STATE);
  const [isLoadingPet, setIsLoadingPet] = useState(true);
  const [tab, setTab] = useState<"lair" | "shop">("lair");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previewStage, setPreviewStage] = useState<PetStage | null>(null);
  const [greetingSignal, setGreetingSignal] = useState(0);
  const [statusNotice, setStatusNotice] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);
  const [draftNickname, setDraftNickname] = useState("");
  const [pendingBuyPetId, setPendingBuyPetId] = useState<PetSpeciesId | null>(null);
  const [buySuccess, setBuySuccess] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => {
      const loaded = loadPetState();
      setPetState(loaded);
      const activeIdx = loaded.unlockedSpecies.indexOf(loaded.speciesId);
      if (activeIdx >= 0) setCurrentIndex(activeIdx);
      setIsLoadingPet(false);
    });
    const unsub = subscribePetState(() => {
      setPetState(loadPetState());
    });
    return () => {
      window.cancelAnimationFrame(raf);
      unsub();
    };
  }, []);

  const ownedList = petState.unlockedSpecies.map((id) => getPetSpecies(id));
  const safeIndex = Math.min(currentIndex, Math.max(0, ownedList.length - 1));
  const viewedSpecies = ownedList[safeIndex] ?? getPetSpecies("duck");

  const viewedXp = getSpeciesXp(petState, viewedSpecies.id);
  const viewedNickname = getSpeciesNickname(petState, viewedSpecies.id);
  const viewedProgress = getPetProgress(viewedXp, viewedSpecies);
  const viewedCondition = getPetCondition(petState, viewedSpecies.id);

  const displayStage: PetStage =
    viewedSpecies.hasEvolution && previewStage
      ? previewStage
      : viewedProgress.stage;
  const stageAsset = viewedSpecies.stages[displayStage];
  const isViewedActive = petState.speciesId === viewedSpecies.id;

  const goPrev = () => {
    setPreviewStage(null);
    setIsRenaming(false);
    setCurrentIndex((prev) => (prev - 1 + ownedList.length) % ownedList.length);
  };

  const goNext = () => {
    setPreviewStage(null);
    setIsRenaming(false);
    setCurrentIndex((prev) => (prev + 1) % ownedList.length);
  };

  useEffect(() => {
    if (tab !== "lair" || isRenaming) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setPreviewStage(null);
        setCurrentIndex(
          (prev) => (prev - 1 + ownedList.length) % ownedList.length
        );
      } else if (e.key === "ArrowRight") {
        setPreviewStage(null);
        setCurrentIndex((prev) => (prev + 1) % ownedList.length);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [tab, isRenaming, ownedList.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartXRef.current;
    const delta = endX - touchStartXRef.current;
    touchStartXRef.current = null;
    if (Math.abs(delta) < 45) return;
    if (delta > 0) goPrev();
    else goNext();
  };

  const handleCare = () => {
    careForPet(viewedSpecies.id);
    setGreetingSignal((prev) => prev + 1);
    setStatusNotice(`${viewedNickname} disapa (+5 XP perawatan).`);
  };

  const handleActivate = () => {
    setActivePet(viewedSpecies.id, viewedNickname);
    setStatusNotice(`${viewedNickname} (${viewedSpecies.name}) kini menjadi pendamping utama.`);
  };

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    renamePetSpecies(viewedSpecies.id, draftNickname);
    setIsRenaming(false);
    setStatusNotice(`Nama pet diperbarui menjadi ${draftNickname.trim() || viewedSpecies.defaultNickname}.`);
  };

  const handleRequestUnlock = (id: PetSpeciesId) => {
    setBuySuccess(false);
    setPendingBuyPetId(id);
  };

  const handleConfirmUnlock = (id: PetSpeciesId) => {
    const res = unlockPetSpecies(id);
    setStatusNotice(res.message);
    if (res.ok) {
      setPetState(res.state);
      const nextIdx = res.state.unlockedSpecies.indexOf(id);
      if (nextIdx >= 0) setCurrentIndex(nextIdx);
      setPreviewStage(null);
      setBuySuccess(true);
    } else {
      setPendingBuyPetId(null);
    }
  };

  const lockedPets = PET_SPECIES.filter(
    (item) => !petState.unlockedSpecies.includes(item.id)
  );

  return (
    <div className="lumif-with-nav relative flex min-h-dvh flex-col bg-surface-soft font-sans text-foreground">
      <ScreenHeader
        title="Rumah Pendamping"
        subtitle="Lihat kondisi dan level pet satu per satu"
        rightAction={
          isLoadingPet ? (
            <Skeleton className="h-7 w-20 rounded-xl" />
          ) : (
            <div className="inline-flex items-center gap-1.5 rounded-xl bg-amber-100 px-3 py-1.5 text-xs font-bold text-[#0F172A] dark:bg-amber-950/60 dark:text-amber-300">
              <Coins className="h-4 w-4" aria-hidden="true" />
              <span>{petState.coins} Koin</span>
            </div>
          )
        }
      />

      <main className="flex-1 px-4 pb-[calc(110px+env(safe-area-inset-bottom))] pt-5 md:px-8 md:pb-10">
        {isLoadingPet ? (
          <div className="mx-auto w-full max-w-5xl space-y-5" aria-busy="true" aria-label="Memuat rumah pendamping">
            <div className="flex gap-2">
              <Skeleton className="h-11 w-32 rounded-xl" />
              <Skeleton className="h-11 w-36 rounded-xl" />
            </div>
            <div className="grid grid-cols-1 gap-6 rounded-3xl border border-border bg-card p-5 shadow-xs md:p-7 lg:grid-cols-12">
              <div className="space-y-4 lg:col-span-7">
                <Skeleton className="h-9 w-full rounded-xl" />
                <Skeleton className="h-72 w-full rounded-2xl" />
              </div>
              <div className="space-y-4 lg:col-span-5">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-24 w-full rounded-2xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </div>
          </div>
        ) : (
        <div className="mx-auto w-full max-w-5xl space-y-5">
          {/* Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex rounded-xl bg-muted p-1">
              <button
                type="button"
                onClick={() => setTab("lair")}
                className={`min-h-[40px] rounded-lg px-4 font-heading text-xs font-bold transition-colors ${
                  tab === "lair"
                    ? "bg-card text-primary shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Pet Saya ({ownedList.length})
              </button>
              <button
                type="button"
                onClick={() => setTab("shop")}
                className={`min-h-[40px] rounded-lg px-4 font-heading text-xs font-bold transition-colors ${
                  tab === "shop"
                    ? "bg-card text-primary shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Buka Pet Baru ({lockedPets.length})
              </button>
            </div>

            {statusNotice && (
              <p
                role="status"
                className="rounded-xl border border-primary/25 bg-primary-light px-3 py-1.5 text-xs font-semibold text-foreground"
              >
                {statusNotice}
              </p>
            )}
          </div>

          {tab === "lair" ? (
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="grid grid-cols-1 gap-6 rounded-3xl border border-border bg-card p-5 shadow-xs md:p-7 lg:grid-cols-12"
            >
              {/* 3D Habitat Stage (One Pet at a Time + Prev/Next Controls) */}
              <div className="flex flex-col justify-between lg:col-span-7">
                {ownedList.length > 1 ? (
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={goPrev}
                      aria-label="Pet sebelumnya"
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface-soft text-foreground transition hover:bg-muted"
                    >
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>

                    <div className="text-center">
                      <span className="text-xs font-bold text-muted-foreground">
                        Pet {safeIndex + 1} dari {ownedList.length} (Geser atau klik panah)
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={goNext}
                      aria-label="Pet berikutnya"
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface-soft text-foreground transition hover:bg-muted"
                    >
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                ) : (
                  <div className="mb-3 flex min-h-[36px] items-center justify-center rounded-xl bg-surface-soft px-3 py-1.5 text-center">
                    <span className="text-xs font-semibold text-muted-foreground">
                      1 Pet di Rumah (Buka pet lainnya dengan Koin di tab Buka Pet Baru)
                    </span>
                  </div>
                )}

                <LumifMascot3D
                  modelUrl={stageAsset.modelUrl}
                  stage={displayStage}
                  isEggStage={
                    displayStage === "egg" && viewedSpecies.hasEvolution
                  }
                  showHabitat={true}
                  greetingSignal={greetingSignal}
                  heightClass="h-[290px] sm:h-[340px]"
                  mode="companion"
                />

                {ownedList.length > 1 && (
                  <div className="mt-3 flex items-center justify-center gap-1.5">
                    {ownedList.map((pet, idx) => (
                      <button
                        key={pet.id}
                        type="button"
                        onClick={() => {
                          setPreviewStage(null);
                          setIsRenaming(false);
                          setCurrentIndex(idx);
                        }}
                        aria-label={`Lihat ${pet.name}`}
                        className={`h-2.5 rounded-full transition-all ${
                          idx === safeIndex
                            ? "w-7 bg-primary"
                            : "w-2.5 bg-border hover:bg-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Pet Condition, Level, and Actions */}
              <div className="flex flex-col justify-between gap-5 lg:col-span-5">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-heading text-2xl font-bold text-card-foreground">
                          {viewedNickname}
                        </h2>
                        <button
                          type="button"
                          onClick={() => {
                            setDraftNickname(viewedNickname);
                            setIsRenaming((prev) => !prev);
                          }}
                          aria-label="Ubah nama pet"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <PenLine className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                      <p className="text-xs font-medium text-muted-foreground">
                        {viewedSpecies.name} · {viewedSpecies.categoryLabel}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-md bg-surface-soft px-2.5 py-1 font-heading text-xs font-bold text-primary">
                      Lv. {viewedProgress.level} ·{" "}
                      {viewedSpecies.hasEvolution
                        ? viewedProgress.stageLabel
                        : viewedSpecies.categoryLabel}
                    </span>
                  </div>

                  {isRenaming && (
                    <form
                      onSubmit={handleRenameSubmit}
                      className="flex items-center gap-2 rounded-xl border border-border bg-surface-soft p-2.5"
                    >
                      <input
                        type="text"
                        value={draftNickname}
                        onChange={(e) => setDraftNickname(e.target.value)}
                        maxLength={24}
                        placeholder="Nama panggilan baru"
                        className="h-9 min-w-0 flex-1 rounded-lg border border-input bg-background px-3 text-xs text-foreground"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="h-9 rounded-lg bg-primary px-3 text-xs font-bold text-primary-foreground"
                      >
                        Simpan
                      </button>
                    </form>
                  )}

                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {viewedSpecies.tagline}
                  </p>

                  {/* Condition Status Card */}
                  <div className="rounded-2xl border border-border bg-surface-soft p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-muted-foreground">
                        Kondisi Saat Ini
                      </span>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${
                          viewedCondition.tone === "good"
                            ? "bg-primary-light text-primary"
                            : viewedCondition.tone === "calm"
                              ? "bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300"
                              : "bg-destructive/15 text-destructive"
                        }`}
                      >
                        {viewedCondition.label}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-card-foreground">
                      {viewedCondition.description}
                    </p>
                  </div>

                  {/* Level & XP Progress */}
                  <div className="rounded-2xl border border-border bg-surface-soft p-4">
                    <div className="mb-1.5 flex items-center justify-between text-xs font-semibold">
                      <span className="text-foreground">
                        Level {viewedProgress.level} ({viewedXp} XP)
                      </span>
                      <span className="text-muted-foreground">
                        {viewedProgress.currentLevelXp}/{viewedProgress.nextLevelXp} XP
                      </span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${viewedProgress.progressPercent}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {viewedProgress.nextEvolutionText}
                    </p>
                  </div>

                  {viewedSpecies.hasEvolution && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPreviewStage(null)}
                        aria-pressed={previewStage === null}
                        className={`min-h-[34px] rounded-lg px-3 text-xs font-semibold ${
                          previewStage === null
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Tahap Aktif
                      </button>
                      {(["egg", "baby", "adult"] as PetStage[]).map((stageKey) => (
                        <button
                          key={stageKey}
                          type="button"
                          onClick={() => setPreviewStage(stageKey)}
                          aria-pressed={previewStage === stageKey}
                          className={`min-h-[34px] rounded-lg px-3 text-xs font-semibold ${
                            previewStage === stageKey
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          Pratinjau {viewedSpecies.stages[stageKey].stageLabel}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2.5">
                  <button
                    type="button"
                    onClick={handleCare}
                    className="flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-[#EDBF45] px-4 font-heading text-sm font-bold text-[#0F172A] shadow-xs transition hover:brightness-95"
                  >
                    <Heart className="h-4 w-4" aria-hidden="true" />
                    <span>Sapa & Rawat (+5 XP)</span>
                  </button>

                  {isViewedActive ? (
                    <div className="flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary-light px-4 font-heading text-xs font-bold text-primary">
                      <Check className="h-4 w-4" aria-hidden="true" />
                      <span>Sedang Menemani di Beranda</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleActivate}
                      className="flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 font-heading text-sm font-bold text-primary-foreground transition hover:bg-primary-dark"
                    >
                      <span>Jadikan Pendamping Utama</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Unlockable Pets Shop */
            <div className="space-y-4">
              {lockedPets.length === 0 ? (
                <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-xs">
                  <Award className="mx-auto h-9 w-9 text-primary" aria-hidden="true" />
                  <h2 className="mt-3 font-heading text-lg font-bold">
                    Semua Pet Sudah Terbuka!
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Kembali ke tab Pet Saya untuk merawat dan menaikkan level setiap pet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {lockedPets.map((pet) => {
                    const canAfford = petState.coins >= pet.unlockCost;
                    return (
                      <article
                        key={pet.id}
                        className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs"
                      >
                        <div>
                          <div className="mb-3 flex items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                              <span
                                className="h-3 w-3 rounded-full"
                                style={{ backgroundColor: pet.swatchHex }}
                                aria-hidden="true"
                              />
                              {pet.categoryLabel}
                            </span>

                            <span className="inline-flex items-center gap-1 rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-bold text-[#0F172A] dark:bg-amber-950/60 dark:text-amber-300">
                              <Coins className="h-3.5 w-3.5" aria-hidden="true" />
                              {pet.unlockCost}
                            </span>
                          </div>

                          <h3 className="font-heading text-base font-bold text-card-foreground">
                            {pet.name}
                          </h3>
                          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                            {pet.tagline}
                          </p>
                          {pet.hasEvolution && (
                            <p className="mt-2 text-[11px] font-semibold text-primary">
                              Evolusi: {pet.stages.egg.stageLabel} · {pet.stages.baby.stageLabel} · {pet.stages.adult.stageLabel}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          disabled={!canAfford}
                          onClick={() => handleRequestUnlock(pet.id)}
                          className={`mt-4 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl px-4 font-heading text-xs font-bold transition ${
                            canAfford
                              ? "bg-primary text-primary-foreground hover:bg-primary-dark"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {!canAfford && <Lock className="h-3.5 w-3.5" aria-hidden="true" />}
                          <span>
                            {canAfford
                              ? `Buka Sekarang (${pet.unlockCost} Koin)`
                              : `Kurang ${pet.unlockCost - petState.coins} Koin`}
                          </span>
                        </button>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
        )}
      </main>

      <PetPurchaseConfirmDialog
        petId={pendingBuyPetId}
        currentCoins={petState.coins}
        purchasedSuccess={buySuccess}
        onCancel={() => {
          setPendingBuyPetId(null);
          setBuySuccess(false);
        }}
        onConfirm={handleConfirmUnlock}
        onDoneAfterPurchase={() => {
          setPendingBuyPetId(null);
          setBuySuccess(false);
          setTab("lair");
        }}
        doneButtonLabel="Lihat di Pet Saya"
      />

      <BottomNav />
    </div>
  );
}
