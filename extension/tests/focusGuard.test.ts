import { describe, expect, it } from "vitest";
import {
  buildDynamicDnrRules,
  createDefaultFocusGuardConfig,
  evaluateNavigationUrl,
  isAllowedWebOrigin,
  isValidWebRequestEnvelope,
  LUMIF_FG_PROTOCOL_VERSION,
  LUMIF_FG_WEB_SOURCE,
  normalizeDomainInput,
  normalizeKeywordInput,
  sanitizeFocusGuardConfig,
} from "../../src/lib/focus-guard";

describe("Input validation & security boundaries", () => {
  it("normalizes valid domains and rejects unsafe/local/internal inputs", () => {
    expect(normalizeDomainInput("https://www.Reddit.com/r/all")).toBe("reddit.com");
    expect(normalizeDomainInput("*.example.com")).toBe("example.com");
    expect(normalizeDomainInput("localhost")).toBeNull();
    expect(normalizeDomainInput("http://127.0.0.1:3001")).toBeNull();
    expect(normalizeDomainInput("192.168.1.1")).toBeNull();
    expect(normalizeDomainInput("chrome://extensions")).toBeNull();
    expect(normalizeDomainInput("brave://settings")).toBeNull();
    expect(normalizeDomainInput("com")).toBeNull();
  });

  it("strips zero-width unicode tricks and prevents regex injection in keywords", () => {
    expect(normalizeKeywordInput("po\u200Brn")).toBe("porn");
    expect(normalizeKeywordInput("  Hentai  ")).toBe("hentai");
    expect(normalizeKeywordInput("a")).toBeNull();
    expect(normalizeKeywordInput("porn.*")).toBeNull();
    expect(normalizeKeywordInput("<script>")).toBeNull();
  });

  it("strips XSS chars from personalGoal and clamps pauseUntil", () => {
    const clean = sanitizeFocusGuardConfig({
      enabled: true,
      pauseUntil: Date.now() + 999 * 86_400_000, // exceeds 7 day max
      personalGoal: "Tetap fokus <script>alert(1)</script>",
      schedule: { enabled: true, startHour: 99, endHour: -5 },
    });
    expect(clean.pauseUntil).toBeNull();
    expect(clean.personalGoal).not.toContain("<");
    expect(clean.personalGoal).not.toContain(">");
    expect(clean.schedule.startHour).toBe(22);
    expect(clean.schedule.endHour).toBe(6);
  });
});

describe("Domain, subdomain, keyword, and false-positive prevention", () => {
  const activeConfig = sanitizeFocusGuardConfig({
    enabled: true,
    blockedDomains: ["x.com", "example.com"],
    blockedKeywords: ["porn", "hentai"],
    allowlistDomains: ["wikipedia.org"],
  });

  it("blocks exact domains and subdomains without false substring collision", () => {
    expect(evaluateNavigationUrl("https://x.com/home", activeConfig)).toEqual({
      action: "intervene",
      reason: "domain",
    });
    expect(
      evaluateNavigationUrl("https://mobile.x.com/explore", activeConfig)
    ).toEqual({
      action: "intervene",
      reason: "domain",
    });
    // Must NOT confuse "x.com" with "box.com" or "netflix.com"
    expect(evaluateNavigationUrl("https://netflix.com/browse", activeConfig)).toEqual({
      action: "allow",
      reason: "no_match",
    });
    expect(evaluateNavigationUrl("https://box.com/files", activeConfig)).toEqual({
      action: "allow",
      reason: "no_match",
    });
  });

  it("protects localhost and allowlisted domains with higher precedence", () => {
    expect(evaluateNavigationUrl("http://localhost:3001/home", activeConfig)).toEqual({
      action: "allow",
      reason: "localhost",
    });
    expect(
      evaluateNavigationUrl("https://en.wikipedia.org/wiki/Porn", activeConfig)
    ).toEqual({
      action: "allow",
      reason: "allowlist",
    });
  });

  it("detects encoded, uppercase, and unicode search queries across Google and Brave Search", () => {
    expect(
      evaluateNavigationUrl("https://www.google.com/search?q=watch%20PORN%20free", activeConfig)
    ).toEqual({
      action: "intervene",
      reason: "keyword",
      engineId: "google",
    });
    expect(
      evaluateNavigationUrl("https://search.brave.com/search?q=p%6Frn", activeConfig)
    ).toEqual({
      action: "intervene",
      reason: "keyword",
      engineId: "brave",
    });
    expect(
      evaluateNavigationUrl("https://duckduckgo.com/?q=he\u200Bntai+art", activeConfig)
    ).toEqual({
      action: "intervene",
      reason: "keyword",
      engineId: "duckduckgo",
    });
  });

  it("prevents false positives on ordinary words and exempts educational/recovery searches", () => {
    expect(
      evaluateNavigationUrl("https://www.google.com/search?q=caramel+popcorn+recipe", activeConfig)
    ).toEqual({
      action: "allow",
      reason: "no_match",
    });
    expect(
      evaluateNavigationUrl(
        "https://search.brave.com/search?q=cara+pemulihan+kecanduan+porn",
        activeConfig
      )
    ).toEqual({
      action: "allow",
      reason: "educational_context",
    });
  });

  it("respects disabled, paused, and scheduled states cleanly", () => {
    const paused = { ...activeConfig, pauseUntil: Date.now() + 60_000 };
    expect(evaluateNavigationUrl("https://example.com", paused)).toEqual({
      action: "allow",
      reason: "inactive",
    });

    const off = createDefaultFocusGuardConfig();
    expect(evaluateNavigationUrl("https://example.com", off)).toEqual({
      action: "allow",
      reason: "inactive",
    });
  });
});

