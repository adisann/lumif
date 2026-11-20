import type { SupabaseClient } from "@supabase/supabase-js";

export type OnboardingReason = "focus" | "relationship" | "health";
export type OnboardingTrigger = "stress" | "boredom" | "night";
export type OnboardingMethod = "total" | "gradual";
export type OnboardingRoutine = "breathing" | "journaling" | "workout";

export type OnboardingData = {
  reason: OnboardingReason;
  trigger: OnboardingTrigger;
  method: OnboardingMethod;
  routine: OnboardingRoutine;
  frequency: number;
  weeklyReductionTarget?: number | null;
  targetQuitDate?: string | null;
  goalDays?: number;
  updatedAt?: string;
};

export const ONBOARDING_STORAGE_KEY = "lumif_onboarding";

const VALID_REASONS: readonly OnboardingReason[] = [
  "focus",
  "relationship",
  "health",
];
const VALID_TRIGGERS: readonly OnboardingTrigger[] = [
  "stress",
  "boredom",
  "night",
];
const VALID_METHODS: readonly OnboardingMethod[] = ["total", "gradual"];
const VALID_ROUTINES: readonly OnboardingRoutine[] = [
  "breathing",
  "journaling",
  "workout",
];

export const REASON_LABELS: Record<OnboardingReason, string> = {
  focus: "Fokus & Produktivitas",
  relationship: "Relasi Lebih Sehat",
  health: "Kesehatan Diri",
};

export const TRIGGER_LABELS: Record<OnboardingTrigger, string> = {
  stress: "Stres atau Cemas",
  boredom: "Bosan & Sendirian",
  night: "Kebiasaan Malam",
};

export const METHOD_LABELS: Record<OnboardingMethod, string> = {
  total: "Berhenti Total",
  gradual: "Kurangi Bertahap",
};

export const ROUTINE_LABELS: Record<OnboardingRoutine, string> = {
  breathing: "Latihan Napas",
  journaling: "Menulis Jurnal",
  workout: "Olahraga Ringan",
};

export const DEFAULT_ONBOARDING: OnboardingData = {
  reason: "focus",
  trigger: "stress",
  method: "total",
  routine: "breathing",
  frequency: 8,
  weeklyReductionTarget: null,
  targetQuitDate: null,
  goalDays: 7,
};

function isValidIsoDate(val: unknown): val is string {
  return typeof val === "string" && /^\d{4}-\d{2}-\d{2}$/.test(val);
}

/**
 * Strictly validates and clamps onboarding input on the client before storing or syncing.
 */
export function sanitizeOnboardingData(
  raw: Partial<OnboardingData> | Record<string, unknown> | null | undefined
): OnboardingData {
  const input = raw && typeof raw === "object" ? raw : {};

  const reason = VALID_REASONS.includes(input.reason as OnboardingReason)
    ? (input.reason as OnboardingReason)
    : DEFAULT_ONBOARDING.reason;

  const trigger = VALID_TRIGGERS.includes(input.trigger as OnboardingTrigger)
    ? (input.trigger as OnboardingTrigger)
    : DEFAULT_ONBOARDING.trigger;

  const method = VALID_METHODS.includes(input.method as OnboardingMethod)
    ? (input.method as OnboardingMethod)
    : DEFAULT_ONBOARDING.method;

  const routine = VALID_ROUTINES.includes(input.routine as OnboardingRoutine)
    ? (input.routine as OnboardingRoutine)
    : DEFAULT_ONBOARDING.routine;

  const rawFreq = Number(input.frequency);
  const frequency = Number.isFinite(rawFreq)
    ? Math.max(0, Math.min(100, Math.round(rawFreq)))
    : DEFAULT_ONBOARDING.frequency;

  let weeklyReductionTarget: number | null = null;
  if (input.weeklyReductionTarget !== null && input.weeklyReductionTarget !== undefined) {
    const rawRed = Number(input.weeklyReductionTarget);
    if (Number.isFinite(rawRed)) {
      weeklyReductionTarget = Math.max(-14, Math.min(0, Math.round(rawRed)));
    }
  }

  const targetQuitDate = isValidIsoDate(input.targetQuitDate)
    ? input.targetQuitDate
    : null;

  const rawGoal = Number(input.goalDays);
  const goalDays =
    Number.isFinite(rawGoal) && rawGoal >= 1
      ? Math.max(1, Math.min(3650, Math.round(rawGoal)))
      : 7;

  return {
    reason,
    trigger,
    method,
    routine,
    frequency,
    weeklyReductionTarget,
    targetQuitDate,
    goalDays,
    updatedAt: typeof input.updatedAt === "string" ? input.updatedAt : undefined,
  };
}

export function loadOnboardingData(): OnboardingData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return sanitizeOnboardingData(parsed);
  } catch {
    return null;
  }
}

export function saveOnboardingData(
  partial: Partial<OnboardingData>
): OnboardingData {
  const existing = loadOnboardingData() ?? DEFAULT_ONBOARDING;
  const merged = sanitizeOnboardingData({
    ...existing,
    ...partial,
    updatedAt: new Date().toISOString(),
  });

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(merged));
    } catch {
      // Ignore storage quota errors
    }
  }

  return merged;
}

