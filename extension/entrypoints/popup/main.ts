import {
  getEffectiveRules,
  normalizeDomainInput,
  normalizeKeywordInput,
  type FocusGuardStateSnapshot,
} from "../../../src/lib/focus-guard";

const statusBadge = document.getElementById("status-badge")!;
const statusHeadline = document.getElementById("status-headline")!;
const statusSubline = document.getElementById("status-subline")!;
const goalText = document.getElementById("goal-text")!;
const permissionBanner = document.getElementById("permission-banner")!;
const btnGrantPermission = document.getElementById("btn-grant-permission")!;
const btnToggleEnable = document.getElementById("btn-toggle-enable")!;
const btnPause10 = document.getElementById("btn-pause-10")!;
const quickForm = document.getElementById("quick-add-form") as HTMLFormElement;
const quickType = document.getElementById("quick-type") as HTMLSelectElement;
const quickInput = document.getElementById("quick-input") as HTMLInputElement;
const quickFeedback = document.getElementById("quick-feedback")!;
const btnTestIntervention = document.getElementById("btn-test-intervention")!;
const btnOpenOptions = document.getElementById("btn-open-options")!;
const btnOpenWeb = document.getElementById("btn-open-web")!;

let currentSnapshot: FocusGuardStateSnapshot | null = null;

async function sendBg<T>(msg: unknown): Promise<T> {
  return (await browser.runtime.sendMessage(msg)) as T;
}

function showFeedback(text: string, isError = false) {
  quickFeedback.textContent = text;
  quickFeedback.className = isError ? "feedback error" : "feedback";
}

function renderState(snapshot: FocusGuardStateSnapshot) {
  currentSnapshot = snapshot;
  const { config, stats, isEffectivelyActive, inactiveReason, hasHostPermission } =
    snapshot;
  const { domains, keywords } = getEffectiveRules(config);

  goalText.textContent = config.personalGoal;
  permissionBanner.classList.toggle("hidden", hasHostPermission);

  if (!hasHostPermission) {
    statusBadge.textContent = "Perlu Izin";
    statusBadge.className = "badge badge-paused";
    statusHeadline.textContent = "Izin pengalihan situs belum aktif";
    statusSubline.textContent =
      "Ketuk tombol di atas untuk mengizinkan halaman intervensi lokal.";
  } else if (inactiveReason === "paused" && config.pauseUntil) {
    const minsLeft = Math.max(
      1,
      Math.ceil((config.pauseUntil - Date.now()) / 60_000)
    );
    statusBadge.textContent = "Dijeda";
    statusBadge.className = "badge badge-paused";
    statusHeadline.textContent = `Proteksi dijeda (~${minsLeft} menit lagi)`;
    statusSubline.textContent = `${domains.length} domain · ${keywords.length} kata kunci siap`;
  } else if (inactiveReason === "outside_schedule") {
    statusBadge.textContent = "Di Luar Jadwal";
    statusBadge.className = "badge badge-paused";
    statusHeadline.textContent = "Aktif menunggu jam jadwalmu";
    statusSubline.textContent = `Jadwal ${String(config.schedule.startHour).padStart(2, "0")}:00 - ${String(config.schedule.endHour).padStart(2, "0")}:00`;
  } else if (inactiveReason === "no_rules") {
    statusBadge.textContent = "Belum Ada Aturan";
    statusBadge.className = "badge badge-muted";
    statusHeadline.textContent = "Belum ada domain atau kata kunci";
    statusSubline.textContent =
      "Tambahkan domain/kata kunci atau pilih preset di Pengaturan.";
  } else if (isEffectivelyActive) {
    statusBadge.textContent = "Aktif";
    statusBadge.className = "badge badge-active";
    statusHeadline.textContent = "Proteksi lokal berjalan";
    statusSubline.textContent = `${domains.length} domain · ${keywords.length} kata kunci · ${stats.interventionsToday} intervensi hari ini`;
  } else {
    statusBadge.textContent = "Nonaktif";
    statusBadge.className = "badge badge-muted";
    statusHeadline.textContent = "Focus Guard sedang mati";
    statusSubline.textContent = `${domains.length} domain · ${keywords.length} kata kunci tersimpan`;
  }

  btnToggleEnable.textContent =
    config.enabled && inactiveReason !== "paused" ? "Matikan" : "Aktifkan";
  btnPause10.classList.toggle("hidden", !config.enabled || inactiveReason === "paused");
}

