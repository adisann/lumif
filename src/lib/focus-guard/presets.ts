import type { FocusGuardCategoryId, FocusGuardConfig } from "./types";

export type FocusGuardPreset = {
  id: FocusGuardCategoryId;
  title: string;
  description: string;
  domains: string[];
  keywords: string[];
  badge: string;
};

/**
 * Curated opt-in presets. None are enabled by default without explicit user action.
 */
export const FOCUS_GUARD_PRESETS: FocusGuardPreset[] = [
  {
    id: "late_night_video",
    title: "Jeda Hiburan & Media Sosial",
    description:
      "Memberi jeda sebelum membuka platform video singkat atau forum saat jam rawan.",
    domains: ["tiktok.com", "9gag.com"],
    keywords: [],
    badge: "Pengalih Fokus",
  },
  {
    id: "adult_search_terms",
    title: "Filter Pencarian Sensitif",
    description:
      "Menyaring kata kunci pemicu di mesin pencari sambil tetap meloloskan topik edukasi dan pemulihan.",
    domains: [],
    keywords: ["porn", "hentai", "nsfw", "bokep"],
    badge: "Pencarian Aman",
  },
  {
    id: "safe_local_test",
    title: "Simulasi Uji Coba Aman",
    description:
      "Menguji layar jeda menggunakan domain contoh (example.com) sebelum memasang daftar pribadimu.",
    domains: ["example.com"],
    keywords: ["lumiftestblock"],
    badge: "Uji Coba",
  },
];

export const EDUCATIONAL_CONTEXT_TERMS: readonly string[] = [
  "pemulihan",
  "recovery",
  "terapi",
  "therapy",
  "edukasi",
  "education",
  "konseling",
  "counseling",
  "psikologi",
  "psychology",
  "kecanduan",
  "addiction help",
  "riset",
  "research",
  "cbt",
  "act",
  "medis",
  "kesehatan mental",
];

export const DEFAULT_ALLOWLIST_DOMAINS: readonly string[] = [
  "wikipedia.org",
  "nih.gov",
  "who.int",
  "mayoclinic.org",
];

export function createDefaultFocusGuardConfig(
  nowIso = new Date().toISOString()
): FocusGuardConfig {
  return {
    version: 1,
    enabled: false,
    pauseUntil: null,
    blockedDomains: [],
    blockedKeywords: [],
    allowlistDomains: [...DEFAULT_ALLOWLIST_DOMAINS],
    enabledCategories: [],
    schedule: {
      enabled: false,
      startHour: 22,
      endHour: 6,
    },
    personalGoal:
      "Menjaga ketenangan pikiran, fokus harian, dan tidur lebih teratur.",
    interventionMode: "supportive_pause",
    updatedAt: nowIso,
  };
}
