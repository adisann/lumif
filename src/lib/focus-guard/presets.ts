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
    id: "safe_local_test",
    title: "Paket Uji Aman (Simulasi Lokal)",
    description:
      "Memblokir domain contoh aman (example.com) dan kata kunci simulasi agar kamu bisa mengetes proteksi tanpa mengakses konten nyata.",
    domains: ["example.com"],
    keywords: ["lumiftestblock"],
    badge: "Direkomendasikan untuk uji coba",
  },
  {
    id: "late_night_video",
    title: "Jeda Hiburan & Scroll Tanpa Batas",
    description:
      "Membantu memberi jeda sadar saat dorongan membuka platform video singkat atau forum tanpa henti di jam rawan.",
    domains: ["tiktok.com", "9gag.com"],
    keywords: [],
    badge: "Pengalih perhatian",
  },
  {
    id: "adult_search_terms",
    title: "Filter Pencarian Pemicu Umum",
    description:
      "Menyaring kata kunci pencarian sensitif umum di mesin pencari sambil tetap meloloskan kata kunci pemulihan atau edukasi medis.",
    domains: [],
    keywords: ["porn", "hentai", "nsfw", "bokep"],
    badge: "Opt-in",
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
