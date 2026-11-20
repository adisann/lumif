import { EDUCATIONAL_CONTEXT_TERMS, FOCUS_GUARD_PRESETS } from "./presets";
import type { FocusGuardConfig, FocusSchedule } from "./types";

export type SupportedSearchEngine = {
  id: string;
  label: string;
  hostRegex: string;
  queryParams: string[];
  matchesHost: (hostname: string) => boolean;
};

export const SUPPORTED_SEARCH_ENGINES: SupportedSearchEngine[] = [
  {
    id: "google",
    label: "Google",
    hostRegex: "(?:www\\.)?google\\.[a-z.]{2,10}",
    queryParams: ["q"],
    matchesHost: (h) => /^(?:www\.)?google\.[a-z.]{2,10}$/i.test(h),
  },
  {
    id: "brave",
    label: "Brave Search",
    hostRegex: "search\\.brave\\.com",
    queryParams: ["q"],
    matchesHost: (h) => /^search\.brave\.com$/i.test(h),
  },
  {
    id: "bing",
    label: "Bing",
    hostRegex: "(?:www\\.)?bing\\.com",
    queryParams: ["q"],
    matchesHost: (h) => /^(?:www\.)?bing\.com$/i.test(h),
  },
  {
    id: "duckduckgo",
    label: "DuckDuckGo",
    hostRegex: "(?:html\\.)?duckduckgo\\.com",
    queryParams: ["q"],
    matchesHost: (h) => /^(?:html\.)?(?:www\.)?duckduckgo\.com$/i.test(h),
  },
  {
    id: "yahoo",
    label: "Yahoo Search",
    hostRegex: "(?:[a-z]{2}\\.)?search\\.yahoo\\.com",
    queryParams: ["p", "q"],
    matchesHost: (h) => /^(?:[a-z]{2}\.)?search\.yahoo\.com$/i.test(h),
  },
  {
    id: "ecosia",
    label: "Ecosia",
    hostRegex: "(?:www\\.)?ecosia\\.org",
    queryParams: ["q"],
    matchesHost: (h) => /^(?:www\.)?ecosia\.org$/i.test(h),
  },
  {
    id: "startpage",
    label: "Startpage",
    hostRegex: "(?:www\\.)?startpage\\.com",
    queryParams: ["query", "q"],
    matchesHost: (h) => /^(?:www\.)?startpage\.com$/i.test(h),
  },
  {
    id: "youtube",
    label: "YouTube Search",
    hostRegex: "(?:www\\.|m\\.)?youtube\\.com",
    queryParams: ["search_query"],
    matchesHost: (h) => /^(?:www\.|m\.)?youtube\.com$/i.test(h),
  },
];

export function getEffectiveRules(config: FocusGuardConfig): {
  domains: string[];
  keywords: string[];
} {
  const domainSet = new Set(config.blockedDomains);
  const keywordSet = new Set(config.blockedKeywords);

  for (const catId of config.enabledCategories) {
    const preset = FOCUS_GUARD_PRESETS.find((p) => p.id === catId);
    if (!preset) continue;
    for (const d of preset.domains) domainSet.add(d);
    for (const k of preset.keywords) keywordSet.add(k);
  }

  return {
    domains: Array.from(domainSet),
    keywords: Array.from(keywordSet),
  };
}

export function isScheduleActive(schedule: FocusSchedule, now = Date.now()): boolean {
  if (!schedule.enabled) return true;
  const hour = new Date(now).getHours();
  if (schedule.startHour === schedule.endHour) return true;
  if (schedule.startHour < schedule.endHour) {
    return hour >= schedule.startHour && hour < schedule.endHour;
  }
  // Overnight window (e.g. 22:00 to 06:00)
  return hour >= schedule.startHour || hour < schedule.endHour;
}

export function isFocusGuardEffectivelyActive(
  config: FocusGuardConfig,
  now = Date.now()
): boolean {
  if (!config.enabled) return false;
  if (config.pauseUntil !== null && config.pauseUntil > now) return false;
  if (!isScheduleActive(config.schedule, now)) return false;
  const { domains, keywords } = getEffectiveRules(config);
  return domains.length > 0 || keywords.length > 0;
}