async function refresh() {
  const res = await sendBg<{ ok: boolean; state?: FocusGuardStateSnapshot }>({
    type: "FG_INTERNAL_GET_STATE",
  });
  if (res?.ok && res.state) {
    renderState(res.state);
  }
}

btnGrantPermission.addEventListener("click", async () => {
  try {
    const granted = await browser.permissions.request({
      origins: ["http://*/*", "https://*/*"],
    });
    if (granted) {
      await refresh();
    }
  } catch {
    showFeedback("Gagal meminta izin host browser.", true);
  }
});

btnToggleEnable.addEventListener("click", async () => {
  if (!currentSnapshot) return;
  const shouldResumeOrEnable =
    !currentSnapshot.config.enabled || currentSnapshot.inactiveReason === "paused";
  const nextConfig = {
    ...currentSnapshot.config,
    enabled: shouldResumeOrEnable,
    pauseUntil: null,
  };
  const res = await sendBg<{ ok: boolean; state?: FocusGuardStateSnapshot }>({
    type: "FG_INTERNAL_SAVE_CONFIG",
    config: nextConfig,
  });
  if (res?.ok && res.state) renderState(res.state);
});

btnPause10.addEventListener("click", async () => {
  const res = await sendBg<{ ok: boolean; state?: FocusGuardStateSnapshot }>({
    type: "FG_INTERNAL_PAUSE",
    minutes: 10,
  });
  if (res?.ok && res.state) renderState(res.state);
});

quickType.addEventListener("change", () => {
  quickInput.placeholder =
    quickType.value === "domain" ? "mis. example.com" : "mis. kata pemicu";
});

quickForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!currentSnapshot) return;

  const raw = quickInput.value;
  if (quickType.value === "domain") {
    const clean = normalizeDomainInput(raw);
    if (!clean) {
      showFeedback("Masukkan domain valid, mis. example.com.", true);
      return;
    }
    const nextDomains = Array.from(
      new Set([...currentSnapshot.config.blockedDomains, clean])
    );
    const res = await sendBg<{ ok: boolean; state?: FocusGuardStateSnapshot }>({
      type: "FG_INTERNAL_SAVE_CONFIG",
      config: {
        ...currentSnapshot.config,
        enabled: true,
        blockedDomains: nextDomains,
      },
    });
    if (res?.ok && res.state) {
      quickInput.value = "";
      renderState(res.state);
      showFeedback(`Domain ${clean} ditambahkan dan proteksi diaktifkan.`);
    }
  } else {
    const cleanKw = normalizeKeywordInput(raw);
    if (!cleanKw) {
      showFeedback("Kata kunci minimal 2 karakter tanpa simbol khusus.", true);
      return;
    }
    const nextKws = Array.from(
      new Set([...currentSnapshot.config.blockedKeywords, cleanKw])
    );
    const res = await sendBg<{ ok: boolean; state?: FocusGuardStateSnapshot }>({
      type: "FG_INTERNAL_SAVE_CONFIG",
      config: {
        ...currentSnapshot.config,
        enabled: true,
        blockedKeywords: nextKws,
      },
    });
    if (res?.ok && res.state) {
      quickInput.value = "";
      renderState(res.state);
      showFeedback(`Kata kunci "${cleanKw}" ditambahkan.`);
    }
  }
});

btnTestIntervention.addEventListener("click", () => {
  const url = `${browser.runtime.getURL("/intervention.html")}?reason=domain&demo=1`;
  void browser.tabs.create({ url });
});

btnOpenOptions.addEventListener("click", () => {
  void browser.runtime.openOptionsPage();
});

btnOpenWeb.addEventListener("click", () => {
  void browser.tabs.create({ url: "http://localhost:3001/focus-guard" });
});

void refresh();
