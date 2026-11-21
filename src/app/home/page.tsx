"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  MessageCircle,
  Puzzle,
  Heart,
  Grid,
  ChevronRight,
  Check,
  AlertCircle,
  BookOpen,
  ClipboardList,
  X,
  Wind,
  Coins,
  Shield,
} from "lucide-react";
import Image from "next/image";
import BottomNav from "@/components/BottomNav";
import EmergencyFlow from "@/components/EmergencyFlow";
import UpdateKondisiModal from "@/components/UpdateKondisiModal";
import RelapseResetFlow from "@/components/RelapseResetFlow";
import StreakFlame from "@/components/StreakFlame";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import {
  invalidateUserCache,
  readUserCache,
  writeUserCache,
} from "@/lib/userCache";
import {
  awardPetXp,
  claimStreakBonus,
  DEFAULT_PET_STATE,
  getPetProgress,
  getPetSpecies,
  hasChosenStarterPet,
  loadPetState,
  subscribePetState,
  type PetStage,
  type PetState,
} from "@/lib/pets";
import {
  buildPersonalizedMissions,
  DEFAULT_ONBOARDING,
  loadOnboardingData,
  loadUserRecoveryProfile,
  METHOD_LABELS,
  REASON_LABELS,
  type OnboardingData,
} from "@/lib/onboarding";

const LumifMascot3D = dynamic(() => import("@/components/LumifMascot3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[210px] w-full items-center justify-center rounded-2xl bg-primary-light/60">
      <Image
        src="/assets/bear-avatar.png"
        alt="Memuat maskot beruang Lumif"
        width={120}
        height={120}
        className="object-contain"
      />
    </div>
  ),
});

type Mission = {
  id: string;
  text: string;
  completed: boolean;
};

function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 11) return "Selamat pagi";
  if (hour < 15) return "Selamat siang";
  if (hour < 19) return "Selamat sore";
  return "Selamat malam";
}

