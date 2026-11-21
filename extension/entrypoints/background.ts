import {
  buildDynamicDnrRules,
  sanitizeFocusGuardConfig,
  type BridgeCommand,
  type FocusGuardStateSnapshot,
} from "../../src/lib/focus-guard";
import {
  buildStateSnapshot,
  clearAllExtensionData,
  loadStoredConfig,
  recordStatEvent,
  saveStoredConfig,
} from "../lib/storage";

const ALARM_PAUSE_EXPIRE = "lumif_fg_pause_expire";
const ALARM_SCHEDULE_TICK = "lumif_fg_schedule_tick";

export type InternalMessage =
  | { type: "FG_INTERNAL_GET_STATE" }
  | { type: "FG_INTERNAL_SAVE_CONFIG"; config: unknown }
  | { type: "FG_INTERNAL_PAUSE"; minutes: number }
  | { type: "FG_INTERNAL_RESUME" }
  | { type: "FG_INTERNAL_RECORD_EVENT"; event: "intervention" | "pause" | "recovery_action" }
  | { type: "FG_INTERNAL_RESET_DATA" }
  | { type: "FG_WEB_BRIDGE"; command: BridgeCommand };

async function updateExtensionBadge(snapshot: FocusGuardStateSnapshot) {
  const actionApi = browser.action;
  if (!actionApi) return;

  try {
    if (!snapshot.hasHostPermission) {
      await actionApi.setBadgeText({ text: "!" });
      await actionApi.setBadgeBackgroundColor({ color: "#FF8200" });
      return;
    }

    if (snapshot.inactiveReason === "paused") {
      await actionApi.setBadgeText({ text: "JEDA" });
      await actionApi.setBadgeBackgroundColor({ color: "#EDBF45" });
      return;
    }

    if (snapshot.isEffectivelyActive) {
      await actionApi.setBadgeText({ text: "ON" });
      await actionApi.setBadgeBackgroundColor({ color: "#2D936C" });
      return;
    }

    await actionApi.setBadgeText({ text: "" });
  } catch {
    // Ignore badge errors on browsers with limited badge UI (Android)
  }
}

async function syncProtectionEngine(): Promise<FocusGuardStateSnapshot> {
  const config = await loadStoredConfig();
  const now = Date.now();

  // Auto-clear expired pauses cleanly
  let currentConfig = config;
  if (config.pauseUntil !== null && config.pauseUntil <= now) {
    currentConfig = await saveStoredConfig({ ...config, pauseUntil: null });
  }

  const nextRules = buildDynamicDnrRules(currentConfig, now);

  if (browser.declarativeNetRequest) {
    const existing = await browser.declarativeNetRequest.getDynamicRules();
    const removeRuleIds = existing.map((r) => r.id);

    await browser.declarativeNetRequest.updateDynamicRules({
      removeRuleIds,
      addRules: nextRules as chrome.declarativeNetRequest.Rule[],
    });
  }

  const snapshot = await buildStateSnapshot();
  await updateExtensionBadge(snapshot);
  return snapshot;
}

async function handlePause(minutes: number): Promise<FocusGuardStateSnapshot> {
  const clampedMinutes = Math.max(1, Math.min(120, Math.round(minutes)));
  const current = await loadStoredConfig();
  const pauseUntil = Date.now() + clampedMinutes * 60_000;

  await saveStoredConfig({
    ...current,
    pauseUntil,
  });

  try {
    await browser.alarms.clear(ALARM_PAUSE_EXPIRE);
    await browser.alarms.create(ALARM_PAUSE_EXPIRE, {
      delayInMinutes: clampedMinutes,
    });
  } catch {
    // Fallback if alarms API limited
  }

  return syncProtectionEngine();
}

async function handleResume(): Promise<FocusGuardStateSnapshot> {
  const current = await loadStoredConfig();
  await saveStoredConfig({
    ...current,
    enabled: true,
    pauseUntil: null,
  });
  try {
    await browser.alarms.clear(ALARM_PAUSE_EXPIRE);
  } catch {
    // Ignore
  }
  return syncProtectionEngine();
}

