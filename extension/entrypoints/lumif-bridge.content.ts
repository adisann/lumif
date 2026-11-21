import {
  isAllowedWebOrigin,
  isValidWebRequestEnvelope,
  LUMIF_FG_EXT_SOURCE,
  LUMIF_FG_PROTOCOL_VERSION,
  type ExtBridgeResponseEnvelope,
  type FocusGuardStateSnapshot,
} from "../../src/lib/focus-guard";

export default defineContentScript({
  // Scoped strictly to local Lumif web origins — zero injection on external sites
  matches: ["http://localhost/*", "http://127.0.0.1/*"],
  runAt: "document_start",
  main() {
    const notifyWebReady = async () => {
      try {
        const res = (await browser.runtime.sendMessage({
          type: "FG_INTERNAL_GET_STATE",
        })) as { ok?: boolean; state?: FocusGuardStateSnapshot };
        if (res?.ok && res.state && isAllowedWebOrigin(window.location.origin)) {
          window.postMessage(
            {
              source: LUMIF_FG_EXT_SOURCE,
              version: LUMIF_FG_PROTOCOL_VERSION,
              requestId: "__fg_push__",
              ok: true,
              state: res.state,
            } satisfies ExtBridgeResponseEnvelope,
            window.location.origin
          );
        }
      } catch {
        // Ignore if service worker is waking up; explicit ping handles retry
      }
    };

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

    // Push live extension changes (from popup or options) to any open Lumif tab
    browser.storage.onChanged.addListener(() => {
      void notifyWebReady();
    });

    if (document.readyState === "loading") {
      window.addEventListener("DOMContentLoaded", () => void notifyWebReady(), {
        once: true,
      });
    } else {
      void notifyWebReady();
    }
  },
});
