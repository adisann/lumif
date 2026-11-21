"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ScreenHeader from "@/components/ScreenHeader";
import { getModuleById } from "@/lib/modulesData";
import { awardPetReward } from "@/lib/pets";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Clock,
  Compass,
  ExternalLink,
  FlaskConical,
  ShieldAlert,
  Target,
} from "lucide-react";

const DONE_SECTIONS_KEY = "lumif_module_sections_done";
const DONE_MODULES_KEY = "lumif_modules_completed";

export function loadCompletedModuleIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(DONE_MODULES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function ModuleReader({ moduleId }: { moduleId: string }) {
  const moduleData = getModuleById(moduleId);
  const [readProgressPct, setReadProgressPct] = useState(0);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [moduleFinished, setModuleFinished] = useState(false);

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => {
      try {
        const rawSec = window.localStorage.getItem(DONE_SECTIONS_KEY);
        if (rawSec) {
          const parsed = JSON.parse(rawSec) as Record<string, string[]>;
          setCompletedSections(parsed[moduleId] ?? []);
        }
        const doneMods = loadCompletedModuleIds();
        setModuleFinished(doneMods.includes(moduleId));
      } catch {
        // Ignore storage read errors
      }
    });
    return () => window.cancelAnimationFrame(raf);
  }, [moduleId]);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        setReadProgressPct(100);
        return;
      }
      setReadProgressPct(
        Math.min(100, Math.max(0, Math.round((scrollTop / docHeight) * 100)))
      );
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!moduleData) {
    return (
      <main className="relative flex min-h-dvh w-full flex-col bg-surface-soft font-sans text-foreground">
        <ScreenHeader title="Modul Edukasi" subtitle="Materi belum tersedia" />
        <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-12 text-center">
          <h2 className="font-heading text-xl font-bold text-foreground">
            Modul ini belum ditemukan
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Silakan kembali ke daftar modul untuk membuka Bab 01 sampai Bab 16 yang tersedia.
          </p>
          <Link
            href="/modules"
            className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-primary px-6 font-heading text-sm font-bold text-primary-foreground hover:bg-primary-dark"
          >
            Kembali ke Daftar Modul
          </Link>
        </section>
      </main>
    );
  }

  const toggleSectionDone = (sectionId: string) => {
    const alreadyDone = completedSections.includes(sectionId);
    const nextSections = alreadyDone
      ? completedSections.filter((id) => id !== sectionId)
      : [...completedSections, sectionId];

    setCompletedSections(nextSections);
    if (!alreadyDone) {
      awardPetReward(10, 5);
    }

    try {
      const rawSec = window.localStorage.getItem(DONE_SECTIONS_KEY);
      const map = rawSec
        ? (JSON.parse(rawSec) as Record<string, string[]>)
        : {};
      map[moduleId] = nextSections;
      window.localStorage.setItem(DONE_SECTIONS_KEY, JSON.stringify(map));

      if (nextSections.length === moduleData.sections.length && !moduleFinished) {
        const prevMods = loadCompletedModuleIds();
        const nextMods = Array.from(new Set([...prevMods, moduleId]));
        window.localStorage.setItem(DONE_MODULES_KEY, JSON.stringify(nextMods));
        setModuleFinished(true);
      }
    } catch {
      // Ignore storage write errors
    }
  };

  const finishModule = () => {
    const allIds = moduleData.sections.map((s) => s.id);
    setCompletedSections(allIds);
    if (!moduleFinished) {
      awardPetReward(20, 15);
      setModuleFinished(true);
    }
    try {
      const rawSec = window.localStorage.getItem(DONE_SECTIONS_KEY);
      const map = rawSec
        ? (JSON.parse(rawSec) as Record<string, string[]>)
        : {};
      map[moduleId] = allIds;
      window.localStorage.setItem(DONE_SECTIONS_KEY, JSON.stringify(map));

      const prevMods = loadCompletedModuleIds();
      const nextMods = Array.from(new Set([...prevMods, moduleId]));
      window.localStorage.setItem(DONE_MODULES_KEY, JSON.stringify(nextMods));
    } catch {
      // Ignore storage write errors
    }
  };

  return (
    <div className="relative flex min-h-dvh w-full flex-col bg-surface-soft font-sans text-foreground">
      <ScreenHeader
        title={`Bab ${moduleData.number}: ${moduleData.title}`}
        subtitle={`${moduleData.readMinutes} menit baca · ${completedSections.length}/${moduleData.sections.length} bagian selesai`}
        rightAction={
          <Link
            href="/modules"
            className="hidden min-h-[40px] items-center rounded-xl border border-border bg-card px-3 text-xs font-semibold text-foreground hover:bg-muted sm:inline-flex"
          >
            Semua Bab
          </Link>
        }
      />

      {/* Sticky Reading Progress Bar */}
      <div className="sticky top-[68px] z-20 h-1 w-full bg-muted md:top-[76px]">
        <div
          className="h-full bg-brand-orange transition-[width] duration-150"
          style={{ width: `${readProgressPct}%` }}
        />
      </div>

      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 pb-16 pt-6 sm:px-6 md:pt-8">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[240px_minmax(0,68ch)] lg:justify-center xl:grid-cols-[230px_minmax(0,68ch)_190px]">
          {/* Desktop Sticky Chapter Outline (stays pinned on scroll now that root uses overflow-x-clip) */}
          <aside className="hidden lg:sticky lg:top-24 lg:block">
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-xs font-bold text-brand-orange-ink">
                Daftar Bagian · Modul {moduleData.number}
              </p>
              <nav aria-label="Daftar isi modul" className="mt-3 space-y-1">
                {moduleData.sections.map((sec, idx) => {
                  const done = completedSections.includes(sec.id);
                  return (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      className="flex min-h-[40px] items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-xs font-medium text-muted-foreground transition hover:bg-surface-soft hover:text-foreground"
                    >
                      <span className="line-clamp-2 leading-snug">
                        {idx + 1}. {sec.title}
                      </span>
                      {done && (
                        <Check
                          className="h-3.5 w-3.5 shrink-0 text-primary"
                          aria-hidden="true"
                        />
                      )}
                    </a>
                  );
                })}
              </nav>

              <div className="mt-4 border-t border-border pt-4 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Progres bab</span>
                  <span className="font-bold text-primary">
                    {completedSections.length}/{moduleData.sections.length}
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{
                      width: `${Math.round(
                        (completedSections.length / moduleData.sections.length) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Editorial Centered 68ch Reading Sheet */}
          <article className="mx-auto w-full max-w-[68ch] rounded-3xl border border-border bg-card px-5 py-7 shadow-xs sm:px-10 sm:py-10">
            {/* Chapter Header */}
            <header className="border-b border-border pb-6">
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                <span className="text-brand-orange-ink">
                  BAB {String(moduleData.number).padStart(2, "0")}
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="rounded-lg bg-primary-light px-2.5 py-0.5 text-[11px] font-bold text-primary">
                  Fase {moduleData.phase}: {moduleData.approachTag}
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  {moduleData.readMinutes} menit baca
                </span>
              </div>

              <h1 className="mt-2.5 font-heading text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-[30px]">
                {moduleData.title}
              </h1>

              <p className="mt-3 text-base leading-[1.7] text-muted-foreground sm:text-[17px]">
                {moduleData.summary}
              </p>

              <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-border/80 bg-surface-soft/70 px-4 py-3 text-xs leading-relaxed text-foreground/90">
                <Target className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <span className="font-bold text-foreground">Tujuan belajar: </span>
                  <span>{moduleData.learningObjective}</span>
                </div>
              </div>

              {/* Mobile Quick Section Jumper */}
              <div className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:hidden">
                {moduleData.sections.map((sec, idx) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="shrink-0 rounded-lg bg-surface-soft px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-primary-light hover:text-primary"
                  >
                    {idx + 1}. {sec.title}
                  </a>
                ))}
              </div>
            </header>

            {/* Sections */}
            <div className="divide-y divide-border/80">
              {moduleData.sections.map((section) => {
                const isDone = completedSections.includes(section.id);

                return (
                  <section
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-24 py-7 first:pt-6"
                  >
                    <p className="text-xs font-semibold text-primary">
                      {section.eyebrow}
                    </p>
                    <h2 className="mt-1 font-heading text-xl font-bold leading-snug text-foreground sm:text-[22px]">
                      {section.title}
                    </h2>

                    <div className="mt-4 space-y-4">
                      {section.paragraphs.map((para, pIdx) => (
                        <p
                          key={pIdx}
                          className="text-[16px] leading-[1.75] text-foreground/90 sm:text-[17px]"
                        >
                          {para}
                        </p>
                      ))}
                    </div>

                    {section.bullets && (
                      <ul className="mt-5 space-y-3 rounded-2xl bg-surface-soft p-5">
                        {section.bullets.map((b) => (
                          <li
                            key={b.lead}
                            className="flex items-start gap-3 text-[15.5px] leading-[1.68] text-foreground/90"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-primary"
                            />
                            <span>
                              <strong className="font-semibold text-foreground">
                                {b.lead}
                              </strong>{" "}
                              {b.detail}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.callout && (
                      <blockquote
                        className={`mt-5 rounded-r-2xl border-l-4 px-5 py-4 ${
                          section.callout.tone === "orange"
                            ? "border-[#FF8200] bg-[#FFF6EB] dark:bg-orange-950/30"
                            : "border-primary bg-primary-light/70"
                        }`}
                      >
                        <p
                          className={`text-xs font-bold ${
                            section.callout.tone === "orange"
                              ? "text-brand-orange-ink"
                              : "text-primary"
                          }`}
                        >
                          {section.callout.label}
                        </p>
                        <p className="mt-1 text-[15.5px] font-medium leading-[1.7] text-foreground">
                          {section.callout.text}
                        </p>
                      </blockquote>
                    )}

                    {section.evidence && (
                      <div className="mt-5 rounded-2xl border border-border/80 bg-muted/40 px-4 py-3.5 text-xs leading-relaxed">
                        <div className="flex items-center gap-1.5 font-bold text-foreground">
                          <FlaskConical
                            className="h-3.5 w-3.5 shrink-0 text-primary"
                            aria-hidden="true"
                          />
                          <span>Rujukan Ilmiah · {section.evidence.study}</span>
                        </div>
                        <p className="mt-1 text-muted-foreground">
                          {section.evidence.finding}
                        </p>
                      </div>
                    )}

                    <div className="mt-6 flex flex-col justify-between gap-3 rounded-2xl border border-border bg-surface-soft/70 p-4 sm:flex-row sm:items-center">
                      <div className="min-w-0">
                        <span className="block text-xs font-semibold text-muted-foreground">
                          Langkah Kecil
                        </span>
                        <p className="mt-0.5 text-sm font-medium text-foreground">
                          {section.actionPrompt}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleSectionDone(section.id)}
                        aria-pressed={isDone}
                        className={`inline-flex min-h-[42px] shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-4 font-heading text-xs font-bold transition ${
                          isDone
                            ? "bg-primary text-primary-foreground"
                            : "border border-border bg-card text-foreground hover:border-primary/50 hover:text-primary"
                        }`}
                      >
                        <Check className="h-4 w-4" aria-hidden="true" />
                        <span>{isDone ? "Sudah Paham" : "Tandai Paham"}</span>
                      </button>
                    </div>
                  </section>
                );
              })}
            </div>

            {/* Optional Connected Feature Card */}
            {moduleData.practiceLink && (
              <section className="mt-6 rounded-2xl border border-primary/25 bg-primary-light/50 p-5">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div className="min-w-0">
                    <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                      <Compass className="h-3.5 w-3.5" aria-hidden="true" />
                      Praktik Opsional Terhubung
                    </p>
                    <h3 className="mt-1 font-heading text-sm font-bold text-foreground">
                      {moduleData.practiceLink.label}
                    </h3>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      {moduleData.practiceLink.description}
                    </p>
                  </div>
                  <Link
                    href={moduleData.practiceLink.href}
                    className="inline-flex min-h-[42px] shrink-0 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 font-heading text-xs font-bold text-primary-foreground transition hover:bg-primary-dark"
                  >
                    <span>Buka Fitur</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </section>
            )}

            {/* Scientific Evidence, Limitations & References */}
            <section className="mt-5 rounded-2xl border border-border bg-surface-soft/60 p-5 text-xs leading-relaxed">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-heading text-sm font-bold text-foreground">
                  Sumber Ilmiah &amp; Batasan Bukti
                </p>
                <span className="rounded-lg bg-card px-2.5 py-1 text-[11px] font-semibold text-primary ring-1 ring-border">
                  {moduleData.evidenceStrength}
                </span>
              </div>

              <div className="mt-3 flex items-start gap-2 rounded-xl bg-card px-3.5 py-2.5 text-muted-foreground ring-1 ring-border/70">
                <ShieldAlert
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange-ink"
                  aria-hidden="true"
                />
                <p>
                  <strong className="text-foreground">Batasan: </strong>
                  {moduleData.evidenceLimitation}
                </p>
              </div>

              <ul className="mt-3 space-y-2">
                {moduleData.references.map((ref) => (
                  <li
                    key={ref.url + ref.citation}
                    className="rounded-xl bg-card px-3.5 py-2.5 ring-1 ring-border/70"
                  >
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                    >
                      <span>{ref.citation}</span>
                      <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                    </a>
                    <p className="mt-0.5 text-muted-foreground">{ref.note}</p>
                  </li>
                ))}
              </ul>

              <p className="mt-3 text-[11px] text-muted-foreground">
                Catatan: Materi ini adalah konten edukasi swabantu berbasis prinsip CBT dan ACT, bukan layanan terapi klinis atau pengganti evaluasi psikolog/dokter.
              </p>
            </section>

            {/* Balanced, non-wrapping Chapter Completion Footer */}
            <footer className="mt-4 space-y-3 border-t border-border pt-7">
              <button
                type="button"
                onClick={finishModule}
                className={`flex min-h-[48px] w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl px-5 font-heading text-sm font-bold transition ${
                  moduleFinished
                    ? "bg-primary-light text-primary"
                    : "bg-primary text-primary-foreground hover:bg-primary-dark"
                }`}
              >
                <BookOpen className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>
                  {moduleFinished
                    ? "Bab Ini Sudah Selesai"
                    : "Tandai Bab Selesai (+20 XP, +15 Koin)"}
                </span>
              </button>

              <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  href="/modules"
                  className="inline-flex min-h-[44px] items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-border bg-card px-4 font-heading text-xs font-bold text-foreground hover:bg-muted sm:text-sm"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  <span>Kembali ke Daftar Modul</span>
                </Link>

                {moduleData.nextModuleId ? (
                  <Link
                    href={`/modules/${moduleData.nextModuleId}`}
                    className="inline-flex min-h-[44px] items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-[#FF8200] px-5 font-heading text-xs font-bold text-white transition hover:brightness-95 sm:text-sm"
                  >
                    <span>Lanjut ke Bab {moduleData.nextModuleId}</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                ) : (
                  <Link
                    href="/exercises/breathing"
                    className="inline-flex min-h-[44px] items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-[#FF8200] px-5 font-heading text-xs font-bold text-white transition hover:brightness-95 sm:text-sm"
                  >
                    <span>Praktikkan Latihan Napas</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                )}
              </div>
            </footer>
          </article>

          {/* Right symmetrical spacer/progress cue on xl screens so article stays dead-center */}
          <aside className="hidden xl:sticky xl:top-24 xl:block">
            <div className="rounded-2xl border border-border/70 bg-card/80 p-4 text-xs text-muted-foreground">
              <p className="font-heading font-bold text-foreground">
                Bacaan Tenang
              </p>
              <p className="mt-1 leading-relaxed">
                Baca pelan per bagian dan centang Langkah Kecil saat sudah siap menerapkannya hari ini.
              </p>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3 font-semibold">
                <span>Posisi baca</span>
                <span className="text-brand-orange-ink">{readProgressPct}%</span>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
