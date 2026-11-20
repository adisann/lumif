import {
  FOCUS_GUARD_PRESETS,
  normalizeDomainInput,
  normalizeKeywordInput,
  type FocusGuardCategoryId,
  type FocusGuardConfig,
  type FocusGuardStateSnapshot,
  type InterventionMode,
} from "../../../src/lib/focus-guard";

const statusPill = document.getElementById("opt-status-pill")!;
const permAlert = document.getElementById("opt-permission-alert")!;
const grantBtn = document.getElementById("opt-grant-btn")!;

const enabledCheck = document.getElementById("opt-enabled") as HTMLInputElement;
const scheduleCheck = document.getElementById("opt-schedule-enabled") as HTMLInputElement;
const startHourInput = document.getElementById("opt-start-hour") as HTMLInputElement;
const endHourInput = document.getElementById("opt-end-hour") as HTMLInputElement;
const modeSelect = document.getElementById("opt-intervention-mode") as HTMLSelectElement;
const goalInput = document.getElementById("opt-goal") as HTMLInputElement;
const presetsContainer = document.getElementById("opt-presets")!;

const statInterventions = document.getElementById("stat-interventions")!;
const statPauses = document.getElementById("stat-pauses")!;
const statActions = document.getElementById("stat-actions")!;

const domainForm = document.getElementById("form-add-domain") as HTMLFormElement;
const domainInput = document.getElementById("input-domain") as HTMLInputElement;
const domainError = document.getElementById("domain-error")!;
const domainList = document.getElementById("list-domains")!;

const keywordForm = document.getElementById("form-add-keyword") as HTMLFormElement;
const keywordInput = document.getElementById("input-keyword") as HTMLInputElement;
const keywordError = document.getElementById("keyword-error")!;
const keywordList = document.getElementById("list-keywords")!;

const allowForm = document.getElementById("form-add-allow") as HTMLFormElement;
const allowInput = document.getElementById("input-allow") as HTMLInputElement;
const allowList = document.getElementById("list-allow")!;
const wipeBtn = document.getElementById("btn-wipe-data")!;

let snapshot: FocusGuardStateSnapshot | null = null;

async function saveConfig(next: FocusGuardConfig) {
  const res = (await browser.runtime.sendMessage({
    type: "FG_INTERNAL_SAVE_CONFIG",
    config: next,
  })) as { ok: boolean; state?: FocusGuardStateSnapshot };
  if (res?.ok && res.state) render(res.state);
}

function renderChipList(
  container: HTMLElement,
  items: string[],
  onRemove: (item: string) => void
) {
  container.textContent = "";
  if (items.length === 0) {
    const empty = document.createElement("li");
    empty.className = "muted";
    empty.textContent = "Belum ada entri.";
    container.appendChild(empty);
    return;
  }

  for (const item of items) {
    const li = document.createElement("li");
    li.className = "chip";
    const span = document.createElement("span");
    span.textContent = item;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("aria-label", `Hapus ${item}`);
    btn.textContent = "×";
    btn.addEventListener("click", () => onRemove(item));
    li.append(span, btn);
    container.appendChild(li);
  }
}

function renderPresets(config: FocusGuardConfig) {
  presetsContainer.textContent = "";
  for (const preset of FOCUS_GUARD_PRESETS) {
    const label = document.createElement("label");
    label.className = "preset-item";

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = config.enabledCategories.includes(preset.id);
    cb.addEventListener("change", () => {
      if (!snapshot) return;
      const prev = snapshot.config.enabledCategories;
      const nextCats: FocusGuardCategoryId[] = cb.checked
        ? Array.from(new Set([...prev, preset.id]))
        : prev.filter((id) => id !== preset.id);
      void saveConfig({ ...snapshot.config, enabledCategories: nextCats });
    });

    const box = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = preset.title;
    const desc = document.createElement("p");
    desc.textContent = preset.description;
    box.append(title, desc);
    label.append(cb, box);
    presetsContainer.appendChild(label);
  }
}

