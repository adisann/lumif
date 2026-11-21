import { createDefaultFocusGuardConfig } from "./presets";
import type {
  FocusGuardCategoryId,
  FocusGuardConfig,
  FocusGuardStats,
  InterventionMode,
} from "./types";

const RESERVED_LOCAL_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "lumif-webapp.vercel.app",
]);

const VALID_CATEGORIES = new Set<FocusGuardCategoryId>([
  "safe_local_test",
  "late_night_video",
  "adult_search_terms",
]);

const VALID_MODES = new Set<InterventionMode>([
  "supportive_pause",
  "breathing_first",
]);

/**
 * Normalizes and validates a domain input.
 * Rejects protocols/paths by extracting hostname, rejects private/local hosts,
 * and enforces RFC-safe ASCII/punycode hostname labels with at least one dot.
 */
export function normalizeDomainInput(raw: string): string | null {
  if (typeof raw !== "string") return null;
  let candidate = raw.trim().toLowerCase();
  if (!candidate) return null;

  // Reject browser internal schemes immediately
  if (/^(chrome|brave|about|moz-extension|chrome-extension|file|data|javascript):/i.test(candidate)) {
    return null;
  }

  // Strip optional leading wildcard like *.example.com
  if (candidate.startsWith("*.")) {
    candidate = candidate.slice(2);
  }

  // Extract hostname if user pasted a full URL
  try {
    const withScheme = candidate.includes("://")
      ? candidate
      : `https://${candidate}`;
    const parsed = new URL(withScheme);
    candidate = parsed.hostname.toLowerCase();
  } catch {
    return null;
  }

  // Strip trailing dot or leading www.
  candidate = candidate.replace(/\.+$/, "");
  if (candidate.startsWith("www.") && candidate.split(".").length > 2) {
    candidate = candidate.slice(4);
  }

  if (
    !candidate ||
    candidate.length > 253 ||
    RESERVED_LOCAL_HOSTS.has(candidate) ||
    candidate.endsWith(".localhost") ||
    candidate.endsWith(".local")
  ) {
    return null;
  }

  // Reject IPv4 literals (loopback/LAN protection)
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(candidate)) {
    return null;
  }

  // Require at least domain.tld (prevents accidental blocking of entire ".com" or single word)
  const labels = candidate.split(".");
  if (labels.length < 2) return null;

  const validLabel = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;
  for (const label of labels) {
    if (!validLabel.test(label)) return null;
  }

  // Require alphabetic or punycode TLD of length >= 2
  const tld = labels[labels.length - 1];
  if (!tld || tld.length < 2 || /^\d+$/.test(tld)) return null;

  return candidate;
}

/**
 * Strips zero-width obfuscation chars, applies NFKC normalization, and lowercases.
 */
export function normalizeKeywordInput(raw: string): string | null {
  if (typeof raw !== "string") return null;
  const cleaned = raw
    .normalize("NFKC")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  if (cleaned.length < 2 || cleaned.length > 48) return null;
  // Prevent regex meta characters or URL structural injection characters
  if (/[<>{}[\]\\^$|?*+]/.test(cleaned)) return null;
  return cleaned;
}

export function sanitizeDomainList(list: unknown, maxItems = 100): string[] {
  if (!Array.isArray(list)) return [];
  const seen = new Set<string>();
  for (const item of list) {
    if (typeof item !== "string") continue;
    const norm = normalizeDomainInput(item);
    if (norm) seen.add(norm);
    if (seen.size >= maxItems) break;
  }
  return Array.from(seen);
}

export function sanitizeKeywordList(list: unknown, maxItems = 100): string[] {
  if (!Array.isArray(list)) return [];
  const seen = new Set<string>();
  for (const item of list) {
    if (typeof item !== "string") continue;
    const norm = normalizeKeywordInput(item);
    if (norm) seen.add(norm);
    if (seen.size >= maxItems) break;
  }
  return Array.from(seen);
}

export function sanitizePersonalGoal(raw: unknown, fallback: string): string {
  if (typeof raw !== "string") return fallback;
  const cleaned = raw
    .replace(/[\r\n\t]+/g, " ")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, 160);
  return cleaned || fallback;
}

export function sanitizeFocusGuardConfig(raw: unknown): FocusGuardConfig {
  const defaults = createDefaultFocusGuardConfig();
  const input =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};

  const enabled = typeof input.enabled === "boolean" ? input.enabled : defaults.enabled;

  let pauseUntil: number | null = null;
  if (typeof input.pauseUntil === "number" && Number.isFinite(input.pauseUntil)) {
    // Allow finite pause timestamps within +- 7 days to avoid permanent stale lockouts
    const now = Date.now();
    if (input.pauseUntil > now && input.pauseUntil <= now + 7 * 86_400_000) {
      pauseUntil = Math.round(input.pauseUntil);
    }
  }

  const rawSchedule =
    input.schedule && typeof input.schedule === "object"
      ? (input.schedule as Record<string, unknown>)
      : {};

  const clampHour = (h: unknown, fb: number) => {
    const n = Number(h);
    return Number.isInteger(n) && n >= 0 && n <= 23 ? n : fb;
  };

  const enabledCategories = Array.isArray(input.enabledCategories)
    ? Array.from(
        new Set(
          input.enabledCategories.filter((c): c is FocusGuardCategoryId =>
            VALID_CATEGORIES.has(c as FocusGuardCategoryId)
          )
        )
      )
    : defaults.enabledCategories;

  const interventionMode = VALID_MODES.has(
    input.interventionMode as InterventionMode
  )
    ? (input.interventionMode as InterventionMode)
    : defaults.interventionMode;

  return {
    version: 1,
    enabled,
    pauseUntil,
    blockedDomains: sanitizeDomainList(input.blockedDomains),
    blockedKeywords: sanitizeKeywordList(input.blockedKeywords),
    allowlistDomains: Array.isArray(input.allowlistDomains)
      ? sanitizeDomainList(input.allowlistDomains)
      : defaults.allowlistDomains,
    enabledCategories,
    schedule: {
      enabled: Boolean(rawSchedule.enabled),
      startHour: clampHour(rawSchedule.startHour, defaults.schedule.startHour),
      endHour: clampHour(rawSchedule.endHour, defaults.schedule.endHour),
    },
    personalGoal: sanitizePersonalGoal(input.personalGoal, defaults.personalGoal),
    interventionMode,
    updatedAt:
      typeof input.updatedAt === "string"
        ? input.updatedAt
        : new Date().toISOString(),
  };
}

export function getLocalDateKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function sanitizeFocusGuardStats(
  raw: unknown,
  todayKey = getLocalDateKey()
): FocusGuardStats {
  const input =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const isToday = input.lastDate === todayKey;

  const nonNegInt = (v: unknown) => {
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 ? Math.min(10000, Math.round(n)) : 0;
  };

  return {
    lastDate: todayKey,
    interventionsToday: isToday ? nonNegInt(input.interventionsToday) : 0,
    pausesCompleted: nonNegInt(input.pausesCompleted),
    recoveryActionsChosen: nonNegInt(input.recoveryActionsChosen),
  };
}
