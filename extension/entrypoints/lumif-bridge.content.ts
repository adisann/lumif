import {
  isAllowedWebOrigin,
  isValidWebRequestEnvelope,
  LUMIF_FG_EXT_SOURCE,
  LUMIF_FG_PROTOCOL_VERSION,
  type ExtBridgeResponseEnvelope,
} from "../../src/lib/focus-guard";

export default defineContentScript({
  // Scoped strictly to local Lumif web origins — zero injection on external sites
  matches: ["http://localhost/*", "http://127.0.0.1/*"],
  runAt: "document_idle",
  main() {
    window.addEventListener("message", async (event: MessageEvent) => {
      if (event.source !== window) return;
      if (!isAllowedWebOrigin(event.origin)) return;
      if (!isValidWebRequestEnvelope(event.data)) return;

      const req = event.data;
      let responseEnvelope: ExtBridgeResponseEnvelope;

      try {
        const res = (await browser.runtime.sendMessage({
          type: "FG_WEB_BRIDGE",
          command: req.command,
        })) as { ok?: boolean; state?: ExtBridgeResponseEnvelope["state"]; error?: string };

        responseEnvelope = {
          source: LUMIF_FG_EXT_SOURCE,
          version: LUMIF_FG_PROTOCOL_VERSION,
          requestId: req.requestId,
          ok: Boolean(res?.ok),
          state: res?.state,
          error: res?.error,
        };
      } catch (err) {
        responseEnvelope = {
          source: LUMIF_FG_EXT_SOURCE,
          version: LUMIF_FG_PROTOCOL_VERSION,
          requestId: req.requestId,
          ok: false,
          error: err instanceof Error ? err.message : "Bridge communication failed",
        };
      }

      window.postMessage(responseEnvelope, event.origin);
    });
  },
});