function render(s: FocusGuardStateSnapshot) {
  snapshot = s;
  const { config, stats, isEffectivelyActive, hasHostPermission } = s;

  permAlert.classList.toggle("hidden", hasHostPermission);
  statusPill.textContent = isEffectivelyActive ? "Proteksi Aktif" : "Belum Aktif / Dijeda";
  statusPill.className = isEffectivelyActive ? "pill active" : "pill";

  enabledCheck.checked = config.enabled;
  scheduleCheck.checked = config.schedule.enabled;
  startHourInput.value = String(config.schedule.startHour);
  endHourInput.value = String(config.schedule.endHour);
  modeSelect.value = config.interventionMode;
  goalInput.value = config.personalGoal;

  statInterventions.textContent = String(stats.interventionsToday);
  statPauses.textContent = String(stats.pausesCompleted);
  statActions.textContent = String(stats.recoveryActionsChosen);

  renderPresets(config);

  renderChipList(domainList, config.blockedDomains, (item) => {
    if (!snapshot) return;
    void saveConfig({
      ...snapshot.config,
      blockedDomains: snapshot.config.blockedDomains.filter((d) => d !== item),
    });
  });

  renderChipList(keywordList, config.blockedKeywords, (item) => {
    if (!snapshot) return;
    void saveConfig({
      ...snapshot.config,
      blockedKeywords: snapshot.config.blockedKeywords.filter((k) => k !== item),
    });
  });

  renderChipList(allowList, config.allowlistDomains, (item) => {
    if (!snapshot) return;
    void saveConfig({
      ...snapshot.config,
      allowlistDomains: snapshot.config.allowlistDomains.filter((a) => a !== item),
    });
  });
}

async function init() {
  const res = (await browser.runtime.sendMessage({
    type: "FG_INTERNAL_GET_STATE",
  })) as { ok: boolean; state?: FocusGuardStateSnapshot };
  if (res?.ok && res.state) render(res.state);
}

grantBtn.addEventListener("click", async () => {
  await browser.permissions.request({ origins: ["http://*/*", "https://*/*"] });
  await init();
});

enabledCheck.addEventListener("change", () => {
  if (!snapshot) return;
  void saveConfig({
    ...snapshot.config,
    enabled: enabledCheck.checked,
    pauseUntil: null,
  });
});

scheduleCheck.addEventListener("change", () => {
  if (!snapshot) return;
  void saveConfig({
    ...snapshot.config,
    schedule: { ...snapshot.config.schedule, enabled: scheduleCheck.checked },
  });
});

for (const el of [startHourInput, endHourInput]) {
  el.addEventListener("change", () => {
    if (!snapshot) return;
    void saveConfig({
      ...snapshot.config,
      schedule: {
        ...snapshot.config.schedule,
        startHour: Number(startHourInput.value),
        endHour: Number(endHourInput.value),
      },
    });
  });
}

modeSelect.addEventListener("change", () => {
  if (!snapshot) return;
  void saveConfig({
    ...snapshot.config,
    interventionMode: modeSelect.value as InterventionMode,
  });
});

goalInput.addEventListener("change", () => {
  if (!snapshot) return;
  void saveConfig({ ...snapshot.config, personalGoal: goalInput.value });
});

domainForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!snapshot) return;
  const clean = normalizeDomainInput(domainInput.value);
  if (!clean) {
    domainError.textContent = "Format domain tidak valid atau termasuk host lokal yang dilindungi.";
    domainError.classList.remove("hidden");
    return;
  }
  domainError.classList.add("hidden");
  domainInput.value = "";
  void saveConfig({
    ...snapshot.config,
    blockedDomains: Array.from(new Set([...snapshot.config.blockedDomains, clean])),
  });
});

keywordForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!snapshot) return;
  const clean = normalizeKeywordInput(keywordInput.value);
  if (!clean) {
    keywordError.textContent = "Kata kunci minimal 2 karakter dan tidak boleh memakai simbol regex.";
    keywordError.classList.remove("hidden");
    return;
  }
  keywordError.classList.add("hidden");
  keywordInput.value = "";
  void saveConfig({
    ...snapshot.config,
    blockedKeywords: Array.from(new Set([...snapshot.config.blockedKeywords, clean])),
  });
});

allowForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!snapshot) return;
  const clean = normalizeDomainInput(allowInput.value);
  if (!clean) return;
  allowInput.value = "";
  void saveConfig({
    ...snapshot.config,
    allowlistDomains: Array.from(new Set([...snapshot.config.allowlistDomains, clean])),
  });
});

wipeBtn.addEventListener("click", async () => {
  if (!window.confirm("Hapus seluruh daftar domain, kata kunci, dan statistik lokal?")) {
    return;
  }
  const res = (await browser.runtime.sendMessage({
    type: "FG_INTERNAL_RESET_DATA",
  })) as { ok: boolean; state?: FocusGuardStateSnapshot };
  if (res?.ok && res.state) render(res.state);
});

void init();
