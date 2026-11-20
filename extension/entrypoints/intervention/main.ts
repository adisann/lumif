import type { FocusGuardStateSnapshot } from "../../../src/lib/focus-guard";

const params = new URLSearchParams(window.location.search);
const reasonParam = params.get("reason") === "keyword" ? "keyword" : "domain";
const modeParam =
  params.get("mode") === "breathing_first" ? "breathing_first" : "supportive_pause";

const reasonTag = document.getElementById("reason-tag")!;
const headline = document.getElementById("headline")!;
const personalGoalEl = document.getElementById("personal-goal")!;
const breathCircle = document.getElementById("breath-circle")!;
const breathPhase = document.getElementById("breath-phase")!;
const breathTitle = document.getElementById("breath-title")!;
const btnBreathToggle = document.getElementById("btn-breath-toggle")!;
const btnGoSafe = document.getElementById("btn-go-safe")!;
const btnPauseGuard = document.getElementById("btn-pause-guard")!;
const pauseNotice = document.getElementById("pause-notice")!;
const groundingStatus = document.getElementById("grounding-status")!;
const haltTip = document.getElementById("halt-tip")!;

reasonTag.textContent =
  reasonParam === "keyword"
    ? "Pencarian Dipantau Lokal"
    : "Situs Dibatasi Lokal";

if (modeParam === "breathing_first") {
  headline.textContent = "Ikuti dulu satu siklus napas pelan sebelum memutuskan";
}

// Tabs switching
const tabs = document.querySelectorAll<HTMLButtonElement>(".tab");
const panels = {
  breath: document.getElementById("panel-breath")!,
  grounding: document.getElementById("panel-grounding")!,
  halt: document.getElementById("panel-halt")!,
};

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const key = tab.dataset.panel as keyof typeof panels;
    tabs.forEach((t) => {
      const active = t === tab;
      t.classList.toggle("active", active);
      t.setAttribute("aria-selected", String(active));
    });
    (Object.keys(panels) as Array<keyof typeof panels>).forEach((k) => {
      panels[k].classList.toggle("hidden", k !== key);
    });
  });
});

// Guided offline 4-4-6 breathing timer
let breathTimer: number | null = null;
let breathStep = 0;

function stopBreathing() {
  if (breathTimer !== null) {
    window.clearTimeout(breathTimer);
    breathTimer = null;
  }
  breathCircle.className = "breath-circle";
  breathPhase.textContent = "Siap";
  breathTitle.textContent = "Ikuti ritme napas 1 siklus";
  btnBreathToggle.textContent = "Mulai Napas Tenang";
}

function runBreathStep() {
  const phases = [
    { cls: "breath-circle inhale", label: "Tarik 4 dtk", title: "Tarik napas pelan lewat hidung", ms: 4000 },
    { cls: "breath-circle hold", label: "Tahan 4 dtk", title: "Tahan lembut bahu tetap rileks", ms: 4000 },
    { cls: "breath-circle exhale", label: "Hembus 6 dtk", title: "Hembuskan panjang perlahan lewat mulut", ms: 6000 },
  ];
  const current = phases[breathStep % phases.length];
  if (!current) return;
  breathCircle.className = current.cls;
  breathPhase.textContent = current.label;
  breathTitle.textContent = current.title;
  breathStep += 1;

  if (breathStep >= 6) {
    breathTimer = window.setTimeout(() => {
      stopBreathing();
      breathTitle.textContent = "Dua siklus napas selesai. Kamu siap memilih dengan tenang.";
      void browser.runtime.sendMessage({
        type: "FG_INTERNAL_RECORD_EVENT",
        event: "pause",
      });
    }, current.ms);
  } else {
    breathTimer = window.setTimeout(runBreathStep, current.ms);
  }
}

btnBreathToggle.addEventListener("click", () => {
  if (breathTimer !== null) {
    stopBreathing();
    return;
  }
  breathStep = 0;
  btnBreathToggle.textContent = "Hentikan";
  runBreathStep();
});

// Auto-start calm breathing if breathing_first mode
if (modeParam === "breathing_first") {
  breathStep = 0;
  btnBreathToggle.textContent = "Hentikan";
  runBreathStep();
}

// Grounding 3-2-1 progress
document.querySelectorAll<HTMLInputElement>(".g-check").forEach((cb) => {
  cb.addEventListener("change", () => {
    const checked = document.querySelectorAll(".g-check:checked").length;
    groundingStatus.textContent =
      checked === 3
        ? "Bagus. Fokus panca indramu sudah kembali ke momen sekarang."
        : `${checked} dari 3 langkah diamati.`;
  });
});

// HALT helper cards
document.querySelectorAll<HTMLButtonElement>(".halt-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    haltTip.textContent = btn.dataset.tip ?? "";
    haltTip.classList.remove("hidden");
  });
});

// Track optional recovery links safely (aggregate count only, never logs domain/query)
document.querySelectorAll<HTMLAnchorElement>(".chip-link").forEach((link) => {
  link.addEventListener("click", () => {
    void browser.runtime.sendMessage({
      type: "FG_INTERNAL_RECORD_EVENT",
      event: "recovery_action",
    });
  });
});

// Transparent safe return or pause
btnGoSafe.addEventListener("click", () => {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = "about:blank";
  }
});

btnPauseGuard.addEventListener("click", async () => {
  const res = (await browser.runtime.sendMessage({
    type: "FG_INTERNAL_PAUSE",
    minutes: 10,
  })) as { ok: boolean };
  if (res?.ok) {
    pauseNotice.textContent =
      "Focus Guard dijeda 10 menit dan akan aktif kembali secara otomatis.";
    pauseNotice.classList.remove("hidden");
  }
});

// Load saved personal goal + record aggregate intervention event (zero URL logged!)
async function init() {
  try {
    const res = (await browser.runtime.sendMessage({
      type: "FG_INTERNAL_GET_STATE",
    })) as { ok: boolean; state?: FocusGuardStateSnapshot };
    if (res?.ok && res.state?.config?.personalGoal) {
      personalGoalEl.textContent = res.state.config.personalGoal;
    }
    if (!params.has("demo")) {
      await browser.runtime.sendMessage({
        type: "FG_INTERNAL_RECORD_EVENT",
        event: "intervention",
      });
    }
  } catch {
    // Work cleanly offline even if runtime state fails
  }
}

void init();
