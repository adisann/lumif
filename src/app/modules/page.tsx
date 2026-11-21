"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import ScreenHeader from "@/components/ScreenHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { loadCompletedModuleIds } from "@/components/ModuleReader";
import {
  MODULE_PHASES,
  MODULES_DATA,
  type ModuleApproach,
} from "@/lib/modulesData";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Info,
  Sparkles,
} from "lucide-react";

type FilterMode = "all" | "core" | "1" | "2" | "3" | "4";

const APPROACH_STYLE: Record<ModuleApproach, string> = {
  Psikoedukasi: "text-primary",
  CBT: "text-foreground",
  ACT: "text-primary",
  "CBT + ACT": "text-foreground",
};

const FILTER_TABS: { key: FilterMode; label: string }[] = [
  { key: "all", label: "Semua (16 Bab)" },
  { key: "core", label: "Alur Mulai (8 Bab)" },
  { key: "1", label: "Fase 1" },
  { key: "2", label: "Fase 2 · CBT" },
  { key: "3", label: "Fase 3 · ACT" },
  { key: "4", label: "Fase 4" },
];

export default function ModulesListScreen() {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);
  const [filterMode, setFilterMode] = useState<FilterMode>("all");

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => {
      setCompletedIds(loadCompletedModuleIds());
      setIsLoadingProgress(false);
    });
    return () => window.cancelAnimationFrame(raf);
  }, []);

  const completedCount = useMemo(
    () => completedIds.filter((id) => MODULES_DATA.some((m) => m.id === id)).length,
    [completedIds]
  );

  const visiblePhases = useMemo(() => {
    if (filterMode === "1" || filterMode === "2" || filterMode === "3" || filterMode === "4") {
      const num = Number(filterMode);
      return MODULE_PHASES.filter((p) => p.phase === num);
    }
    return MODULE_PHASES;
  }, [filterMode]);

  return (
    <div className="lumif-with-nav relative flex min-h-dvh flex-col bg-surface-soft font-sans text-foreground">
      <ScreenHeader
        title="Modul Edukasi"
        subtitle="16 Bab Belajar untuk Kebiasaan Digital yang Lebih Sehat"
      />

      <main className="flex-1 px-4 pb-[calc(110px+env(safe-area-inset-bottom))] pt-5 md:px-8 md:pb-10">
        <div className="mx-auto w-full max-w-5xl space-y-6">
          {/* Minimal Overview Header */}
          <section className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:p-6">
            <div className="max-w-2xl space-y-1.5">
              <h2 className="font-heading text-lg font-bold leading-snug text-foreground md:text-xl">
                Memahami Diri dan Kebiasaan Digital
              </h2>
              <p className="text-xs leading-relaxed text-muted-foreground md:text-sm">
                16 bab dalam 4 fase berbasis riset CBT dan ACT hingga 2026. Setiap bab berisi bacaan singkat, contoh harian, dan praktik opsional.
              </p>
              {isLoadingProgress ? (
                <Skeleton className="mt-1 h-4 w-44" />
              ) : (
                <p className="inline-flex items-center gap-1.5 pt-1 text-xs font-semibold text-primary">
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>
                    {completedCount} dari {MODULES_DATA.length} bab selesai dibaca
                  </span>
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                setFilterMode((prev) => (prev === "core" ? "all" : "core"))
              }
              className="inline-flex min-h-[42px] shrink-0 items-center justify-center rounded-xl bg-primary px-4 font-heading text-xs font-bold text-primary-foreground transition hover:bg-primary-dark"
            >
              {filterMode === "core"
                ? "Tampilkan Semua 16 Bab"
                : "Lihat 8 Bab Alur Mulai"}
            </button>
          </section>

          {/* Filter Pills */}
          <div
            role="tablist"
            aria-label="Filter fase modul edukasi"
            className="flex flex-wrap gap-2"
          >
            {FILTER_TABS.map((tab) => {
              const isActive = filterMode === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setFilterMode(tab.key)}
                  className={`min-h-[38px] rounded-xl px-3.5 py-1.5 font-heading text-xs font-bold transition ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "border border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {filterMode === "core" && (
            <div className="flex items-start gap-2.5 rounded-2xl border border-[#EDBF45]/60 bg-amber-50/70 px-4 py-3 text-xs leading-relaxed text-[#5C3A00] dark:bg-amber-950/30 dark:text-amber-200">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#CC6500]" aria-hidden="true" />
              <p>
                <strong>Alur Mulai 8 Bab (Bab 01, 02, 03, 05, 06, 09, 13, 15):</strong>{" "}
                Jalur ringkas yang direkomendasikan bila kamu ingin memahami fondasi kebiasaan, melatih teknik inti CBT &amp; ACT, dan menyiapkan rencana menghadapi selip terlebih dahulu.
              </p>
            </div>
          )}

          {/* Phase Sections */}
          <div className="space-y-8">
            {visiblePhases.map((phaseMeta) => {
              const phaseModules = MODULES_DATA.filter((mod) => {
                if (mod.phase !== phaseMeta.phase) return false;
                if (filterMode === "core") return Boolean(mod.isCoreStart);
                return true;
              });

              if (phaseModules.length === 0) return null;

              return (
                <section key={phaseMeta.phase} className="space-y-4">
                  <div className="flex flex-col gap-1 border-b border-border pb-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold text-primary">
                        {phaseMeta.label} · {phaseMeta.approach}
                      </p>
                      <h3 className="mt-0.5 font-heading text-lg font-bold text-foreground">
                        {phaseMeta.title}
                      </h3>
                      <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">
                        {phaseMeta.summary}
                      </p>
                    </div>
                    <p className="shrink-0 text-[11px] font-medium text-muted-foreground">
                      {phaseMeta.basis}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {phaseModules.map((mod) => {
                      const isCompleted = completedIds.includes(mod.id);
                      const numLabel = String(mod.number).padStart(2, "0");

                      return (
                        <Link
                          key={mod.id}
                          href={`/modules/${mod.id}`}
                          className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/50"
                        >
                          <div>
                            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`inline-flex h-9 w-9 items-center justify-center rounded-xl font-heading text-sm font-bold ${
                                    isCompleted
                                      ? "bg-primary-light text-primary"
                                      : "bg-surface-soft text-brand-orange-ink"
                                  }`}
                                >
                                  {isCompleted ? (
                                    <CheckCircle2
                                      className="h-5 w-5 text-primary"
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    numLabel
                                  )}
                                </span>

                                <span
                                  className={`text-xs font-semibold ${APPROACH_STYLE[mod.approachTag]}`}
                                >
                                  {mod.approachTag}
                                </span>

                                {mod.isCoreStart && (
                                  <span className="text-xs font-medium text-muted-foreground">
                                    · Rekomendasi mulai
                                  </span>
                                )}
                              </div>

                              <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                                {mod.readMinutes} menit
                              </span>
                            </div>

                            <h4 className="font-heading text-base font-bold leading-snug text-card-foreground group-hover:text-primary">
                              {mod.title}
                            </h4>
                            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                              {mod.subtitle}
                            </p>
                          </div>

                          <div className="mt-4 flex items-center justify-between gap-2 pt-2">
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-primary">
                              {isCompleted ? "Baca Ulang" : "Mulai Baca"}
                              <ArrowRight
                                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                                aria-hidden="true"
                              />
                            </span>

                            {mod.practiceLink && (
                              <span className="truncate text-[11px] font-medium text-muted-foreground">
                                Terhubung: {mod.practiceLink.label}
                              </span>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>

          {/* Scientific Transparency Notice */}
          <footer className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 text-xs leading-relaxed text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <p className="font-heading font-bold text-foreground">
                Catatan Transparansi Ilmiah
              </p>
              <p className="mt-0.5">
                Seluruh modul merupakan bacaan edukasi swabantu berbasis prinsip CBT dan ACT (bukan layanan terapi klinis atau diagnosis medis). Estimasi menit baca adalah rancangan kurikulum, dan setiap bab mencantumkan rujukan riset serta batasan buktinya secara terbuka.
              </p>
            </div>
          </footer>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