export function hostnameMatchesRule(hostname: string, ruleDomain: string): boolean {
  const cleanHost = hostname.toLowerCase().replace(/\.+$/, "");
  const cleanRule = ruleDomain.toLowerCase().replace(/\.+$/, "");
  return cleanHost === cleanRule || cleanHost.endsWith(`.${cleanRule}`);
}

export function safeDecodeSearchQuery(rawQuery: string): string {
  let decoded = rawQuery.replace(/\+/g, " ");
  // Decode up to 2 passes safely (guards against double-encoded strings or malformed %)
  for (let pass = 0; pass < 2; pass++) {
    try {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    } catch {
      break;
    }
  }
  return decoded
    .normalize("NFKC")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function extractSearchQueryFromUrl(
  parsedUrl: URL
): { engine: SupportedSearchEngine; query: string } | null {
  const engine = SUPPORTED_SEARCH_ENGINES.find((e) =>
    e.matchesHost(parsedUrl.hostname)
  );
  if (!engine) return null;

  for (const param of engine.queryParams) {
    const rawValue = parsedUrl.searchParams.get(param);
    if (rawValue && rawValue.trim()) {
      return {
        engine,
        query: safeDecodeSearchQuery(rawValue),
      };
    }
  }

  return null;
}

export function isEducationalOrRecoveryContext(normalizedText: string): boolean {
  if (!normalizedText) return false;
  return EDUCATIONAL_CONTEXT_TERMS.some((term) =>
    matchesWholePhrase(normalizedText, term)
  );
}

function escapeRegexLiteral(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function matchesWholePhrase(normalizedText: string, phrase: string): boolean {
  if (!normalizedText || !phrase) return false;
  const escaped = escapeRegexLiteral(phrase).replace(/\\ /g, "\\s+");
  const boundaryRe = new RegExp(
    `(?:^|[^a-z0-9])${escaped}(?:$|[^a-z0-9])`,
    "i"
  );
  return boundaryRe.test(normalizedText);
}

export type EvaluationResult =
  | { action: "allow"; reason: "inactive" | "localhost" | "allowlist" | "educational_context" | "no_match" }
  | { action: "intervene"; reason: "domain" | "keyword"; engineId?: string };

/**
 * Pure deterministic evaluator used by unit tests and web simulation tools.
 * Never returns raw URLs or matched raw search queries to protect user privacy.
 */
export function evaluateNavigationUrl(
  rawUrl: string,
  config: FocusGuardConfig,
  now = Date.now()
): EvaluationResult {
  if (!isFocusGuardEffectivelyActive(config, now)) {
    return { action: "allow", reason: "inactive" };
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return { action: "allow", reason: "no_match" };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { action: "allow", reason: "no_match" };
  }

  const host = parsed.hostname.toLowerCase();
  if (host === "localhost" || host === "127.0.0.1") {
    return { action: "allow", reason: "localhost" };
  }

  if (config.allowlistDomains.some((allowed) => hostnameMatchesRule(host, allowed))) {
    return { action: "allow", reason: "allowlist" };
  }

  const { domains, keywords } = getEffectiveRules(config);

  const searchContext = extractSearchQueryFromUrl(parsed);
  if (searchContext && keywords.length > 0) {
    if (isEducationalOrRecoveryContext(searchContext.query)) {
      return { action: "allow", reason: "educational_context" };
    }

    const matchedKeyword = keywords.some((kw) =>
      matchesWholePhrase(searchContext.query, kw)
    );
    if (matchedKeyword) {
      return {
        action: "intervene",
        reason: "keyword",
        engineId: searchContext.engine.id,
      };
    }
  }

  if (domains.some((d) => hostnameMatchesRule(host, d))) {
    return { action: "intervene", reason: "domain" };
  }

  return { action: "allow", reason: "no_match" };
}