async function executeBridgeCommand(
  command: BridgeCommand
): Promise<FocusGuardStateSnapshot> {
  switch (command.type) {
    case "FG_PING":
    case "FG_GET_STATE":
      return syncProtectionEngine();
    case "FG_SYNC_CONFIG": {
      const sanitized = sanitizeFocusGuardConfig(command.config);
      await saveStoredConfig(sanitized);
      return syncProtectionEngine();
    }
    case "FG_PAUSE":
      return handlePause(command.minutes);
    case "FG_RESUME":
      return handleResume();
    case "FG_RESET_LOCAL_DATA":
      await clearAllExtensionData();
      return syncProtectionEngine();
    default:
      throw new Error("Unsupported bridge command");
  }
}

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(async () => {
    await loadStoredConfig();
    await syncProtectionEngine();
    try {
      await browser.alarms.create(ALARM_SCHEDULE_TICK, {
        periodInMinutes: 1,
      });
    } catch {
      // Ignore
    }
  });

  browser.runtime.onStartup?.addListener(() => {
    void syncProtectionEngine();
  });

  browser.alarms?.onAlarm.addListener((alarm) => {
    if (
      alarm.name === ALARM_PAUSE_EXPIRE ||
      alarm.name === ALARM_SCHEDULE_TICK
    ) {
      void syncProtectionEngine();
    }
  });

  browser.permissions?.onAdded?.addListener(() => {
    void syncProtectionEngine();
  });

  browser.permissions?.onRemoved?.addListener(() => {
    void syncProtectionEngine();
  });

  browser.runtime.onMessage.addListener(
    (rawMessage: unknown, sender, sendResponse) => {
      // Strict sender validation: only accept messages originating from this extension
      if (sender.id !== browser.runtime.id) {
        sendResponse({ ok: false, error: "Unauthorized sender" });
        return false;
      }

      if (!rawMessage || typeof rawMessage !== "object") {
        sendResponse({ ok: false, error: "Invalid message" });
        return false;
      }

      const msg = rawMessage as InternalMessage;

      const handleAsync = async () => {
        switch (msg.type) {
          case "FG_INTERNAL_GET_STATE":
            return { ok: true, state: await syncProtectionEngine() };

          case "FG_INTERNAL_SAVE_CONFIG": {
            const clean = sanitizeFocusGuardConfig(msg.config);
            await saveStoredConfig(clean);
            return { ok: true, state: await syncProtectionEngine() };
          }

          case "FG_INTERNAL_PAUSE":
            return { ok: true, state: await handlePause(msg.minutes) };

          case "FG_INTERNAL_RESUME":
            return { ok: true, state: await handleResume() };

          case "FG_INTERNAL_RECORD_EVENT":
            await recordStatEvent(msg.event);
            return { ok: true, state: await buildStateSnapshot() };

          case "FG_INTERNAL_RESET_DATA":
            await clearAllExtensionData();
            return { ok: true, state: await syncProtectionEngine() };

          case "FG_WEB_BRIDGE": {
            // Extra verification that content script came from a strictly allowed local origin
            const senderWithOrigin = sender as typeof sender & { origin?: string };
            const originCandidate =
              senderWithOrigin.origin || sender.tab?.url || sender.url || "";
            let originAllowed = false;
            try {
              const parsed = new URL(originCandidate);
              originAllowed =
                (parsed.hostname === "localhost" ||
                  parsed.hostname === "127.0.0.1") &&
                parsed.protocol === "http:";
            } catch {
              originAllowed = false;
            }
            if (!originAllowed) {
              return { ok: false, error: "Disallowed origin for web bridge" };
            }
            const state = await executeBridgeCommand(msg.command);
            return { ok: true, state };
          }

          default:
            return { ok: false, error: "Unknown command" };
        }
      };

      handleAsync()
        .then((res) => sendResponse(res))
        .catch((err: unknown) => {
          const message =
            err instanceof Error ? err.message : "Extension internal error";
          sendResponse({ ok: false, error: message });
        });

      return true;
    }
  );
});
