"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import ScreenHeader from "@/components/ScreenHeader";
import {
  BookOpen,
  CheckCircle2,
  ClipboardList,
  FlaskConical,
  Gamepad2,
  PauseCircle,
  Play,
  Plus,
  RefreshCw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Trash2,
  Wind,
  X,
  Zap,
} from "lucide-react";
import {
  evaluateNavigationUrl,
  FOCUS_GUARD_PRESETS,
  getEffectiveRules,
  normalizeDomainInput,
  normalizeKeywordInput,
  type EvaluationResult,
  type FocusGuardCategoryId,
  type FocusGuardConfig,
  type FocusGuardStateSnapshot,
  type InterventionMode,
} from "@/lib/focus-guard";
import {
  clearLocalFocusGuardDraft,
  loadLocalFocusGuardDraft,
  saveLocalFocusGuardDraft,
  sendFocusGuardBridgeCommand,
} from "@/lib/focusGuardClient";
import { loadOnboardingData, REASON_LABELS } from "@/lib/onboarding";

export default function FocusGuardPage() {
  const [config, setConfig] = useState<FocusGuardConfig>(() =>
    loadLocalFocusGuardDraft()
  );
  const [extSnapshot, setExtSnapshot] =
    useState<FocusGuardStateSnapshot | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isCheckingExt, setIsCheckingExt] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [domainInput, setDomainInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [allowInput, setAllowInput] = useState("");
  const [simUrl, setSimUrl] = useState("https://search.brave.com/search?q=cara+pemulihan+porn");
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  const checkBridge = useCallback(async () => {
    setIsCheckingExt(true);
    const res = await sendFocusGuardBridgeCommand({ type: "FG_PING" });
    setIsConnected(res.connected);
    if (res.connected && res.state) {
      setExtSnapshot(res.state);
      // Merge extension authoritative state into local draft
      saveLocalFocusGuardDraft(res.state.config);
      setConfig(res.state.config);
    } else {
      setExtSnapshot(null);
      const localDraft = loadLocalFocusGuardDraft();
      const onboarding = loadOnboardingData();
      if (onboarding && !localDraft.updatedAt) {
        localDraft.personalGoal = `Menjaga ${REASON_LABELS[onboarding.reason].toLowerCase()} dan langkah pemulihan hari ini.`;
      }
      setConfig(localDraft);
    }
    setIsCheckingExt(false);
  }, []);

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => {
      void checkBridge();
    });
    return () => window.cancelAnimationFrame(raf);
  }, [checkBridge]);

  const commitConfig = async (next: FocusGuardConfig, successText?: string) => {
    setErrorMessage("");
    const saved = saveLocalFocusGuardDraft(next);
    setConfig(saved);

    const res = await sendFocusGuardBridgeCommand({
      type: "FG_SYNC_CONFIG",
      config: saved,
    });

    if (res.connected && res.state) {
      setIsConnected(true);
      setExtSnapshot(res.state);
      setConfig(res.state.config);
      saveLocalFocusGuardDraft(res.state.config);
      if (successText) {
        setStatusMessage(`${successText} (Tersinkron ke extension)`);
      }
    } else if (successText) {
      setStatusMessage(
        `${successText} (Disimpan di pratinjau lokal; buka atau pasang extension untuk mengaktifkan proteksi browser)`
      );
    }
  };

  const handleToggleMain = async () => {
    const nextEnabled =
      extSnapshot?.inactiveReason === "paused" ? true : !config.enabled;
    await commitConfig(
      {
        ...config,
        enabled: nextEnabled,
        pauseUntil: null,
      },
      nextEnabled ? "Focus Guard diaktifkan." : "Focus Guard dimatikan."
    );
  };

  const handlePause10 = async () => {
    if (isConnected) {
      const res = await sendFocusGuardBridgeCommand({
        type: "FG_PAUSE",
        minutes: 10,
      });
      if (res.connected && res.state) {
        setExtSnapshot(res.state);
        setConfig(res.state.config);
        saveLocalFocusGuardDraft(res.state.config);
        setStatusMessage("Proteksi dijeda sementara selama 10 menit.");
        return;
      }
    }
    await commitConfig(
      { ...config, pauseUntil: Date.now() + 10 * 60_000 },
      "Jeda 10 menit dicatat."
    );
  };

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = normalizeDomainInput(domainInput);
    if (!clean) {
      setErrorMessage(
        "Masukkan nama domain yang valid (mis. example.com), bukan IP lokal atau URL sistem browser."
      );
      return;
    }
    setDomainInput("");
    const nextDomains = Array.from(new Set([...config.blockedDomains, clean]));
    await commitConfig(
      { ...config, blockedDomains: nextDomains },
      `Domain ${clean} ditambahkan.`
    );
  };

  const handleAddKeyword = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = normalizeKeywordInput(keywordInput);
    if (!clean) {
      setErrorMessage(
        "Kata kunci harus 2 hingga 48 karakter tanpa simbol regex (<, >, *, +, dll)."
      );
      return;
    }
    setKeywordInput("");
    const nextKeywords = Array.from(new Set([...config.blockedKeywords, clean]));
    await commitConfig(
      { ...config, blockedKeywords: nextKeywords },
      `Kata kunci "${clean}" ditambahkan.`
    );
  };

  const handleAddAllowlist = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = normalizeDomainInput(allowInput);
    if (!clean) {
      setErrorMessage("Masukkan domain pengecualian yang valid.");
      return;
    }
    setAllowInput("");
    const nextAllow = Array.from(new Set([...config.allowlistDomains, clean]));
    await commitConfig(
      { ...config, allowlistDomains: nextAllow },
      `${clean} ditambahkan ke allowlist.`
    );
  };

  const togglePreset = async (presetId: FocusGuardCategoryId) => {
    const active = config.enabledCategories.includes(presetId);
    const nextCats = active
      ? config.enabledCategories.filter((c) => c !== presetId)
      : [...config.enabledCategories, presetId];
    await commitConfig(
      { ...config, enabledCategories: nextCats },
      active ? "Preset dinonaktifkan." : "Preset diterapkan."
    );
  };

  const handleResetAll = async () => {
    clearLocalFocusGuardDraft();
    if (isConnected) {
      const res = await sendFocusGuardBridgeCommand({
        type: "FG_RESET_LOCAL_DATA",
      });
      if (res.connected && res.state) {
        setExtSnapshot(res.state);
        setConfig(res.state.config);
        setStatusMessage("Seluruh aturan dan statistik lokal Focus Guard sudah dihapus.");
        return;
      }
    }
    const fresh = loadLocalFocusGuardDraft();
    setConfig(fresh);
    setStatusMessage("Pengaturan pratinjau lokal Focus Guard dikembalikan ke bawaan.");
  };

  const { domains: effectiveDomains, keywords: effectiveKeywords } =
    getEffectiveRules(config);

  // Local test simulator uses a preview-enabled copy so user can inspect rule logic safely
  const simResult: EvaluationResult = evaluateNavigationUrl(simUrl, {
    ...config,
    enabled: true,
    pauseUntil: null,
    schedule: { ...config.schedule, enabled: false },
  });

  // Truthful status calculation (never falsely claim "Dilindungi" when extension missing/inactive)
  let statusBadge = "Extension Belum Terdeteksi";
  let statusTitle = "Pratinjau Konfigurasi Lokal (Extension Belum Terhubung)";
  let statusDesc =
    "Website Lumif tidak bisa memblokir situs lain sendirian. Pasang extension Lumif Focus Guard di Chrome, Brave Desktop, atau Firefox Android untuk proteksi nyata di browser.";
  let statusTone: "active" | "paused" | "offline" = "offline";

  if (isConnected && extSnapshot) {
    if (extSnapshot.isEffectivelyActive) {
      statusBadge = "Terhubung · Proteksi Aktif";
      statusTitle = "Lumif Focus Guard Aktif Melindungi Browser Ini";
      statusDesc = `Menjalankan ${effectiveDomains.length} aturan domain dan ${effectiveKeywords.length} filter kata kunci pencarian secara lokal.`;
      statusTone = "active";
    } else if (extSnapshot.inactiveReason === "missing_host_permission") {
      statusBadge = "Perlu Izin Browser";
      statusTitle = "Extension Terhubung, Namun Izin Pengalihan Belum Diberikan";
      statusDesc =
        "Buka popup extension Lumif Focus Guard dan ketuk 'Izinkan Pengalihan Intervensi' agar layar intervensi dapat muncul.";
      statusTone = "paused";
    } else if (extSnapshot.inactiveReason === "paused") {
      statusBadge = "Dijeda Sementara";
      statusTitle = "Proteksi Sedang Dijeda";
      statusDesc =
        "Aturanmu tetap tersimpan dan akan otomatis menyala kembali setelah jeda selesai.";
      statusTone = "paused";
    } else if (extSnapshot.inactiveReason === "outside_schedule") {
      statusBadge = "Di Luar Jadwal";
      statusTitle = "Menunggu Jam Jadwal Fokus Berikutnya";
      statusDesc = `Jadwal aktif: ${String(config.schedule.startHour).padStart(2, "0")}:00 sampai ${String(config.schedule.endHour).padStart(2, "0")}:00.`;
      statusTone = "paused";
    } else if (extSnapshot.inactiveReason === "no_rules") {
      statusBadge = "Belum Ada Aturan";
      statusTitle = "Extension Terhubung, Belum Ada Domain atau Kata Kunci";
      statusDesc =
        "Tambahkan minimal satu domain atau kata kunci, atau pilih preset uji aman di bawah.";
      statusTone = "paused";
    } else {
      statusBadge = "Extension Nonaktif";
      statusTitle = "Focus Guard Sedang Dimatikan";
      statusDesc =
        "Aktifkan kapan saja saat kamu membutuhkan batas tambahan saat berselancar.";
      statusTone = "offline";
    }
  }

  return (
    <div className="lumif-with-nav relative flex min-h-dvh flex-col bg-surface-soft font-sans text-foreground">
      <ScreenHeader
        title="Lumif Focus Guard"
        subtitle="Intervensi digital berbasis CBT & ACT yang berjalan lokal di browsermu"
        rightAction={
          <button
            type="button"
            onClick={() => void checkBridge()}
            disabled={isCheckingExt}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-border bg-card px-3 text-xs font-bold text-foreground hover:bg-muted disabled:opacity-50"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isCheckingExt ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            <span className="hidden sm:inline">Cek Extension</span>
          </button>
        }
      />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 pb-[calc(110px+env(safe-area-inset-bottom))] pt-5 md:px-8 md:pb-10">
        {statusMessage && (
          <div
            role="status"
            className="flex items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-primary-light px-4 py-3 text-xs font-semibold text-foreground"
          >
            <span>{statusMessage}</span>
            <button
              type="button"
              onClick={() => setStatusMessage("")}
              aria-label="Tutup pesan status"
              className="rounded-lg p-1 hover:bg-black/5"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}

        {errorMessage && (
          <div
            role="alert"
            className="flex items-center justify-between gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs font-semibold text-destructive"
          >
            <span>{errorMessage}</span>
            <button
              type="button"
              onClick={() => setErrorMessage("")}
              aria-label="Tutup pesan error"
              className="rounded-lg p-1 hover:bg-black/5"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Truthful Protection Status Hero */}
        <section
          className={`rounded-3xl border p-6 shadow-xs ${
            statusTone === "active"
              ? "border-primary/40 bg-[#257B5A] text-white"
              : statusTone === "paused"
              ? "border-[#EDBF45]/60 bg-[#FFF9E6] text-[#071013] dark:border-amber-700/60 dark:bg-amber-950/35 dark:text-foreground"
              : "border-border bg-card text-card-foreground"
          }`}
        >
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-black/10 px-3 py-1 text-xs font-bold dark:bg-white/10">
                {statusTone === "active" ? (
                  <ShieldCheck className="h-4 w-4 text-[#EDBF45]" aria-hidden="true" />
                ) : statusTone === "paused" ? (
                  <ShieldAlert className="h-4 w-4 text-brand-orange-ink" aria-hidden="true" />
                ) : (
                  <Shield className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                )}
                <span>{statusBadge}</span>
              </div>

              <h2 className="font-heading text-xl font-bold leading-snug sm:text-2xl">
                {statusTitle}
              </h2>
              <p
                className={`max-w-2xl text-xs leading-relaxed sm:text-sm ${
                  statusTone === "active"
                    ? "text-white/90"
                    : "text-muted-foreground"
                }`}
              >
                {statusDesc}
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => void handleToggleMain()}
                className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl px-5 font-heading text-xs font-bold transition sm:text-sm ${
                  statusTone === "active"
                    ? "bg-white text-[#257B5A] hover:bg-white/90"
                    : "bg-primary text-primary-foreground hover:bg-primary-dark"
                }`}
              >
                <Play className="h-4 w-4" aria-hidden="true" />
                <span>
                  {config.enabled && extSnapshot?.inactiveReason !== "paused"
                    ? "Matikan"
                    : "Aktifkan Proteksi"}
                </span>
              </button>

              {config.enabled && extSnapshot?.inactiveReason !== "paused" && (
                <button
                  type="button"
                  onClick={() => void handlePause10()}
                  className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 font-heading text-xs font-bold transition sm:text-sm ${
                    statusTone === "active"
                      ? "border border-white/30 bg-white/15 text-white hover:bg-white/25"
                      : "border border-border bg-surface-soft text-foreground hover:bg-muted"
                  }`}
                >
                  <PauseCircle className="h-4 w-4" aria-hidden="true" />
                  <span>Jeda 10 Menit</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowInstallGuide((prev) => !prev)}
                className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 font-heading text-xs font-bold transition sm:text-sm ${
                  statusTone === "active"
                    ? "border border-white/30 bg-transparent text-white hover:bg-white/10"
                    : "border border-border bg-card text-foreground hover:bg-muted"
                }`}
              >
                <Smartphone className="h-4 w-4" aria-hidden="true" />
                <span>{showInstallGuide ? "Tutup Panduan" : "Panduan Brave & Android"}</span>
              </button>
            </div>
          </div>

          {showInstallGuide && (
            <div
              className={`mt-5 grid grid-cols-1 gap-4 rounded-2xl border p-4 text-xs leading-relaxed md:grid-cols-2 ${
                statusTone === "active"
                  ? "border-white/20 bg-black/20 text-white/95"
                  : "border-border bg-surface-soft text-foreground"
              }`}
            >
              <div>
                <p className="font-heading text-sm font-bold">
                  Laptop: Chrome & Brave Desktop
                </p>
                <ol className="mt-2 list-decimal space-y-1 pl-4">
                  <li>
                    Buka <code>brave://extensions</code> atau <code>chrome://extensions</code>.
                  </li>
                  <li>
                    Aktifkan <strong>Developer mode</strong> di pojok kanan atas.
                  </li>
                  <li>
                    Klik <strong>Load unpacked</strong> dan pilih folder{" "}
                    <code>extension/.output/chrome-mv3</code>.
                  </li>
                  <li>
                    Refresh halaman ini dan tekan <strong>Cek Extension</strong>.
                  </li>
                </ol>
              </div>

              <div>
                <p className="font-heading text-sm font-bold">
                  Android: Firefox Android & Batasan Brave Android
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-4">
                  <li>
                    <strong>Brave Android & Chrome Android standar</strong> tidak mendukung pemasangan extension browser apa pun di Android.
                  </li>
                  <li>
                    Untuk proteksi browser nyata di HP Android, pasang build{" "}
                    <code>extension/.output/firefox-mv3</code> pada{" "}
                    <strong>Firefox for Android / Nightly</strong> via <code>adb</code> dan{" "}
                    <code>web-ext run --target=firefox-android</code>.
                  </li>
                </ul>
              </div>
            </div>
          )}
        </section>

        {/* Main 2-column Preferences & Tools */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left 7 columns: Rules & Presets */}
          <div className="space-y-6 lg:col-span-7">
            {/* Opt-in Presets */}
            <section className="rounded-3xl border border-border bg-card p-5 shadow-xs sm:p-6">
              <h2 className="font-heading text-base font-bold text-foreground">
                Paket Proteksi Sukarela
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Tidak ada pembatasan yang aktif diam-diam. Pilih paket di bawah hanya jika sesuai kebutuhanmu.
              </p>

              <div className="mt-4 space-y-2.5">
                {FOCUS_GUARD_PRESETS.map((preset) => {
                  const active = config.enabledCategories.includes(preset.id);
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => void togglePreset(preset.id)}
                      className={`flex w-full items-start justify-between gap-3 rounded-2xl border p-4 text-left transition ${
                        active
                          ? "border-primary bg-primary-light/60"
                          : "border-border bg-surface-soft/60 hover:border-primary/40"
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-heading text-sm font-bold text-foreground">
                            {preset.title}
                          </span>
                          <span className="rounded-md bg-card px-2 py-0.5 text-[10px] font-bold text-brand-orange-ink">
                            {preset.badge}
                          </span>
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {preset.description}
                        </p>
                      </div>
                      <span
                        className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                          active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card"
                        }`}
                        aria-hidden="true"
                      >
                        {active && <CheckCircle2 className="h-4 w-4" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Blocked Domains */}
            <section className="rounded-3xl border border-border bg-card p-5 shadow-xs sm:p-6">
              <h2 className="font-heading text-base font-bold text-foreground">
                Daftar Website & Domain yang Dibatasi
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Mencakup domain utama dan subdomain secara presisi (mis. <code>x.com</code> tidak memblokir <code>box.com</code>).
              </p>

              <form onSubmit={handleAddDomain} className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  placeholder="mis. example.com atau reddit.com"
                  aria-label="Tambah domain dibatasi"
                  className="h-11 min-w-0 flex-1 rounded-xl border border-input bg-surface-soft px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-xl bg-primary px-4 font-heading text-xs font-bold text-primary-foreground hover:bg-primary-dark"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  <span>Tambah</span>
                </button>
              </form>

              <div className="mt-4 flex flex-wrap gap-2">
                {config.blockedDomains.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Belum ada domain kustom. Aktifkan preset atau tambahkan domain sendiri di atas.
                  </p>
                ) : (
                  config.blockedDomains.map((dom) => (
                    <span
                      key={dom}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface-soft px-3 py-1.5 text-xs font-semibold text-foreground"
                    >
                      <span>{dom}</span>
                      <button
                        type="button"
                        onClick={() =>
                          void commitConfig({
                            ...config,
                            blockedDomains: config.blockedDomains.filter(
                              (d) => d !== dom
                            ),
                          })
                        }
                        aria-label={`Hapus domain ${dom}`}
                        className="rounded-md p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <X className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </section>

            {/* Search Keyword Filtering */}
            <section className="rounded-3xl border border-border bg-card p-5 shadow-xs sm:p-6">
              <h2 className="font-heading text-base font-bold text-foreground">
                Filter Kata Kunci Mesin Pencari
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Berjalan lokal pada Google, Brave Search, Bing, DuckDuckGo, Yahoo, Ecosia, Startpage, dan YouTube Search. Pencarian bertopik edukasi atau pemulihan tetap diloloskan.
              </p>

              <form onSubmit={handleAddKeyword} className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  placeholder="mis. lumiftestblock atau porn"
                  aria-label="Tambah kata kunci pencarian"
                  className="h-11 min-w-0 flex-1 rounded-xl border border-input bg-surface-soft px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-xl bg-primary px-4 font-heading text-xs font-bold text-primary-foreground hover:bg-primary-dark"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  <span>Tambah</span>
                </button>
              </form>

              <div className="mt-4 flex flex-wrap gap-2">
                {config.blockedKeywords.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Belum ada kata kunci kustom yang ditambahkan.
                  </p>
                ) : (
                  config.blockedKeywords.map((kw) => (
                    <span
                      key={kw}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface-soft px-3 py-1.5 text-xs font-semibold text-foreground"
                    >
                      <span>{kw}</span>
                      <button
                        type="button"
                        onClick={() =>
                          void commitConfig({
                            ...config,
                            blockedKeywords: config.blockedKeywords.filter(
                              (k) => k !== kw
                            ),
                          })
                        }
                        aria-label={`Hapus kata kunci ${kw}`}
                        className="rounded-md p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <X className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Allowlist */}
              <div className="mt-6 border-t border-border pt-5">
                <h3 className="font-heading text-sm font-bold text-foreground">
                  Allowlist (Pengecualian Domain)
                </h3>
                <form onSubmit={handleAddAllowlist} className="mt-2.5 flex gap-2">
                  <input
                    type="text"
                    value={allowInput}
                    onChange={(e) => setAllowInput(e.target.value)}
                    placeholder="mis. nih.gov"
                    aria-label="Tambah domain pengecualian"
                    className="h-10 min-w-0 flex-1 rounded-xl border border-input bg-surface-soft px-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="min-h-[40px] shrink-0 rounded-xl border border-border bg-surface-soft px-3.5 font-heading text-xs font-bold text-foreground hover:bg-muted"
                  >
                    Kecualikan
                  </button>
                </form>

                <div className="mt-3 flex flex-wrap gap-2">
                  {config.allowlistDomains.map((al) => (
                    <span
                      key={al}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-primary-light px-3 py-1 text-xs font-semibold text-primary"
                    >
                      <span>{al}</span>
                      <button
                        type="button"
                        onClick={() =>
                          void commitConfig({
                            ...config,
                            allowlistDomains: config.allowlistDomains.filter(
                              (item) => item !== al
                            ),
                          })
                        }
                        aria-label={`Hapus pengecualian ${al}`}
                        className="rounded p-0.5 hover:bg-black/10"
                      >
                        <X className="h-3 w-3" aria-hidden="true" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Right 5 columns: Behavior, Simulator, Stats & Existing Recovery Integration */}
          <div className="space-y-6 lg:col-span-5">
            {/* Personal Goal, Mode & Schedule */}
            <section className="rounded-3xl border border-border bg-card p-5 shadow-xs sm:p-6">
              <h2 className="font-heading text-base font-bold text-foreground">
                Perilaku Intervensi & Jadwal
              </h2>

              <div className="mt-4 space-y-4">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold text-foreground">
                    Pengingat Tujuan Pribadi
                  </span>
                  <input
                    type="text"
                    maxLength={160}
                    value={config.personalGoal}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        personalGoal: e.target.value,
                      }))
                    }
                    onBlur={() => void commitConfig(config, "Tujuan diperbarui.")}
                    className="h-11 w-full rounded-xl border border-input bg-surface-soft px-3.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold text-foreground">
                    Respons saat Situs/Pencarian Dicegat
                  </span>
                  <select
                    value={config.interventionMode}
                    onChange={(e) =>
                      void commitConfig(
                        {
                          ...config,
                          interventionMode: e.target.value as InterventionMode,
                        },
                        "Mode intervensi diperbarui."
                      )
                    }
                    className="h-11 w-full rounded-xl border border-input bg-surface-soft px-3 text-xs font-semibold text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="supportive_pause">
                      Tampilkan Jeda Sadar 10 Detik & Pengingat Tujuan
                    </option>
                    <option value="breathing_first">
                      Langsung Buka Panduan Napas 4-4-6
                    </option>
                  </select>
                </label>

                <div className="rounded-2xl border border-border bg-surface-soft/70 p-4">
                  <label className="flex cursor-pointer items-center justify-between gap-3">
                    <div>
                      <span className="block text-xs font-bold text-foreground">
                        Jadwal Fokus Jam Rawan
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        Otomatis aktif di jam tertentu (mendukung lintas tengah malam)
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.schedule.enabled}
                      onChange={(e) =>
                        void commitConfig(
                          {
                            ...config,
                            schedule: {
                              ...config.schedule,
                              enabled: e.target.checked,
                            },
                          },
                          "Jadwal focus guard disimpan."
                        )
                      }
                      className="h-5 w-5 accent-primary"
                    />
                  </label>

                  {config.schedule.enabled && (
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <label className="text-xs font-semibold">
                        <span className="mb-1 block text-muted-foreground">
                          Jam Mulai (0-23)
                        </span>
                        <input
                          type="number"
                          min={0}
                          max={23}
                          value={config.schedule.startHour}
                          onChange={(e) =>
                            void commitConfig({
                              ...config,
                              schedule: {
                                ...config.schedule,
                                startHour: Number(e.target.value),
                              },
                            })
                          }
                          className="h-10 w-full rounded-xl border border-input bg-card px-3 text-xs"
                        />
                      </label>

                      <label className="text-xs font-semibold">
                        <span className="mb-1 block text-muted-foreground">
                          Jam Selesai (0-23)
                        </span>
                        <input
                          type="number"
                          min={0}
                          max={23}
                          value={config.schedule.endHour}
                          onChange={(e) =>
                            void commitConfig({
                              ...config,
                              schedule: {
                                ...config.schedule,
                                endHour: Number(e.target.value),
                              },
                            })
                          }
                          className="h-10 w-full rounded-xl border border-input bg-card px-3 text-xs"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Local Rule Simulator (Non-invasive local QA tool) */}
            <section className="rounded-3xl border border-border bg-card p-5 shadow-xs sm:p-6">
              <div className="flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-primary" aria-hidden="true" />
                <h2 className="font-heading text-base font-bold text-foreground">
                  Uji Logika Aturan Secara Lokal
                </h2>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Cek hasil penyaringan tanpa membuka situs atau mengirim URL ke server.
              </p>

              <input
                type="url"
                value={simUrl}
                onChange={(e) => setSimUrl(e.target.value)}
                aria-label="URL simulasi uji lokal"
                className="mt-3 h-11 w-full rounded-xl border border-input bg-surface-soft px-3 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
              />

              <div className="mt-3 rounded-xl bg-surface-soft px-3.5 py-2.5 text-xs">
                <span className="font-bold text-foreground">Hasil Evaluasi: </span>
                <span
                  className={
                    simResult.action === "intervene"
                      ? "font-bold text-brand-orange-ink"
                      : "font-bold text-primary"
                  }
                >
                  {simResult.action === "intervene"
                    ? `Mengarahkan ke Intervensi (${simResult.reason}${simResult.engineId ? `: ${simResult.engineId}` : ""})`
                    : `Diizinkan (${simResult.reason})`}
                </span>
              </div>
            </section>

            {/* Integrated Existing Recovery Tools */}
            <section className="rounded-3xl border border-border bg-card p-5 shadow-xs sm:p-6">
              <h2 className="font-heading text-base font-bold text-foreground">
                Alat Pendamping Saat Dorongan Muncul
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Terhubung langsung dengan fitur CBT, ACT, pernapasan, dan permainan tenang Lumif.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
                <Link
                  href="/exercises/breathing"
                  className="flex min-h-[48px] items-center gap-3 rounded-xl border border-border bg-surface-soft/70 px-3.5 py-2.5 text-xs font-bold text-foreground transition hover:border-primary/50"
                >
                  <Wind className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span>Latihan Pernapasan 3D</span>
                </Link>
                <Link
                  href="/games"
                  className="flex min-h-[48px] items-center gap-3 rounded-xl border border-border bg-surface-soft/70 px-3.5 py-2.5 text-xs font-bold text-foreground transition hover:border-primary/50"
                >
                  <Gamepad2 className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span>10 Mini Game & Trivia Visual</span>
                </Link>
                <Link
                  href="/urge-log"
                  className="flex min-h-[48px] items-center gap-3 rounded-xl border border-border bg-surface-soft/70 px-3.5 py-2.5 text-xs font-bold text-foreground transition hover:border-primary/50"
                >
                  <Zap className="h-4 w-4 text-brand-orange-ink" aria-hidden="true" />
                  <span>Catat Hasrat & Audit HALT</span>
                </Link>
                <Link
                  href="/modules"
                  className="flex min-h-[48px] items-center gap-3 rounded-xl border border-border bg-surface-soft/70 px-3.5 py-2.5 text-xs font-bold text-foreground transition hover:border-primary/50"
                >
                  <BookOpen className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span>Modul Riset CBT & ACT (5 Bab)</span>
                </Link>
                <Link
                  href="/home"
                  className="flex min-h-[48px] items-center gap-3 rounded-xl border border-border bg-surface-soft/70 px-3.5 py-2.5 text-xs font-bold text-foreground transition hover:border-primary/50"
                >
                  <ClipboardList className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span>Evaluasi Harian di Beranda</span>
                </Link>
              </div>
            </section>

            {/* Aggregate Stats & Privacy Reset */}
            <section className="rounded-3xl border border-border bg-card p-5 shadow-xs sm:p-6">
              <h2 className="font-heading text-base font-bold text-foreground">
                Statistik Lokal & Privasi
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Hanya menghitung angka agregat di perangkatmu. Riwayat URL dan kata kunci tidak pernah dikirim ke server.
              </p>

              <div className="mt-4 grid grid-cols-3 gap-2.5 text-center">
                <div className="rounded-2xl bg-surface-soft p-3">
                  <p className="font-heading text-xl font-bold text-foreground">
                    {extSnapshot?.stats.interventionsToday ?? 0}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Intervensi hari ini
                  </p>
                </div>
                <div className="rounded-2xl bg-surface-soft p-3">
                  <p className="font-heading text-xl font-bold text-primary">
                    {extSnapshot?.stats.pausesCompleted ?? 0}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Jeda sadar selesai
                  </p>
                </div>
                <div className="rounded-2xl bg-surface-soft p-3">
                  <p className="font-heading text-xl font-bold text-brand-orange-ink">
                    {extSnapshot?.stats.recoveryActionsChosen ?? 0}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Aksi pengalihan
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => void handleResetAll()}
                className="mt-4 flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 font-heading text-xs font-bold text-destructive transition hover:bg-destructive/15"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                <span>Hapus Seluruh Data Lokal Focus Guard</span>
              </button>
            </section>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
