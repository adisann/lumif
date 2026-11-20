import { defineConfig } from "wxt";

export default defineConfig({
  manifestVersion: 3,
  manifest: ({ browser }) => {
    const isFirefox = browser === "firefox";

    return {
      name: "Lumif Focus Guard",
      short_name: "Lumif Guard",
      version: "0.1.0",
      description:
        "Pendamping kendali diri lokal berbasis CBT & ACT dengan filter domain, kata kunci pencarian, dan layar intervensi tenang.",
      icons: {
        "16": "icon/16.png",
        "32": "icon/32.png",
        "48": "icon/48.png",
        "128": "icon/128.png",
      },
      permissions: [
        "storage",
        "declarativeNetRequest",
        "declarativeNetRequestWithHostAccess",
        "alarms",
      ],
      host_permissions: ["http://*/*", "https://*/*"],
      web_accessible_resources: [
        {
          resources: ["intervention.html"],
          matches: ["http://*/*", "https://*/*"],
        },
      ],
      content_security_policy: {
        extension_pages:
          "script-src 'self'; object-src 'self'; base-uri 'self'; form-action 'self';",
      },
      ...(isFirefox
        ? {
            browser_specific_settings: {
              gecko: {
                id: "focus-guard@lumif.local",
                strict_min_version: "113.0",
                data_collection_permissions: {
                  required: ["none"],
                },
              },
              gecko_android: {},
            },
          }
        : {}),
    };
  },
});
