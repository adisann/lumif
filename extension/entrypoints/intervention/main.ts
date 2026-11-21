import type { FocusGuardStateSnapshot } from "../../../src/lib/focus-guard";

const params = new URLSearchParams(window.location.search);
const reasonParam = params.get("reason") === "keyword" ? "keyword" : "domain";
const modeParam =
  params.get("mode") === "breathing_first" ? "breathing_first" : "supportive_pause";

const statusTag = document.getElementById("status-tag")!;
const headline = document.getElementById("headline")!;
const subline = document.getElementById("subline")!;
const personalGoalEl = document.getElementById("personal-goal")!;
const breathCircle = document.getElementById("breath-circle")!;
const breathPhase = document.getElementById("breath-phase")!;
const breathTitle = document.getElementById("breath-title")!;
const btnBreathToggle = document.getElementById("btn-breath-toggle")!;
const btnGoSafe = document.getElementById("btn-go-safe")!;
const btnPauseGuard = document.getElementById("btn-pause-guard") as HTMLButtonElement;
const pauseNotice = document.getElementById("pause-notice")!;
const groundingStatus = document.getElementById("grounding-status")!;
const haltTip = document.getElementById("halt-tip")!;
const btnSupportToggle = document.getElementById("btn-support-toggle")!;
const supportDrawer = document.getElementById("support-drawer")!;

let currentPauseState = false;

function setStatusLabel(state?: FocusGuardStateSnapshot) {
  if (!state) {
    statusTag.textContent =
      reasonParam === "keyword" ? "Pencarian dibatasi" : "Situs dibatasi";
    return;
  }

  if (state.inactiveReason === "paused") {
    currentPauseState = true;
    const minsLeft = state.config.pauseUntil
      ? Math.max(1, Math.ceil((state.config.pauseUntil - Date.now()) / 60_000))
      : 10;
    statusTag.textContent = `Proteksi dijeda (${minsLeft} menit)`;
    btnPauseGuard.textContent = "Aktifkan kembali proteksi";
    headline.textContent = "Proteksi sedang dijeda";
    subline.textContent =
      "Focus Guard akan aktif kembali secara otomatis setelah waktu jeda selesai.";
    return;
  }

  currentPauseState = false;
  btnPauseGuard.textContent = "Jeda proteksi 10 menit";

  if (!state.config.enabled || state.inactiveReason === "disabled") {
    statusTag.textContent = "Proteksi tidak aktif";
    headline.textContent = "Proteksi sedang nonaktif";
    subline.textContent =
      "Focus Guard saat ini dimatikan di pengaturan. Kamu bisa kembali atau menyalakannya lagi kapan saja.";
    return;
  }

  if (state.inactiveReason === "outside_schedule") {
    statusTag.textContent = "Di luar jadwal";
    headline.textContent = "Proteksi berada di luar jam aktif";
    subline.textContent =
      "Focus Guard akan aktif kembali sesuai jadwal jam fokus yang kamu atur.";
    return;
  }

  statusTag.textContent =
    reasonParam === "keyword" ? "Pencarian dibatasi" : "Situs dibatasi";
  headline.textContent = "Situs ini sedang dibatasi";
  subline.textContent =
    "Kamu mengaktifkan Focus Guard untuk mengurangi distraksi. Kamu bisa kembali ke aktivitas sebelumnya atau mengambil jeda singkat.";
}

setStatusLabel();

// Progressive disclosure toggle for optional coping tools
function setSupportDrawerOpen(open: boolean) {
  btnSupportToggle.setAttribute("aria-expanded", String(open));
  supportDrawer.classList.toggle("hidden", !open);
}

btnSupportToggle.addEventListener("click", () => {
  const isOpen = btnSupportToggle.getAttribute("aria-expanded") === "true";
  setSupportDrawerOpen(!isOpen);
});

// Tab switching inside disclosure drawer
const tabs = document.querySelectorAll<HTMLButtonElement>(".tab");
const panels = {
  breath: document.getElementById("panel-breath")!,
  grounding: document.getElementById("panel-grounding")!,
  halt: document.getElementById("panel-halt")!,
  more: document.getElementById("panel-more")!,
};