describe("DNR dynamic rules compilation & privacy safety", () => {
  it("builds valid RE2 rules without open redirects or query leakage", () => {
    const config = sanitizeFocusGuardConfig({
      enabled: true,
      blockedDomains: ["example.com"],
      blockedKeywords: ["lumiftestblock"],
    });
    const rules = buildDynamicDnrRules(config);
    expect(rules.length).toBeGreaterThan(3);

    for (const rule of rules) {
      if (rule.action.redirect?.extensionPath) {
        expect(rule.action.redirect.extensionPath.startsWith("/intervention.html")).toBe(
          true
        );
        // Never leak blocked domain or search query text into redirect path
        expect(rule.action.redirect.extensionPath).not.toContain("example.com");
        expect(rule.action.redirect.extensionPath).not.toContain("lumiftestblock");
      }
      if (rule.condition.regexFilter) {
        // Ensure every compiled regex builds cleanly
        expect(() => new RegExp(rule.condition.regexFilter!, "i")).not.toThrow();
      }
    }

    // Verify Priority 90 educational allow rule matches ?q=pemulihan+lumiftestblock
    const eduAllow = rules.find(
      (r) => r.priority === 90 && r.action.type === "allow"
    );
    expect(eduAllow?.condition.regexFilter).toBeDefined();
    const eduRegex = new RegExp(eduAllow!.condition.regexFilter!, "i");
    expect(
      eduRegex.test("https://www.google.com/search?q=pemulihan+lumiftestblock")
    ).toBe(true);
    expect(
      eduRegex.test("https://www.google.com/search?q=cara+pemulihan+lumiftestblock")
    ).toBe(true);
  });

  it("validates bridge origin & message schema strictly", () => {
    expect(isAllowedWebOrigin("http://localhost:3001")).toBe(true);
    expect(isAllowedWebOrigin("https://lumif-webapp.vercel.app")).toBe(true);
    expect(isAllowedWebOrigin("https://lumif-webapp-git-main.vercel.app")).toBe(true);
    expect(isAllowedWebOrigin("https://evil.vercel.app")).toBe(false);
    expect(isAllowedWebOrigin("https://evil.example.com")).toBe(false);

    expect(
      isValidWebRequestEnvelope({
        source: LUMIF_FG_WEB_SOURCE,
        version: LUMIF_FG_PROTOCOL_VERSION,
        requestId: "req_1",
        command: { type: "FG_PING" },
      })
    ).toBe(true);

    expect(
      isValidWebRequestEnvelope({
        source: LUMIF_FG_WEB_SOURCE,
        version: LUMIF_FG_PROTOCOL_VERSION,
        requestId: "req_2",
        command: { type: "FG_PAUSE", minutes: 9999 },
      })
    ).toBe(false);
  });
});