function toLocalDateKey(date: Date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getTodayLocalDate() {
  return toLocalDateKey(new Date());
}

export default function DashboardScreen() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [isUpdateKondisiOpen, setIsUpdateKondisiOpen] = useState(false);
  const [isEmergencyFlowOpen, setIsEmergencyFlowOpen] = useState(false);
  const [isRelapseResetOpen, setIsRelapseResetOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifRead, setNotifRead] = useState(false);

  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoadingMissions, setIsLoadingMissions] = useState(true);
  const [missionError, setMissionError] = useState("");
  const [isOfflineDemo, setIsOfflineDemo] = useState(false);
  const [userName, setUserName] = useState("");
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [cleanDays, setCleanDays] = useState<number | null>(null);
  const [urgeCount, setUrgeCount] = useState<number | null>(null);
  const [hoursCount, setHoursCount] = useState<number | null>(null);
  const [minutesCount, setMinutesCount] = useState<number | null>(null);
  const [energyScore, setEnergyScore] = useState<number | null>(null);
  const [hasCheckinToday, setHasCheckinToday] = useState(false);
  const [petState, setPetState] = useState<PetState>(DEFAULT_PET_STATE);
  const [isHydratedPet, setIsHydratedPet] = useState(false);
  const [previewStage, setPreviewStage] = useState<PetStage | null>(null);
  const [recoveryPlan, setRecoveryPlan] = useState<OnboardingData | null>(null);

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => {
      setPetState(loadPetState());
      setIsHydratedPet(true);
    });
    const unsub = subscribePetState(() => {
      setPetState(loadPetState());
    });
    return () => {
      window.cancelAnimationFrame(raf);
      unsub();
    };
  }, []);

  useEffect(() => {
    if (!isNotifOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsNotifOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isNotifOpen]);

  useEffect(() => {
    let isMounted = true;

    type HomeCachePayload = {
      userName: string;
      cleanDays: number;
      hoursCount: number;
      minutesCount: number;
      urgeCount: number;
      energyScore: number | null;
      hasCheckinToday?: boolean;
      missions: Mission[];
      recoveryPlan: OnboardingData;
    };

    const loadDashboardData = async (bypassCache = false) => {
      setIsLoadingMissions(true);
      setMissionError("");

      const loadDemoFallback = (nameFallback = "Sobat Lumif") => {
        const localPlan = loadOnboardingData() ?? DEFAULT_ONBOARDING;
        const personalizedTexts = buildPersonalizedMissions(localPlan);
        setRecoveryPlan(localPlan);
        setIsOfflineDemo(true);
        setAuthUserId(null);
        setUserName(nameFallback);
        setCleanDays(1);
        setUrgeCount(null);
        setHoursCount(0);
        setMinutesCount(0);
        setEnergyScore(null);
        setMissions(
          personalizedTexts.map((text, idx) => ({
            id: `demo-${idx + 1}`,
            text,
            completed: false,
          }))
        );
        setIsLoadingMissions(false);
      };

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (!isMounted) return;

        if (userError || !user) {
          const demoUser =
            typeof window !== "undefined"
              ? window.localStorage.getItem("lumif_demo_user")
              : null;
          if (!demoUser) {
            router.replace("/auth/login");
            return;
          }
          if (!hasChosenStarterPet()) {
            router.replace("/choose-pet");
            return;
          }
          const parsed = JSON.parse(demoUser);
          loadDemoFallback(parsed.name || "Sobat Lumif");
          return;
        }

        if (!hasChosenStarterPet()) {
          router.replace("/choose-pet");
          return;
        }

        setAuthUserId(user.id);
        setIsOfflineDemo(false);

        const today = getTodayLocalDate();
        const cacheKey = `dashboard_${today}`;

        if (!bypassCache) {
          const cached = readUserCache<HomeCachePayload>(user.id, cacheKey);
          if (cached && isMounted) {
            setUserName(cached.data.userName);
            setCleanDays(cached.data.cleanDays);
            setHoursCount(cached.data.hoursCount);
            setMinutesCount(cached.data.minutesCount);
            setUrgeCount(cached.data.urgeCount);
            setEnergyScore(cached.data.energyScore);
            setHasCheckinToday(Boolean(cached.data.hasCheckinToday));
            setMissions(cached.data.missions);
            setRecoveryPlan(cached.data.recoveryPlan);
            setIsLoadingMissions(false);
            if (cached.isFresh) {
              return;
            }
          }
        }

        const recoveryProfile = await loadUserRecoveryProfile(supabase);
        setRecoveryPlan(recoveryProfile);
        const emailName =
          (user.user_metadata?.display_name as string | undefined) ||
          user.email?.split("@")[0] ||
          "Sobat Lumif";
        setUserName(emailName);

        const [
          { data: latestRelapse },
          { data: checkinRows },
          { data: existingMissions, error: missionErrorResponse },
        ] = await Promise.all([
          supabase
            .from("relapse_logs")
            .select("created_at")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle(),
          supabase
            .from("checkins")
            .select("id, urge_score, energy_score, created_at")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(50),
          supabase
            .from("daily_missions")
            .select("id, text, completed")
            .eq("user_id", user.id)
            .eq("mission_date", today)
            .order("created_at", { ascending: true }),
        ]);

        if (!isMounted) return;

        const anchorIso = latestRelapse?.created_at ?? user.created_at ?? null;
        let nextCleanDays = 0;
        let nextHoursCount = 0;
        let nextMinutesCount = 0;

        if (anchorIso) {
          const diffMs = Math.max(0, Date.now() - new Date(anchorIso).getTime());
          nextCleanDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          nextHoursCount = Math.floor(
            (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          nextMinutesCount = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        }

        setCleanDays(nextCleanDays);
        setHoursCount(nextHoursCount);
        setMinutesCount(nextMinutesCount);

        const nextUrgeCount = checkinRows ? checkinRows.length : 0;
        const nextHasCheckinToday = Boolean(
          checkinRows?.some((row) => toLocalDateKey(new Date(row.created_at)) === today)
        );
        const latestEnergy =
          checkinRows && checkinRows.length > 0 && typeof checkinRows[0].energy_score === "number"
            ? checkinRows[0].energy_score
            : null;
        setHasCheckinToday(nextHasCheckinToday);
        setUrgeCount(nextUrgeCount);
        if (latestEnergy !== null) {
          setEnergyScore(latestEnergy);
        } else {
          setEnergyScore(null);
        }

        if (missionErrorResponse) {
          setMissionError("Gagal memuat misi harian.");
          setIsLoadingMissions(false);
          return;
        }

        let resolvedMissions: Mission[] = existingMissions ?? [];

        if (resolvedMissions.length === 0) {
          const defaultMissions = buildPersonalizedMissions(recoveryProfile).map(
            (text) => ({
              user_id: user.id,
              mission_date: today,
              text,
              completed: false,
            })
          );

          const { data: insertedMissions, error: insertError } = await supabase
            .from("daily_missions")
            .insert(defaultMissions)
            .select("id, text, completed");

          if (insertError) {
            setMissionError("Gagal membuat misi harian.");
            setIsLoadingMissions(false);
            return;
          }

          resolvedMissions = insertedMissions ?? [];
        }

        setMissions(resolvedMissions);
        writeUserCache(user.id, cacheKey, {
          userName: emailName,
          cleanDays: nextCleanDays,
          hoursCount: nextHoursCount,
          minutesCount: nextMinutesCount,
          urgeCount: nextUrgeCount,
          energyScore: latestEnergy,
          hasCheckinToday: nextHasCheckinToday,
          missions: resolvedMissions,
          recoveryPlan: recoveryProfile,
        });
        setIsLoadingMissions(false);
      } catch {
        const demoUser =
          typeof window !== "undefined"
            ? window.localStorage.getItem("lumif_demo_user")
            : null;
        let nameFallback = "Sobat Lumif";
        if (demoUser) {
          try {
            nameFallback = JSON.parse(demoUser).name || nameFallback;
          } catch {}
        }
        loadDemoFallback(nameFallback);
      }
    };

    const handleDataUpdated = () => {
      if (!isMounted) return;
      void loadDashboardData(true);
    };

    void loadDashboardData();
    window.addEventListener("lumif:data-updated", handleDataUpdated);

    return () => {
      isMounted = false;
      window.removeEventListener("lumif:data-updated", handleDataUpdated);
    };
  }, [router, supabase]);

  const toggleMission = async (id: string) => {
    const targetMission = missions.find((mission) => mission.id === id);
    if (!targetMission) return;

    const nextCompleted = !targetMission.completed;

    setMissions((prev) =>
      prev.map((mission) =>
        mission.id === id ? { ...mission, completed: nextCompleted } : mission
      )
    );

    awardPetXp(nextCompleted ? 25 : -25);

    if (id.startsWith("demo-")) return;

    try {
      const { error } = await supabase
        .from("daily_missions")
        .update({ completed: nextCompleted })
        .eq("id", id);

      if (error) {
        setMissions((prev) =>
          prev.map((mission) =>
            mission.id === id
              ? { ...mission, completed: targetMission.completed }
              : mission
          )
        );
        setMissionError("Gagal menyimpan perubahan misi.");
      } else if (authUserId) {
        invalidateUserCache(authUserId, "dashboard");
        invalidateUserCache(authUserId, "insight");
      }
    } catch {
      // Offline mode keeps local optimistic state
    }
  };

  const isStreakLitToday =
    hasCheckinToday || missions.some((mission) => mission.completed);
  const pendingMissionsCount = missions.filter((m) => !m.completed).length;
  const petSpecies = getPetSpecies(petState.speciesId);
  const petProgress = getPetProgress(petState.xp, petSpecies);
  const activeStage: PetStage =
    petSpecies.hasEvolution && previewStage ? previewStage : petProgress.stage;
  const activeStageAsset = petSpecies.stages[activeStage];
  const todayDate = getTodayLocalDate();
  const canClaimStreakBonus =
    cleanDays !== null &&
    cleanDays >= 1 &&
    petState.lastStreakRewardDate !== todayDate;
  const dailyStreakCoinReward =
    cleanDays !== null ? Math.min(60, 20 + Math.min(cleanDays, 7) * 5) : 0;

  return (
    <div className="lumif-with-nav relative flex min-h-dvh flex-col bg-surface-soft font-sans text-foreground">
      <main className="flex-1 pb-[calc(104px+env(safe-area-inset-bottom))] md:pb-10">
        <div className="mx-auto w-full max-w-6xl md:px-6 md:pt-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Main Column */}
            <div className="flex flex-col gap-6 lg:col-span-8">
              {/* Hero Card */}
              <section className="relative rounded-b-[28px] bg-[#257B5A] px-6 pb-8 pt-5 text-white md:rounded-[28px] md:px-8 md:py-7">
                <div className="mb-7 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 overflow-hidden rounded-full border-2 border-white/30 bg-white/20">
                      <Image
                        src="/assets/bear-avatar.png"
                        alt="Avatar Beruang Lumif"
                        width={44}
                        height={44}
                        className="object-cover"
                      />
                    </div>

                    <div>
                      <p className="font-heading text-xs text-white/90">
                        {getTimeGreeting()},
                      </p>
                      {isLoadingMissions && !userName ? (
                        <Skeleton className="mt-1 h-4 w-28 rounded-md bg-white/25" />
                      ) : (
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-heading text-base font-bold leading-tight">
                            {userName || "Pengguna"}
                          </p>
                          {isOfflineDemo && (
                            <span className="rounded-md bg-black/25 px-2 py-0.5 text-[11px] font-semibold text-white">
                              Mode Demo Offline
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setIsNotifOpen((prev) => !prev);
                        setNotifRead(true);
                      }}
                      aria-expanded={isNotifOpen}
                      aria-label="Notifikasi pengingat"
                      className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/15 transition-colors hover:bg-white/25"
                    >
                      <Bell className="h-5 w-5 text-white" aria-hidden="true" />
                      {!notifRead && pendingMissionsCount > 0 && (
                        <span
                          className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full border border-[#257B5A] bg-[#EDBF45]"
                          aria-hidden="true"
                        />
                      )}
                    </button>

                    {isNotifOpen && (
                      <div
                        role="dialog"
                        aria-label="Daftar pengingat hari ini"
                        className="absolute right-0 z-30 mt-2 w-72 rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-xl"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <h2 className="font-heading text-sm font-bold">
                            Pengingat Hari Ini
                          </h2>
                          <button
                            type="button"
                            onClick={() => setIsNotifOpen(false)}
                            aria-label="Tutup pengingat"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                          >
                            <X className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                        {pendingMissionsCount > 0 ? (
                          <p className="text-xs leading-relaxed text-muted-foreground">
                            Masih ada {pendingMissionsCount} misi kecil yang belum selesai hari ini. Lakukan pelan-pelan sesuai ritmemu.
                          </p>
                        ) : (
                          <p className="text-xs leading-relaxed text-muted-foreground">
                            Semua misi hari ini sudah selesai. Kamu bisa istirahat atau menulis evaluasi singkat.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-center text-center md:items-start md:text-left">
                  <div className="mb-2 flex flex-wrap items-center justify-center gap-2 md:justify-start">
                    {isLoadingMissions && cleanDays === null ? (
                      <Skeleton className="h-5 w-40 bg-white/20" />
                    ) : isStreakLitToday ? (
                      <Link
                        href="/insight"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FFF6D6] transition hover:text-white"
                      >
                        <StreakFlame active size="sm" showSparks />
                        <span>Streak Hari Ini Menyala</span>
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsUpdateKondisiOpen(true)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-white/85 transition hover:text-white"
                      >
                        <StreakFlame active={false} size="sm" showSparks={false} />
                        <span>Nyalakan Streak Hari Ini</span>
                      </button>
                    )}
                  </div>

                  {cleanDays !== null ? (
                    <h1 className="mb-2 font-heading text-[clamp(1.85rem,3vw,2.5rem)] font-bold tracking-tight text-white">
                      <span className="text-[#FF9E3D]">{cleanDays} Hari</span> Bersih
                    </h1>
                  ) : (
                    <Skeleton className="mb-3 h-9 w-48 rounded-xl bg-white/25" />
                  )}

                  {cleanDays !== null ? (
                    <p className="max-w-md text-sm leading-relaxed text-white/90">
                      {`${Math.max(1, (recoveryPlan?.goalDays ?? 7) - (cleanDays % (recoveryPlan?.goalDays ?? 7)))} hari lagi menuju target ${recoveryPlan?.goalDays ?? 7} hari berikutnya.`}
                    </p>
                  ) : (
                    <Skeleton className="h-4 w-64 rounded-md bg-white/20" />
                  )}

                  {cleanDays === null && isLoadingMissions ? (
                    <div className="mt-3 flex gap-2">
                      <Skeleton className="h-6 w-28 rounded-lg bg-white/15" />
                      <Skeleton className="h-6 w-32 rounded-lg bg-white/15" />
                    </div>
                  ) : (
                    recoveryPlan && (
                      <div className="mt-3 flex flex-wrap justify-center gap-2 text-[11px] font-semibold text-white/90 md:justify-start">
                        <span className="rounded-lg bg-white/15 px-2.5 py-1">
                          Jalur: {METHOD_LABELS[recoveryPlan.method]}
                        </span>
                        <span className="rounded-lg bg-white/15 px-2.5 py-1">
                          Alasan: {REASON_LABELS[recoveryPlan.reason]}
                        </span>
                      </div>
                    )
                  )}
                </div>

                {cleanDays === null && isLoadingMissions ? (
                  <div className="mt-7 grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((statSkeleton) => (
                      <div
                        key={statSkeleton}
                        className="rounded-2xl border border-white/15 bg-[#1D6348] p-3.5 text-center"
                      >
                        <Skeleton className="mx-auto mb-1.5 h-5 w-14 bg-white/25" />
                        <Skeleton className="mx-auto h-3 w-20 bg-white/15" />
                      </div>
                    ))}
                  </div>
                ) : (urgeCount !== null && urgeCount > 0) || energyScore !== null ? (
                  <div className="mt-7 grid grid-cols-3 gap-3">
                    <div className="rounded-2xl border border-white/15 bg-[#1D6348] p-3.5 text-center">
                      <div className="mb-1 font-heading text-xl font-bold leading-none text-white">
                        {urgeCount ?? 0}
                      </div>
                      <div className="text-xs text-white/90">
                        Check-in Tercatat
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/15 bg-[#1D6348] p-3.5 text-center">
                      <div className="mb-1 font-heading text-xl font-bold leading-none text-white">
                        {hoursCount !== null
                          ? `${hoursCount}j ${minutesCount ?? 0}m`
                          : "-"}
                      </div>
                      <div className="text-xs text-white/90">Durasi Berjalan</div>
                    </div>

                    <div className="rounded-2xl border border-white/15 bg-[#1D6348] p-3.5 text-center">
                      <div className="mb-1 font-heading text-xl font-bold leading-none text-white">
                        {energyScore !== null ? `${energyScore}/10` : "-"}
                      </div>
                      <div className="text-xs text-white/90">Skor Energi</div>
                    </div>
                  </div>
                ) : null}
              </section>

              {/* Daily Evaluation */}
              <div className="px-4 md:px-0">
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border bg-card p-5 shadow-xs">
                  <div>
                    <h2 className="font-heading text-base font-bold text-card-foreground">
                      Evaluasi Harian
                    </h2>
                    <p className="text-xs text-muted-foreground md:text-sm">
                      Bagaimana perasaanmu hari ini?
                    </p>
                  </div>

                  <Button
                    onClick={() => setIsUpdateKondisiOpen(true)}
                    className="flex min-h-[44px] gap-2 rounded-xl bg-primary px-5 py-2.5 font-bold text-primary-foreground hover:bg-primary-dark"
                  >
                    Evaluasi
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>

              {/* Mobile Emergency CTA (moved to right rail on desktop) */}
              <div className="px-4 md:px-0 lg:hidden">
                <button
                  type="button"
                  onClick={() => setIsEmergencyFlowOpen(true)}
                  className="flex min-h-[72px] w-full items-center gap-4 rounded-3xl bg-[#D82C1C] p-5 text-left text-white shadow-sm transition-colors hover:bg-[#B92214] active:scale-[0.99]"
                >
                  <div className="rounded-2xl bg-white/20 p-3">
                    <AlertCircle className="h-7 w-7 text-white" aria-hidden="true" />
                  </div>

                  <div>
                    <h2 className="font-heading text-base font-bold">
                      Butuh Bantuan
                    </h2>
                    <p className="text-xs text-white/90">
                      Dorongan terasa kuat? Klik untuk jeda darurat sekarang
                    </p>
                  </div>
                </button>
              </div>

              {/* Daily Missions */}
              <section className="px-4 md:px-0">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-heading text-sm font-bold text-foreground md:text-base">
                    Misi Kecil Hari Ini
                  </h2>
                  {missions.length > 0 && (
                    <span className="text-xs font-semibold text-muted-foreground">
                      {missions.filter((m) => m.completed).length}/{missions.length} selesai
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  {isLoadingMissions && (
                    <div className="space-y-3" aria-busy="true" aria-label="Memuat misi harian">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="flex min-h-[58px] items-center gap-3.5 rounded-2xl border border-border bg-card px-4 py-3"
                        >
                          <Skeleton className="h-6 w-6 shrink-0 rounded-full" />
                          <Skeleton className="h-4 flex-1" />
                        </div>
                      ))}
                    </div>
                  )}

                  {!isLoadingMissions && missionError && (
                    <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                      {missionError}
                    </div>
                  )}

                  {!isLoadingMissions && !missionError && missions.length === 0 && (
                    <div className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
                      Belum ada misi untuk hari ini. Coba lakukan evaluasi harian untuk memulai.
                    </div>
                  )}

                  {!isLoadingMissions &&
                    !missionError &&
                    missions.map((mission) => (
                      <button
                        key={mission.id}
                        type="button"
                        onClick={() => toggleMission(mission.id)}
                        aria-pressed={mission.completed}
                        className="group flex min-h-[56px] items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 text-left transition-colors hover:border-primary/40"
                      >
                        <div className="flex min-w-0 items-center gap-3.5">
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                              mission.completed
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-background group-hover:border-primary"
                            }`}
                          >
                            {mission.completed && (
                              <Check className="h-3.5 w-3.5" aria-hidden="true" />
                            )}
                          </span>

                          <span
                            className={`truncate text-sm font-medium ${
                              mission.completed
                                ? "text-muted-foreground line-through"
                                : "text-card-foreground"
                            }`}
                          >
                            {mission.text}
                          </span>
                        </div>

                        <span
                          className={`shrink-0 text-[11px] font-bold ${
                            mission.completed
                              ? "text-primary"
                              : "text-brand-orange-ink"
                          }`}
                        >
                          {mission.completed ? "Selesai" : "+25 XP"}
                        </span>
                      </button>
                    ))}
                </div>
              </section>

              {/* Quick Menu Grid (Mobile & Tablet only, already in Sidebar on Desktop) */}
              <section className="px-4 md:px-0 lg:hidden">
                <h2 className="mb-3 font-heading text-sm font-bold text-foreground md:text-base">
                  Akses Cepat
                </h2>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    {
                      name: "Komunitas",
                      icon: MessageCircle,
                      color: "bg-[#EAF7F1] text-primary dark:bg-emerald-950/50",
                      href: "/community",
                    },
                    {
                      name: "Permainan",
                      icon: Puzzle,
                      color: "bg-[#FFF3E5] text-brand-orange-ink dark:bg-orange-950/40",
                      href: "/games",
                    },
                    {
                      name: "Pernapasan",
                      icon: Heart,
                      color: "bg-[#FCF6E3] text-[#8A6700] dark:bg-amber-950/40 dark:text-[#EDBF45]",
                      href: "/exercises/breathing",
                    },
                    {
                      name: "Lainnya",
                      icon: Grid,
                      color: "bg-muted text-foreground",
                      href: "/more",
                    },
                  ].map((menu) => (
                    <Link
                      key={menu.name}
                      href={menu.href}
                      className="flex min-h-[84px] flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card p-3 transition-colors hover:border-primary/40 hover:bg-muted/40"
                    >
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${menu.color}`}
                      >
                        <menu.icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="text-xs font-semibold text-card-foreground">
                        {menu.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Focused Recovery Actions */}
              <section className="px-4 pb-2 md:px-0">
                <h2 className="mb-3 font-heading text-sm font-bold text-foreground md:text-base">
                  Lanjutkan Pemulihan
                </h2>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Link
                    href="/modules"
                    className="flex items-center gap-3.5 rounded-2xl border border-primary/20 bg-primary-light p-4 text-left transition-colors hover:border-primary/50"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-card text-primary">
                      <BookOpen className="h-5 w-5" aria-hidden="true" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-heading text-sm font-bold text-foreground">
                        Modul CBT & ACT
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Edukasi & latihan pola pikir
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/routines"
                    className="flex items-center gap-3.5 rounded-2xl border border-[#FF8200]/25 bg-[#FFF6EB] p-4 text-left transition-colors hover:border-[#FF8200]/50 dark:bg-orange-950/30"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-card text-brand-orange-ink">
                      <ClipboardList className="h-5 w-5" aria-hidden="true" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-heading text-sm font-bold text-foreground">
                        Rutinitas Harian
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Checklist kebiasaan positif
                      </p>
                    </div>
                  </Link>
                </div>
              </section>
            </div>

            {/* Right Companion & Urgent Stack */}
            <aside className="flex flex-col gap-5 px-4 md:px-0 lg:col-span-4">
              {/* 3D Pet Companion Card with Level & Evolution */}
              <section className="rounded-3xl border border-border bg-card p-5 shadow-xs">
                {!isHydratedPet ? (
                  <div className="space-y-4" aria-busy="true" aria-label="Memuat pendamping">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-28" />
                        <Skeleton className="h-3.5 w-20" />
                      </div>
                      <Skeleton className="h-9 w-24 rounded-xl" />
                    </div>
                    <Skeleton className="h-52 w-full rounded-2xl" />
                    <Skeleton className="h-14 w-full rounded-2xl" />
                    <Skeleton className="h-11 w-full rounded-xl" />
                  </div>
                ) : (
                <>
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate font-heading text-base font-bold text-card-foreground">
                        {petState.nickname}
                      </h2>
                      <span className="rounded-md bg-surface-soft px-2 py-0.5 font-heading text-[11px] font-bold text-primary">
                        Lv. {petProgress.level} ·{" "}
                        {petSpecies.hasEvolution
                          ? petProgress.stageLabel
                          : petSpecies.categoryLabel}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {petSpecies.name}
                      {previewStage && petSpecies.hasEvolution
                        ? ` (Pratinjau ${petSpecies.stages[previewStage].stageLabel})`
                        : ""}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-[#0F172A] dark:bg-amber-950/60 dark:text-amber-300">
                      <Coins className="h-3.5 w-3.5" aria-hidden="true" />
                      {petState.coins}
                    </span>
                    <Link
                      href="/lair"
                      className="inline-flex min-h-[44px] items-center rounded-xl border border-border px-3 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      Lair Pet
                    </Link>
                  </div>
                </div>

                <LumifMascot3D
                  modelUrl={activeStageAsset.modelUrl}
                  stage={activeStage}
                  isEggStage={activeStage === "egg" && petSpecies.hasEvolution}
                  mode="companion"
                />

                {canClaimStreakBonus && cleanDays !== null && (
                  <button
                    type="button"
                    onClick={() => claimStreakBonus(todayDate, cleanDays)}
                    className="mt-3 flex min-h-[40px] w-full items-center justify-center gap-2 rounded-xl bg-[#EDBF45] px-3 py-2 font-heading text-xs font-bold text-[#0F172A] shadow-xs transition hover:brightness-95"
                  >
                    <Coins className="h-4 w-4" aria-hidden="true" />
                    <span>
                      Klaim Bonus Streak {cleanDays} Hari (+{dailyStreakCoinReward} Koin)
                    </span>
                  </button>
                )}

                {/* XP & Evolution Progress */}
                <div className="mt-3 rounded-2xl bg-surface-soft p-3">
                  <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold">
                    <span className="text-brand-orange-ink">
                      {petState.xp} XP · {petState.coins} Koin
                    </span>
                    <span className="text-muted-foreground">
                      {petProgress.currentLevelXp}/{petProgress.nextLevelXp} XP
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-300"
                      style={{ width: `${petProgress.progressPercent}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] text-muted-foreground">
                    {petProgress.nextEvolutionText}
                  </p>
                </div>

                {petSpecies.hasEvolution && (
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPreviewStage(null)}
                      aria-pressed={previewStage === null}
                      className={`min-h-[32px] rounded-lg px-2.5 text-[11px] font-semibold transition-colors ${
                        previewStage === null
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Aktif
                    </button>
                    {(["egg", "baby", "adult"] as PetStage[]).map((stageKey) => (
                      <button
                        key={stageKey}
                        type="button"
                        onClick={() => setPreviewStage(stageKey)}
                        aria-pressed={previewStage === stageKey}
                        className={`min-h-[32px] rounded-lg px-2.5 text-[11px] font-semibold transition-colors ${
                          previewStage === stageKey
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Pratinjau {petSpecies.stages[stageKey].stageLabel}
                      </button>
                    ))}
                  </div>
                )}

                <Link
                  href="/exercises/breathing"
                  className="mt-4 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-heading text-sm font-bold text-primary-foreground transition hover:bg-primary-dark"
                >
                  <Wind className="h-4 w-4" aria-hidden="true" />
                  <span>Latihan Napas Bersama</span>
                </Link>
                </>
                )}
              </section>

              {/* Desktop Emergency Card */}
              <button
                type="button"
                onClick={() => setIsEmergencyFlowOpen(true)}
                className="hidden w-full items-center gap-4 rounded-3xl bg-[#D82C1C] p-5 text-left text-white shadow-sm transition-colors hover:bg-[#B92214] active:scale-[0.99] lg:flex"
              >
                <div className="rounded-2xl bg-white/20 p-3">
                  <AlertCircle className="h-7 w-7 text-white" aria-hidden="true" />
                </div>

                <div>
                  <h2 className="font-heading text-base font-bold uppercase tracking-wide">
                    BUTUH BANTUAN
                  </h2>
                  <p className="text-xs text-white/90">
                    Dorongan terasa kuat? Klik untuk jeda darurat
                  </p>
                </div>
              </button>

              {/* Relapse Reset Card */}
              <button
                type="button"
                onClick={() => setIsRelapseResetOpen(true)}
                className="flex min-h-[68px] w-full flex-col gap-1 rounded-2xl border border-border bg-card p-4 text-left shadow-xs transition-colors hover:bg-muted/60"
              >
                <h3 className="font-heading text-sm font-bold text-primary">
                  Aku butuh reset
                </h3>
                <p className="text-xs text-muted-foreground">
                  Lapor relaps dan mulai kembali tanpa menghakimi diri
                </p>
              </button>

              <Link
                href="/focus-guard"
                className="flex min-h-[64px] w-full items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 text-left shadow-xs transition-colors hover:border-primary/40 hover:bg-muted/40"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                    <Shield className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-heading text-sm font-bold text-card-foreground">
                      Lumif Focus Guard
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Atur proteksi situs & jeda pencarian
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              </Link>
            </aside>
          </div>
        </div>
      </main>

      <UpdateKondisiModal
        isOpen={isUpdateKondisiOpen}
        onClose={() => setIsUpdateKondisiOpen(false)}
      />
      <EmergencyFlow
        isOpen={isEmergencyFlowOpen}
        onClose={() => setIsEmergencyFlowOpen(false)}
      />
      <RelapseResetFlow
        isOpen={isRelapseResetOpen}
        onClose={() => setIsRelapseResetOpen(false)}
      />

      <BottomNav />
    </div>
  );
}
