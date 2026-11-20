import type { FocusGuardConfig, FocusGuardStateSnapshot } from "./types";

export const LUMIF_FG_WEB_SOURCE = "lumif-focus-guard-web" as const;
export const LUMIF_FG_EXT_SOURCE = "lumif-focus-guard-ext" as const;
export const LUMIF_FG_PROTOCOL_VERSION = 1 as const;

export const ALLOWED_LOCAL_WEB_ORIGINS: readonly string[] = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
];

export type BridgeCommand =
  | { type: "FG_PING" }
  | { type: "FG_GET_STATE" }
  | { type: "FG_SYNC_CONFIG"; config: FocusGuardConfig }
  | { type: "FG_PAUSE"; minutes: number }
  | { type: "FG_RESUME" }
  | { type: "FG_RESET_LOCAL_DATA" };

export type WebBridgeRequestEnvelope = {
  source: typeof LUMIF_FG_WEB_SOURCE;
  version: typeof LUMIF_FG_PROTOCOL_VERSION;
  requestId: string;
  command: BridgeCommand;
};

export type ExtBridgeResponseEnvelope = {
  source: typeof LUMIF_FG_EXT_SOURCE;
  version: typeof LUMIF_FG_PROTOCOL_VERSION;
  requestId: string;
  ok: boolean;
  error?: string;
  state?: FocusGuardStateSnapshot;
};

const VALID_COMMAND_TYPES = new Set([
  "FG_PING",
  "FG_GET_STATE",
  "FG_SYNC_CONFIG",
  "FG_PAUSE",
  "FG_RESUME",
  "FG_RESET_LOCAL_DATA",
]);

export function isAllowedWebOrigin(origin: string): boolean {
  return ALLOWED_LOCAL_WEB_ORIGINS.includes(origin);
}

export function isValidWebRequestEnvelope(
  data: unknown
): data is WebBridgeRequestEnvelope {
  if (!data || typeof data !== "object") return false;
  const obj = data as Record<string, unknown>;
  if (obj.source !== LUMIF_FG_WEB_SOURCE) return false;
  if (obj.version !== LUMIF_FG_PROTOCOL_VERSION) return false;
  if (typeof obj.requestId !== "string" || obj.requestId.length > 64) {
    return false;
  }
  const cmd = obj.command as Record<string, unknown> | undefined;
  if (!cmd || typeof cmd !== "object") return false;
  if (typeof cmd.type !== "string" || !VALID_COMMAND_TYPES.has(cmd.type)) {
    return false;
  }
  if (cmd.type === "FG_PAUSE") {
    const mins = Number(cmd.minutes);
    if (!Number.isFinite(mins) || mins < 1 || mins > 120) return false;
  }
  return true;
}

export function isValidExtResponseEnvelope(
  data: unknown
): data is ExtBridgeResponseEnvelope {
  if (!data || typeof data !== "object") return false;
  const obj = data as Record<string, unknown>;
  return (
    obj.source === LUMIF_FG_EXT_SOURCE &&
    obj.version === LUMIF_FG_PROTOCOL_VERSION &&
    typeof obj.requestId === "string" &&
    typeof obj.ok === "boolean"
  );
}
