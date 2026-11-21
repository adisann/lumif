"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import ScreenHeader from "@/components/ScreenHeader";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
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
  subscribeFocusGuardPush,
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
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [showRuleTester, setShowRuleTester] = useState(false);
  const [simUrl, setSimUrl] = useState("https://example.com");

  const checkBridge = useCallback(async () => {
    setIsCheckingExt(true);
    const res = await sendFocusGuardBridgeCommand({ type: "FG_PING" });
    setIsConnected(res.connected);
    if (res.connected && res.state) {
      setExtSnapshot(res.state);
      saveLocalFocusGuardDraft(res.state.config);
      setConfig(res.state.config);
      setShowInstallGuide(false);
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
    const unsubPush = subscribeFocusGuardPush((pushedState) => {
      setIsConnected(true);
      setIsCheckingExt(false);
      setExtSnapshot(pushedState);
      saveLocalFocusGuardDraft(pushedState.config);
      setConfig(pushedState.config);
      setShowInstallGuide(false);
    });
    const onFocus = () => {
      void checkBridge();
    };
    window.addEventListener("focus", onFocus);
    return () => {
      window.cancelAnimationFrame(raf);
      unsubPush();
      window.removeEventListener("focus", onFocus);
    };
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
        setStatusMessage(successText);
      }
    } else if (successText) {
      setStatusMessage(`${successText} Aturan tersimpan di perangkat ini.`);
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
      nextEnabled ? "Proteksi diaktifkan." : "Proteksi dimatikan."
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
        setStatusMessage("Dijeda selama 10 menit.");
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
      setErrorMessage("Masukkan nama situs yang valid, misalnya reddit.com.");
      return;
    }
    setDomainInput("");
    const nextDomains = Array.from(new Set([...config.blockedDomains, clean]));
    await commitConfig(
      { ...config, blockedDomains: nextDomains },
      `Situs ${clean} ditambahkan.`
    );
  };

  const handleAddKeyword = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = normalizeKeywordInput(keywordInput);
    if (!clean) {
      setErrorMessage("Kata kunci harus 2 hingga 48 karakter tanpa simbol khusus.");
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
      setErrorMessage("Masukkan nama situs pengecualian yang valid.");
      return;
    }
    setAllowInput("");
    const nextAllow = Array.from(new Set([...config.allowlistDomains, clean]));
    await commitConfig(
      { ...config, allowlistDomains: nextAllow },
      `${clean} dikecualikan.`
    );
  };

  const togglePreset = async (presetId: FocusGuardCategoryId) => {
    const active = config.enabledCategories.includes(presetId);
    const nextCats = active
      ? config.enabledCategories.filter((c) => c !== presetId)
      : [...config.enabledCategories, presetId];
    await commitConfig(
      { ...config, enabledCategories: nextCats },
      active ? "Paket dinonaktifkan." : "Paket diaktifkan."
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
        setStatusMessage("Pengaturan Focus Guard direset ke awal.");
        return;
      }
    }
    const fresh = loadLocalFocusGuardDraft();
    setConfig(fresh);
    setStatusMessage("Pengaturan Focus Guard direset ke awal.");
  };

  const { domains: effectiveDomains, keywords: effectiveKeywords } =
    getEffectiveRules(config);

  const simResult: EvaluationResult = evaluateNavigationUrl(simUrl, {
    ...config,
    enabled: true,
    pauseUntil: null,
    schedule: { ...config.schedule, enabled: false },
  });

  // Single concise status presentation with zero duplicate labels
  let statusBadge = "Ekstensi Belum Terpasang";
  let statusTitle = "Pasang Ekstensi Browser untuk Memulai";
  let statusDesc =
    "Atur situs atau kata kunci pilihanmu di bawah, lalu hubungkan ekstensi Lumif agar layar jeda aktif saat kamu berselancar.";
  let statusTone: "active" | "paused" | "offline" = "offline";

  if (isConnected && extSnapshot) {
    if (extSnapshot.isEffectivelyActive) {
      statusBadge = "Proteksi Aktif";
      statusTitle = "Focus Guard Sedang Menjagamu";
      statusDesc = `Menjalankan ${effectiveDomains.length} situs dibatasi dan ${effectiveKeywords.length} filter pencarian di browser ini.`;
      statusTone = "active";
    } else if (extSnapshot.inactiveReason === "missing_host_permission") {
      statusBadge = "Perlu Izin Browser";
      statusTitle = "Berikan Izin Halaman Jeda";
      statusDesc =
        "Klik ikon Lumif di toolbar browser, lalu tekan 'Izinkan Pengalihan' agar halaman jeda bisa muncul.";
      statusTone = "paused";
    } else if (extSnapshot.inactiveReason === "paused") {
      statusBadge = "Dijeda";
      statusTitle = "Proteksi Dijeda Sementara";
      statusDesc = "Akan aktif kembali otomatis saat waktu jeda berakhir.";
      statusTone = "paused";
    } else if (extSnapshot.inactiveReason === "outside_schedule") {
      statusBadge = "Menunggu Jadwal";
      statusTitle = "Di Luar Jam Fokus";
      statusDesc = `Otomatis aktif pukul ${String(config.schedule.startHour).padStart(2, "0")}:00 sampai ${String(config.schedule.endHour).padStart(2, "0")}:00.`;
      statusTone = "paused";
    } else if (extSnapshot.inactiveReason === "no_rules") {
      statusBadge = "Ekstensi Terhubung";
      statusTitle = "Tambahkan Situs atau Kata Kunci";
      statusDesc =
        "Pilih minimal satu paket atau tambahkan situs di bawah agar proteksi mulai bekerja.";
      statusTone = "paused";
    } else {
      statusBadge = "Ekstensi Terhubung";
      statusTitle = "Proteksi Sedang Nonaktif";
      statusDesc = "Nyalakan kapan saja saat kamu membutuhkan batas fokus tambahan.";
      statusTone = "offline";
    }
  }

  return (
    <div className="lumif-with-nav relative flex min-h-dvh flex-col bg-surface-soft font-sans text-foreground">
      <ScreenHeader
        title="Lumif Focus Guard"
        subtitle="Bantu beri jeda sadar saat membuka situs atau pencarian pemicu"
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
            <span className="hidden sm:inline">Periksa Koneksi</span>
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

        {/* Protection Status & Quick Access Hero */}
        <section
          className={`rounded-3xl border p-6 shadow-xs ${
            statusTone === "active"
              ? "border-primary/40 bg-[#257B5A] text-white"
              : statusTone === "paused"
              ? "border-[#EDBF45]/60 bg-[#FFF9E6] text-[#071013] dark:border-amber-700/60 dark:bg-amber-950/35 dark:text-foreground"
              : "border-border bg-card text-card-foreground"
          }`}
        >
          {isCheckingExt ? (
            <div className="space-y-3" aria-busy="true" aria-label="Memeriksa ekstensi browser">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-7 w-72 rounded-xl" />
              <Skeleton className="h-4 w-full max-w-lg" />
            </div>
          ) : (
            <>
              <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                <div className="space-y-2">
                  <p
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                      statusTone === "active"
                        ? "text-white/90"
                        : "text-muted-foreground"
                    }`}
                  >
                    {statusTone === "active" ? (
                      <ShieldCheck className="h-4 w-4 text-white" aria-hidden="true" />
                    ) : statusTone === "paused" ? (
                      <ShieldAlert className="h-4 w-4 text-brand-orange-ink" aria-hidden="true" />
                    ) : (
                      <Shield className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    )}
                    <span>{statusBadge}</span>
                  </p>

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
                  {isConnected ? (
                    <>
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
                    </>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => setShowInstallGuide((prev) => !prev)}
                    className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 font-heading text-xs font-bold transition sm:text-sm ${
                      !isConnected
                        ? "bg-primary text-primary-foreground hover:bg-primary-dark"
                        : statusTone === "active"
                        ? "border border-white/30 bg-transparent text-white hover:bg-white/10"
                        : "border border-border bg-card text-foreground hover:bg-muted"
                    }`}
                  >
                    <Smartphone className="h-4 w-4" aria-hidden="true" />
                    <span>{showInstallGuide ? "Tutup Cara Pasang" : "Cara Pasang Ekstensi"}</span>
                  </button>
                </div>
              </div>

              {(showInstallGuide || !isConnected) && (
                <div
                  className={`mt-5 rounded-2xl border p-4 text-xs leading-relaxed ${
                    statusTone === "active"
                      ? "border-white/20 bg-black/20 text-white/95"
                      : "border-border bg-surface-soft text-foreground"
                  }`}
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <p className="font-heading text-sm font-bold">
                        Cara Pasang di Laptop (Chrome / Brave / Edge)
                      </p>
                      <ol className="mt-2 list-decimal space-y-1.5 pl-4">
                        <li>
                          Buka tab baru lalu masuk ke <code>chrome://extensions</code> atau{" "}
                          <code>brave://extensions</code>.
                        </li>
                        <li>
                          Aktifkan tombol <strong>Developer mode</strong> di pojok kanan atas.
                        </li>
                        <li>
                          Klik <strong>Load unpacked</strong>, pilih folder{" "}
                          <code>extension/.output/chrome-mv3</code>, lalu tekan{" "}
                          <strong>Periksa Koneksi</strong> di halaman ini.
                        </li>
                      </ol>
                    </div>

                    <div>
                      <p className="font-heading text-sm font-bold">
                        Pengguna HP Android
                      </p>
                      <p className="mt-2 text-muted-foreground">
                        Browser Chrome dan Brave Android belum mendukung ekstensi pihak ketiga. Untuk memblokir langsung di HP Android, gunakan{" "}
                        <strong className="text-foreground">Firefox for Android</strong> dengan ekstensi Lumif Focus Guard.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        {/* Main 2-column Preferences & Tools */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left 7 columns: Presets, Domains & Keywords */}
          <div className="space-y-6 lg:col-span-7">
            <section className="rounded-3xl border border-border bg-card p-5 shadow-xs sm:p-6">
              <h2 className="font-heading text-base font-bold text-foreground">
                Paket Proteksi Pilihan
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Pilih paket yang kamu butuhkan saja. Semua bisa dinyalakan atau dimatikan kapan pun.
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
                Situs yang Dibatasi
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Otomatis mencakup halaman di dalam situs tersebut.
              </p>

              <form onSubmit={handleAddDomain} className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  placeholder="Contoh: reddit.com atau tiktok.com"
                  aria-label="Tambah situs yang dibatasi"
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
                {effectiveDomains.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Belum ada situs dibatasi. Pilih paket di atas atau tambahkan sendiri.
                  </p>
                ) : (
                  <>
                    {config.blockedDomains.map((dom) => (
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
                          aria-label={`Hapus situs ${dom}`}
                          className="rounded-md p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <X className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </span>
                    ))}
                    {effectiveDomains
                      .filter((dom) => !config.blockedDomains.includes(dom))
                      .map((presetDom) => (
                        <span
                          key={`preset-${presetDom}`}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-primary/25 bg-primary-light/60 px-3 py-1.5 text-xs font-semibold text-primary"
                        >
                          <span>{presetDom}</span>
                          <span className="text-[10px] font-medium opacity-80">
                            (paket)
                          </span>
                        </span>
                      ))}
                  </>
                )}
              </div>
            </section>

            {/* Search Keyword Filtering & Allowlist */}
            <section className="rounded-3xl border border-border bg-card p-5 shadow-xs sm:p-6">
              <h2 className="font-heading text-base font-bold text-foreground">
                Kata Kunci Pencarian
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Menyaring pencarian pemicu secara pribadi di browser; topik edukasi dan pemulihan tetap diloloskan.
              </p>

              <form onSubmit={handleAddKeyword} className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  placeholder="Tambah kata kunci pemicu..."
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
                {effectiveKeywords.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Belum ada kata kunci aktif.
                  </p>
                ) : (
                  <>
                    {config.blockedKeywords.map((kw) => (
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
                    ))}
                    {effectiveKeywords
                      .filter((kw) => !config.blockedKeywords.includes(kw))
                      .map((presetKw) => (
                        <span
                          key={`preset-kw-${presetKw}`}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-primary/25 bg-primary-light/60 px-3 py-1.5 text-xs font-semibold text-primary"
                        >
                          <span>{presetKw}</span>
                          <span className="text-[10px] font-medium opacity-80">
                            (paket)
                          </span>
                        </span>
                      ))}
                  </>
                )}
              </div>

              {/* Allowlist */}
              <div className="mt-6 border-t border-border pt-5">
                <h3 className="font-heading text-sm font-bold text-foreground">
                  Pengecualian Situs
                </h3>
                <form onSubmit={handleAddAllowlist} className="mt-2.5 flex gap-2">
                  <input
                    type="text"
                    value={allowInput}
                    onChange={(e) => setAllowInput(e.target.value)}
                    placeholder="Contoh: wikipedia.org"
                    aria-label="Tambah situs pengecualian"
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

          {/* Right 5 columns: Behavior, Connected Tools & Summary */}
          <div className="space-y-6 lg:col-span-5">
            <section className="rounded-3xl border border-border bg-card p-5 shadow-xs sm:p-6">
              <h2 className="font-heading text-base font-bold text-foreground">
                Pengaturan Jeda &amp; Jadwal
              </h2>

              <div className="mt-4 space-y-4">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold text-foreground">
                    Pengingat Tujuan Pribadi
                  </span>
                  <textarea
                    rows={2}
                    maxLength={160}
                    value={config.personalGoal}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        personalGoal: e.target.value,
                      }))
                    }
                    onBlur={() => void commitConfig(config, "Tujuan diperbarui.")}
                    className="w-full resize-none rounded-xl border border-input bg-surface-soft px-3.5 py-2.5 text-xs leading-relaxed font-medium text-foreground focus:border-primary focus:outline-none"
                  />
                </label>

                <div className="block">
                  <span className="mb-1.5 block text-xs font-bold text-foreground">
                    Saat Situs Dibatasi Dibuka
                  </span>
                  <Select
                    value={config.interventionMode}
                    onValueChange={(nextMode) =>
                      void commitConfig(
                        {
                          ...config,
                          interventionMode: nextMode as InterventionMode,
                        },
                        "Mode intervensi diperbarui."
                      )
                    }
                  >
                    <SelectTrigger
                      aria-label="Saat situs dibatasi dibuka"
                      className="h-11 w-full bg-surface-soft"
                    >
                      <SelectValue>
                        {config.interventionMode === "breathing_first"
                          ? "Langsung Buka Latihan Napas"
                          : "Tampilkan Jeda Sadar 10 Detik"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="w-[var(--anchor-width)] max-w-none">
                      <SelectItem value="supportive_pause">
                        Tampilkan Jeda Sadar 10 Detik
                      </SelectItem>
                      <SelectItem value="breathing_first">
                        Langsung Buka Latihan Napas
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-2xl border border-border bg-surface-soft/70 p-4">
                  <label className="flex cursor-pointer items-center justify-between gap-3">
                    <div>
                      <span className="block text-xs font-bold text-foreground">
                        Aktif di Jam Rawan
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        Menyala otomatis sesuai rentang jam pilihanmu
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

            {/* Integrated Recovery Tools */}
            <section className="rounded-3xl border border-border bg-card p-5 shadow-xs sm:p-6">
              <h2 className="font-heading text-base font-bold text-foreground">
                Fitur Pengalihan Fokus
              </h2>

              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
                <Link
                  href="/exercises/breathing"
                  className="flex min-h-[46px] items-center gap-3 rounded-xl border border-border bg-surface-soft/70 px-3.5 py-2 text-xs font-bold text-foreground transition hover:border-primary/50"
                >
                  <Wind className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span>Latihan Pernapasan</span>
                </Link>
                <Link
                  href="/games"
                  className="flex min-h-[46px] items-center gap-3 rounded-xl border border-border bg-surface-soft/70 px-3.5 py-2 text-xs font-bold text-foreground transition hover:border-primary/50"
                >
                  <Gamepad2 className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span>Mini Game &amp; Trivia</span>
                </Link>
                <Link
                  href="/urge-log"
                  className="flex min-h-[46px] items-center gap-3 rounded-xl border border-border bg-surface-soft/70 px-3.5 py-2 text-xs font-bold text-foreground transition hover:border-primary/50"
                >
                  <Zap className="h-4 w-4 text-brand-orange-ink" aria-hidden="true" />
                  <span>Catat Hasrat &amp; Pemicu</span>
                </Link>
                <Link
                  href="/modules"
                  className="flex min-h-[46px] items-center gap-3 rounded-xl border border-border bg-surface-soft/70 px-3.5 py-2 text-xs font-bold text-foreground transition hover:border-primary/50"
                >
                  <BookOpen className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span>Modul CBT &amp; ACT (16 Bab)</span>
                </Link>
                <Link
                  href="/home"
                  className="flex min-h-[46px] items-center gap-3 rounded-xl border border-border bg-surface-soft/70 px-3.5 py-2 text-xs font-bold text-foreground transition hover:border-primary/50"
                >
                  <ClipboardList className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span>Evaluasi Harian</span>
                </Link>
              </div>
            </section>

            {/* Stats & Privacy */}
            <section className="rounded-3xl border border-border bg-card p-5 shadow-xs sm:p-6">
              <h2 className="font-heading text-base font-bold text-foreground">
                Ringkasan Aktivitas &amp; Privasi
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Riwayat penelusuran dan kata kunci tetap di perangkatmu, tidak pernah dikirim ke server.
              </p>

              <div className="mt-4 grid grid-cols-3 gap-2.5 text-center">
                <div className="rounded-2xl bg-surface-soft p-3">
                  <p className="font-heading text-xl font-bold text-foreground">
                    {extSnapshot?.stats.interventionsToday ?? 0}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Intervensi
                  </p>
                </div>
                <div className="rounded-2xl bg-surface-soft p-3">
                  <p className="font-heading text-xl font-bold text-primary">
                    {extSnapshot?.stats.pausesCompleted ?? 0}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Jeda selesai
                  </p>
                </div>
                <div className="rounded-2xl bg-surface-soft p-3">
                  <p className="font-heading text-xl font-bold text-brand-orange-ink">
                    {extSnapshot?.stats.recoveryActionsChosen ?? 0}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Pengalihan
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setShowRuleTester((prev) => !prev)}
                  className="flex min-h-[38px] w-full items-center justify-between rounded-xl border border-border bg-surface-soft px-3.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  <span>Simulasi Uji Aturan</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${showRuleTester ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>

                {showRuleTester && (
                  <div className="space-y-2 rounded-2xl border border-border bg-surface-soft/70 p-3 text-xs">
                    <input
                      type="url"
                      value={simUrl}
                      onChange={(e) => setSimUrl(e.target.value)}
                      aria-label="URL simulasi uji aturan"
                      className="h-10 w-full rounded-xl border border-input bg-card px-3 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                    <p>
                      <strong className="text-foreground">Hasil: </strong>
                      <span
                        className={
                          simResult.action === "intervene"
                            ? "font-bold text-brand-orange-ink"
                            : "font-bold text-primary"
                        }
                      >
                        {simResult.action === "intervene"
                          ? `Menampilkan layar jeda (${simResult.reason})`
                          : `Diizinkan (${simResult.reason})`}
                      </span>
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => void handleResetAll()}
                  className="flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 font-heading text-xs font-bold text-destructive transition hover:bg-destructive/15"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  <span>Reset Pengaturan Focus Guard</span>
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
