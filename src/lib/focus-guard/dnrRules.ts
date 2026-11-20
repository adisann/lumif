import {
  EDUCATIONAL_CONTEXT_TERMS,
  FOCUS_GUARD_PRESETS,
} from "./presets";
import {
  getEffectiveRules,
  isFocusGuardEffectivelyActive,
  SUPPORTED_SEARCH_ENGINES,
} from "./matcher";
import type { FocusGuardConfig } from "./types";

export type DnrRule = {
  id: number;
  priority: number;
  action: {
    type: "allow" | "redirect" | "block";
    redirect?: {
      extensionPath: string;
    };
  };
  condition: {
    urlFilter?: string;
    regexFilter?: string;
    isUrlFilterCaseSensitive?: boolean;
    resourceTypes: "main_frame"[];
  };
};

function encodeAsciiWordForRegex(word: string): string {
  // Replace spaces inside multi-word keywords with URL space separators
  const parts = word
    .trim()
    .split(/\s+/)
    .map((token) =>
      token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    );
  return parts.join("(?:\\+|%20|%2B)");
}

const SEARCH_HOST_GROUP = `(?:${SUPPORTED_SEARCH_ENGINES.map((e) => e.hostRegex).join("|")})`;
const SEARCH_PARAM_GROUP = `(?:q|p|query|search_query)`;

/**
 * Compiles validated Focus Guard rules into Chrome/Brave & Firefox MV3
 * declarativeNetRequest rules using RE2-safe expressions (no lookarounds).
 * Redirects strictly to static local extension paths without passing raw URLs.
 */
export function buildDynamicDnrRules(
  config: FocusGuardConfig,
  now = Date.now()
): DnrRule[] {
  if (!isFocusGuardEffectivelyActive(config, now)) {
    return [];
  }

  const rules: DnrRule[] = [];
  let nextId = 1;

  // Priority 100: Always protect local Lumif app origins
  rules.push({
    id: nextId++,
    priority: 100,
    action: { type: "allow" },
    condition: {
      urlFilter: "||localhost^",
      resourceTypes: ["main_frame"],
    },
  });
  rules.push({
    id: nextId++,
    priority: 100,
    action: { type: "allow" },
    condition: {
      urlFilter: "||127.0.0.1^",
      resourceTypes: ["main_frame"],
    },
  });

  // Priority 100: User explicit allowlist (exact domain + subdomains)
  for (const allowed of config.allowlistDomains.slice(0, 100)) {
    rules.push({
      id: nextId++,
      priority: 100,
      action: { type: "allow" },
      condition: {
        urlFilter: `||${allowed}^`,
        resourceTypes: ["main_frame"],
      },
    });
  }

  const { domains, keywords } = getEffectiveRules(config);

  // Priority 90: Allow search queries clearly expressing educational/medical/recovery intent
  if (keywords.length > 0) {
    const eduTermsGroup = EDUCATIONAL_CONTEXT_TERMS.map((t) =>
      encodeAsciiWordForRegex(t)
    ).join("|");

    rules.push({
      id: nextId++,
      priority: 90,
      action: { type: "allow" },
      condition: {
        regexFilter: `^https?://${SEARCH_HOST_GROUP}/.*[?&]${SEARCH_PARAM_GROUP}=(?:[^&]*(?:\\+|%20|%22|%27|[^a-z0-9]))?(?:${eduTermsGroup})(?:$|&|\\+|%20|%22|%27|[^a-z0-9])`,
        isUrlFilterCaseSensitive: false,
        resourceTypes: ["main_frame"],
      },
    });
  }

  // Priority 50: Keyword filtering across supported search engines
  const modeParam =
    config.interventionMode === "breathing_first"
      ? "breathing_first"
      : "supportive_pause";

  for (const kw of keywords.slice(0, 150)) {
    const encodedKw = encodeAsciiWordForRegex(kw);
    // Query boundary avoids false positives like "popcorn" matching "porn"
    const regexFilter = `^https?://${SEARCH_HOST_GROUP}/.*[?&]${SEARCH_PARAM_GROUP}=(?:[^&]*(?:\\+|%20|%22|%27|[^a-z0-9]))?${encodedKw}(?:$|&|\\+|%20|%22|%27|[^a-z0-9])`;

    rules.push({
      id: nextId++,
      priority: 50,
      action: {
        type: "redirect",
        redirect: {
          extensionPath: `/intervention.html?reason=keyword&mode=${modeParam}`,
        },
      },
      condition: {
        regexFilter,
        isUrlFilterCaseSensitive: false,
        resourceTypes: ["main_frame"],
      },
    });
  }

  // Priority 40: Blocked domains & subdomains via ||domain^
  for (const domain of domains.slice(0, 200)) {
    rules.push({
      id: nextId++,
      priority: 40,
      action: {
        type: "redirect",
        redirect: {
          extensionPath: `/intervention.html?reason=domain&mode=${modeParam}`,
        },
      },
      condition: {
        urlFilter: `||${domain}^`,
        resourceTypes: ["main_frame"],
      },
    });
  }

  return rules;
}

export function countEnabledPresetRules(config: FocusGuardConfig): number {
  let count = 0;
  for (const id of config.enabledCategories) {
    const p = FOCUS_GUARD_PRESETS.find((item) => item.id === id);
    if (p) count += p.domains.length + p.keywords.length;
  }
  return count;
}
