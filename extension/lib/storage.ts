import {
  buildDynamicDnrRules,
  createDefaultFocusGuardConfig,
  getEffectiveRules,
  getLocalDateKey,
  isScheduleActive,
  sanitizeFocusGuardConfig,
  sanitizeFocusGuardStats,
  type FocusGuardConfig,
  type FocusGuardStateSnapshot,
  type FocusGuardStats,
} from "../../src/lib/focus-guard";

const CONFIG_KEY = "lumif_fg_config_v1";
const STATS_KEY = "lumif_fg_stats_v1";

export async function loadStoredConfig(): Promise<FocusGuardConfig> {
  const result = await browser.storage.local.get(CONFIG_KEY);
  if (!result || !result[CONFIG_KEY]) {
    const def = createDefaultFocusGuardConfig();
    await browser.storage.local.set({ [CONFIG_KEY]: def });
    return def;
  }
  return sanitizeFocusGuardConfig(result[CONFIG_KEY]);
}

export async function saveStoredConfig(
  next: FocusGuardConfig
): Promise<FocusGuardConfig> {
  const clean = sanitizeFocusGuardConfig({
    ...next,
    updatedAt: new Date().toISOString(),
  });
  await browser.storage.local.set({ [CONFIG_KEY]: clean });
  return clean;
}

export async function loadStoredStats(): Promise<FocusGuardStats> {
  const result = await browser.storage.local.get(STATS_KEY);
  const todayKey = getLocalDateKey();
  const clean = sanitizeFocusGuardStats(result?.[STATS_KEY], todayKey);
  return clean;
}

export async function recordStatEvent(
  event: "intervention" | "pause" | "recovery_action"
): Promise<FocusGuardStats> {
  const current = await loadStoredStats();
  const updated: FocusGuardStats = {
    ...current,
    interventionsToday:
      current.interventionsToday + (event === "intervention" ? 1 : 0),
    pausesCompleted: current.pausesCompleted + (event === "pause" ? 1 : 0),
    recoveryActionsChosen:
      current.recoveryActionsChosen + (event === "recovery_action" ? 1 : 0),
  };
  await browser.storage.local.set({ [STATS_KEY]: updated });
  return updated;
}

export async function clearAllExtensionData(): Promise<FocusGuardConfig> {
  await browser.storage.local.remove([CONFIG_KEY, STATS_KEY]);
  const def = createDefaultFocusGuardConfig();
  await browser.storage.local.set({
    [CONFIG_KEY]: def,
    [STATS_KEY]: sanitizeFocusGuardStats(null),
  });
  return def;
}

export async function checkHostAccessPermission(): Promise<boolean> {
  try {
    return await browser.permissions.contains({
      origins: ["http://*/*", "https://*/*"],
    });
  } catch {
    return true;
  }
}

export function detectBrowserTarget(): "chromium" | "firefox" | "unknown" {
  try {
    if (import.meta.env.FIREFOX) return "firefox";
    if (import.meta.env.CHROME) return "chromium";
  } catch {
    // Fallback below
  }
  if (typeof navigator !== "undefined") {
    if (/firefox/i.test(navigator.userAgent)) return "firefox";
    if (/chrome|chromium|edg|brave/i.test(navigator.userAgent)) return "chromium";
  }
  return "unknown";
}

export async function buildStateSnapshot(): Promise<FocusGuardStateSnapshot> {
  const config = await loadStoredConfig();
  const stats = await loadStoredStats();
  const hasHostPermission = await checkHostAccessPermission();
  const now = Date.now();
  const { domains, keywords } = getEffectiveRules(config);
  const totalRules = domains.length + keywords.length;

  let inactiveReason: FocusGuardStateSnapshot["inactiveReason"] = "none";
  if (!hasHostPermission) {
    inactiveReason = "missing_host_permission";
  } else if (!config.enabled) {
    inactiveReason = "disabled";
  } else if (config.pauseUntil !== null && config.pauseUntil > now) {
    inactiveReason = "paused";
  } else if (!isScheduleActive(config.schedule, now)) {
    inactiveReason = "outside_schedule";
  } else if (totalRules === 0) {
    inactiveReason = "no_rules";
  }

  const isEffectivelyActive = inactiveReason === "none";
  const dnrRules = buildDynamicDnrRules(config, now);

  return {
    config,
    stats,
    activeRuleCount: dnrRules.filter((r) => r.action.type === "redirect").length,
    isEffectivelyActive,
    inactiveReason,
    hasHostPermission,
    extensionVersion: browser.runtime.getManifest().version ?? "0.1.0",
    browserTarget: detectBrowserTarget(),
  };
}
