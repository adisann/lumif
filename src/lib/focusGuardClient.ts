import {
  createDefaultFocusGuardConfig,
  isValidExtResponseEnvelope,
  LUMIF_FG_PROTOCOL_VERSION,
  LUMIF_FG_WEB_SOURCE,
  sanitizeFocusGuardConfig,
  type BridgeCommand,
  type ExtBridgeResponseEnvelope,
  type FocusGuardConfig,
  type FocusGuardStateSnapshot,
} from "@/lib/focus-guard";

const DRAFT_STORAGE_KEY = "lumif_focus_guard_draft_v1";

export function loadLocalFocusGuardDraft(): FocusGuardConfig {
  if (typeof window === "undefined") {
    return createDefaultFocusGuardConfig();
  }
  try {
    const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return createDefaultFocusGuardConfig();
    return sanitizeFocusGuardConfig(JSON.parse(raw));
  } catch {
    return createDefaultFocusGuardConfig();
  }
}

export function saveLocalFocusGuardDraft(
  config: FocusGuardConfig
): FocusGuardConfig {
  const clean = sanitizeFocusGuardConfig({
    ...config,
    updatedAt: new Date().toISOString(),
  });
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(clean));
    } catch {
      // Ignore quota errors
    }
  }
  return clean;
}

export function clearLocalFocusGuardDraft(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    // Ignore
  }
}

let reqSeq = 0;

/**
 * Sends a strictly typed Focus Guard command over the localhost window bridge
 * with a short timeout so the website works reliably whether the extension is installed or not.
 */
export function sendFocusGuardBridgeCommand(
  command: BridgeCommand,
  timeoutMs = 700
): Promise<{
  connected: boolean;
  state?: FocusGuardStateSnapshot;
  error?: string;
}> {
  if (typeof window === "undefined") {
    return Promise.resolve({ connected: false });
  }

  reqSeq += 1;
  const requestId = `lumif_fg_${reqSeq}_${Math.random().toString(36).slice(2, 7)}`;

  return new Promise((resolve) => {
    let settled = false;

    const cleanup = () => {
      window.removeEventListener("message", onMessage);
      window.clearTimeout(timer);
    };

    const onMessage = (event: MessageEvent) => {
      if (event.source !== window) return;
      if (event.origin !== window.location.origin) return;
      if (!isValidExtResponseEnvelope(event.data)) return;

      const envelope = event.data as ExtBridgeResponseEnvelope;
      if (envelope.requestId !== requestId) return;

      settled = true;
      cleanup();
      resolve({
        connected: true,
        state: envelope.state,
        error: envelope.ok ? undefined : envelope.error,
      });
    };

    const timer = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve({ connected: false });
    }, timeoutMs);

    window.addEventListener("message", onMessage);

    window.postMessage(
      {
        source: LUMIF_FG_WEB_SOURCE,
        version: LUMIF_FG_PROTOCOL_VERSION,
        requestId,
        command,
      },
      window.location.origin
    );
  });
}