/**
 * Generates initial daily mission texts tailored to the user's onboarding selections.
 */
export function buildPersonalizedMissions(
  onboarding?: OnboardingData | null
): string[] {
  const plan = onboarding ?? DEFAULT_ONBOARDING;

  const routineMission =
    plan.routine === "journaling"
      ? "Tulis refleksi 3 menit di Catat Hasrat"
      : plan.routine === "workout"
      ? "Peregangan atau olahraga ringan 5 menit"
      : "Latihan pernapasan terpandu 2 menit";

  const triggerMission =
    plan.trigger === "night"
      ? "Letakkan HP di luar jangkauan kasur sebelum tidur"
      : plan.trigger === "boredom"
      ? "Alihkan jenuh lewat 1 mini game atau 1 bagian modul"
      : "Minum 2 gelas air putih saat kepala terasa penuh";

  return [routineMission, triggerMission, "Evaluasi harian singkat"];
}

/**
 * Syncs validated onboarding & companion data to Supabase user_profiles when authenticated.
 */
export async function syncOnboardingToSupabase(
  supabase: SupabaseClient,
  override?: Partial<OnboardingData> & {
    petSpecies?: string | null;
    petName?: string | null;
    displayName?: string | null;
  }
): Promise<{ synced: boolean; data: OnboardingData | null }> {
  const local = loadOnboardingData();
  const hasAny = Boolean(local || override);
  if (!hasAny) return { synced: false, data: null };

  const clean = sanitizeOnboardingData({
    ...(local ?? DEFAULT_ONBOARDING),
    ...override,
  });

  if (local || override) {
    saveOnboardingData(clean);
  }

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { synced: false, data: clean };
    }

    const payload: Record<string, unknown> = {
      user_id: user.id,
      reason: clean.reason,
      primary_trigger: clean.trigger,
      method: clean.method,
      routine: clean.routine,
      frequency: clean.frequency,
      weekly_reduction_target: clean.weeklyReductionTarget ?? null,
      target_quit_date: clean.targetQuitDate ?? null,
      goal_days: clean.goalDays ?? 7,
      onboarding_completed_at: clean.updatedAt ?? new Date().toISOString(),
    };

    if (override?.displayName) {
      payload.display_name = override.displayName.trim().slice(0, 64);
    }
    if (
      override?.petSpecies &&
      ["duck", "bear", "parrot", "dragon"].includes(override.petSpecies)
    ) {
      payload.pet_species = override.petSpecies;
    }
    if (override?.petName) {
      payload.pet_name = override.petName.trim().slice(0, 32);
    }

    const { error } = await supabase
      .from("user_profiles")
      .upsert(payload, { onConflict: "user_id" });

    if (error) {
      console.warn("Supabase user_profiles upsert skipped:", error.message);
      return { synced: false, data: clean };
    }

    return { synced: true, data: clean };
  } catch {
    return { synced: false, data: clean };
  }
}

/**
 * Loads the authoritative user recovery plan from Supabase user_profiles,
 * falling back to (and backfilling from) localStorage or auth metadata cleanly.
 */
export async function loadUserRecoveryProfile(
  supabase: SupabaseClient
): Promise<OnboardingData> {
  const local = loadOnboardingData();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return local ?? DEFAULT_ONBOARDING;
    }

    const { data: row, error } = await supabase
      .from("user_profiles")
      .select(
        "reason, primary_trigger, method, routine, frequency, weekly_reduction_target, target_quit_date, goal_days, onboarding_completed_at"
      )
      .eq("user_id", user.id)
      .maybeSingle();

    if (!error && row) {
      // If DB record exists without onboarding_completed_at while user has local onboarding selections,
      // sync local selections up once so nothing chosen pre-signup is ever lost.
      if (!row.onboarding_completed_at && local) {
        await syncOnboardingToSupabase(supabase, local);
        return local;
      }

      const hydrated = sanitizeOnboardingData({
        reason: row.reason,
        trigger: row.primary_trigger,
        method: row.method,
        routine: row.routine,
        frequency: row.frequency,
        weeklyReductionTarget: row.weekly_reduction_target,
        targetQuitDate: row.target_quit_date,
        goalDays: row.goal_days,
        updatedAt: row.onboarding_completed_at ?? undefined,
      });

      saveOnboardingData(hydrated);
      return hydrated;
    }

    // Check auth user_metadata.onboarding as secondary server backup
    const metaOnboarding = user.user_metadata?.onboarding as
      | Record<string, unknown>
      | undefined;

    if (local) {
      await syncOnboardingToSupabase(supabase, local);
      return local;
    }

    if (metaOnboarding) {
      const fromMeta = sanitizeOnboardingData(metaOnboarding);
      await syncOnboardingToSupabase(supabase, fromMeta);
      return fromMeta;
    }
  } catch {
    // Offline fallback
  }

  return local ?? DEFAULT_ONBOARDING;
}