function selectTab(key: keyof typeof panels) {
  tabs.forEach((t) => {
    const active = t.dataset.panel === key;
    t.classList.toggle("active", active);
    t.setAttribute("aria-selected", String(active));
  });
  (Object.keys(panels) as Array<keyof typeof panels>).forEach((k) => {
    panels[k].classList.toggle("hidden", k !== key);
  });
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const key = tab.dataset.panel as keyof typeof panels;
    selectTab(key);
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
  breathTitle.textContent = "Latihan napas singkat";
  btnBreathToggle.textContent = "Mulai latihan";
}

function runBreathStep() {
  const phases = [
    { cls: "breath-circle inhale", label: "Tarik 4 dtk", title: "Tarik napas pelan lewat hidung", ms: 4000 },
    { cls: "breath-circle hold", label: "Tahan 4 dtk", title: "Tahan sejenak dengan bahu rileks", ms: 4000 },
    { cls: "breath-circle exhale", label: "Hembus 6 dtk", title: "Hembuskan perlahan lewat mulut", ms: 6000 },
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
      breathTitle.textContent = "Latihan selesai. Kamu bisa melanjutkan aktivitasmu.";
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

// In breathing_first mode, open the drawer automatically on the breathing tab
if (modeParam === "breathing_first") {
  setSupportDrawerOpen(true);
  selectTab("breath");
  breathStep = 0;
  btnBreathToggle.textContent = "Hentikan";
  runBreathStep();
}

// Grounding 3-2-1 progress
document.querySelectorAll<HTMLInputElement>(".g-check").forEach((cb) => {
  cb.addEventListener("change", () => {
    const checked = document.querySelectorAll(".g-check:checked").length;
    groundingStatus.classList.remove("hidden");
    groundingStatus.textContent =
      checked === 3
        ? "Selesai. Kamu sudah kembali memperhatikan lingkungan sekitarmu."
        : `${checked} dari 3 langkah selesai.`;
  });
});

// HALT check buttons
const haltButtons = document.querySelectorAll<HTMLButtonElement>(".halt-btn");
haltButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    haltButtons.forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
    haltTip.textContent = btn.dataset.tip ?? "";
    haltTip.classList.remove("hidden");
  });
});

// Track optional Lumif links (aggregate counter only)
document.querySelectorAll<HTMLAnchorElement>(".text-link").forEach((link) => {
  link.addEventListener("click", () => {
    void browser.runtime.sendMessage({
      type: "FG_INTERNAL_RECORD_EVENT",
      event: "recovery_action",
    });
  });
});

// Primary CTA: Return to previous activity
btnGoSafe.addEventListener("click", () => {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.close();
    window.location.href = "about:blank";
  }
});

// Secondary CTA: Pause for 10 minutes or resume if currently paused
btnPauseGuard.addEventListener("click", async () => {
  btnPauseGuard.disabled = true;
  try {
    if (currentPauseState) {
      const res = (await browser.runtime.sendMessage({
        type: "FG_INTERNAL_RESUME",
      })) as { ok: boolean; state?: FocusGuardStateSnapshot };
      if (res?.ok) {
        setStatusLabel(res.state);
        pauseNotice.textContent = "Proteksi diaktifkan kembali.";
        pauseNotice.classList.remove("hidden");
      }
      return;
    }

    const res = (await browser.runtime.sendMessage({
      type: "FG_INTERNAL_PAUSE",
      minutes: 10,
    })) as { ok: boolean; state?: FocusGuardStateSnapshot };
    if (res?.ok) {
      setStatusLabel(res.state);
      pauseNotice.textContent =
        "Proteksi dijeda selama 10 menit. Kamu bisa memuat ulang halaman tujuan jika perlu.";
      pauseNotice.classList.remove("hidden");
    }
  } finally {
    btnPauseGuard.disabled = false;
  }
});

// Load user's saved personal goal + truthful protection state
async function init() {
  try {
    const res = (await browser.runtime.sendMessage({
      type: "FG_INTERNAL_GET_STATE",
    })) as { ok: boolean; state?: FocusGuardStateSnapshot };

    if (res?.ok && res.state) {
      if (res.state.config?.personalGoal) {
        personalGoalEl.textContent = res.state.config.personalGoal;
      }
      setStatusLabel(res.state);
    }

    if (!params.has("demo")) {
      await browser.runtime.sendMessage({
        type: "FG_INTERNAL_RECORD_EVENT",
        event: "intervention",
      });
    }
  } catch {
    // Work cleanly offline if runtime state is unavailable
  }
}

void init();
