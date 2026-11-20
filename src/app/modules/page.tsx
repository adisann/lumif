"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import ScreenHeader from "@/components/ScreenHeader";
import { loadCompletedModuleIds } from "@/components/ModuleReader";
import { MODULES_DATA } from "@/lib/modulesData";
import { BookOpen, CheckCircle2, Clock, ArrowRight } from "lucide-react";

export default function ModulesListScreen() {
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => {
      setCompletedIds(loadCompletedModuleIds());
    });
    return () => window.cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="lumif-with-nav relative flex min-h-dvh flex-col bg-surface-soft font-sans text-foreground">
      <ScreenHeader
        title="Modul Edukasi"
        subtitle="Bacaan ringkas psikologi pemulihan kebiasaan"
      />

      <main className="flex-1 px-4 pb-[calc(110px+env(safe-area-inset-bottom))] pt-5 md:px-8 md:pb-10">
        <div className="mx-auto w-full max-w-5xl space-y-6">
          <div className="relative overflow-hidden rounded-3xl bg-[#257B5A] p-6 text-white md:p-8">
            <div className="relative z-10 max-w-xl">
              <p className="text-xs font-bold uppercase tracking-wide text-[#EDBF45]">
                Kurikulum CBT & ACT
              </p>
              <h2 className="mt-1.5 font-heading text-xl font-bold leading-snug md:text-2xl">
                Belajar Menguasai Pikiran & Kendali Diri
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-white/90 md:text-sm">
                Seluruh 5 bab kini lengkap disusun berbasis riset psikologi klinis dan neurosains dengan format bacaan nyaman serta langkah kecil siap praktik.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/15 px-3 py-1.5 text-xs font-bold text-white">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#EDBF45]" aria-hidden="true" />
                <span>
                  {completedIds.filter((id) => MODULES_DATA.some((m) => m.id === id)).length} dari{" "}
                  {MODULES_DATA.length} bab selesai dibaca
                </span>
              </div>
            </div>

            <BookOpen
              className="absolute -bottom-4 -right-4 h-36 w-36 text-white/10"
              aria-hidden="true"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {MODULES_DATA.map((mod) => {
              const isCompleted = completedIds.includes(mod.id);

              return (
                <Link
                  key={mod.id}
                  href={`/modules/${mod.id}`}
                  className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/50"
                >
                  <div>
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex h-9 w-9 items-center justify-center rounded-xl font-heading text-sm font-bold ${
                          isCompleted
                            ? "bg-primary-light text-primary"
                            : "bg-surface-soft text-brand-orange-ink"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" />
                        ) : (
                          mod.number
                        )}
                      </span>

                      <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                        {mod.readMinutes} menit · {mod.sections.length} bagian
                      </span>
                    </div>

                    <p className="text-[11px] font-bold text-primary">
                      BAB {mod.number}
                    </p>
                    <h3 className="mt-1 font-heading text-base font-bold leading-snug text-card-foreground group-hover:text-primary">
                      {mod.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                      {mod.subtitle}
                    </p>
                  </div>

                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary">
                    {isCompleted ? "Baca Ulang" : "Mulai Baca"}
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
