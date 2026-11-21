"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import ScreenHeader from "@/components/ScreenHeader";
import {
  BookOpen,
  BrainCircuit,
  CheckSquare,
  ChevronRight,
  Compass,
  Gamepad2,
  Heart,
  MessageCircle,
  PawPrint,
  PieChart,
  Search,
  Settings,
  Shield,
  Sun,
  Wind,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";

type QuickCondition = {
  situation: string;
  title: string;
  meta: string;
  href: string;
  icon: LucideIcon;
  accentClass: string;
};

type DirectoryItem = {
  title: string;
  description: string;
  meta: string;
  href: string;
  icon: LucideIcon;
  keywords: string;
};

type DirectorySection = {
  title: string;
  subtitle: string;
  items: DirectoryItem[];
};

const QUICK_CONDITIONS: QuickCondition[] = [
  {
    situation: "Jantung berdebar atau tegang",
    title: "Latihan Napas 3D",
    meta: "2 menit · Ikuti ritme pet",
    href: "/exercises/breathing",
    icon: Wind,
    accentClass: "bg-primary-light text-primary",
  },
  {
    situation: "Hasrat atau pemicu muncul",
    title: "Catat Hasrat & Pemicu",
    meta: "HALT & intensitas",
    href: "/urge-log",
    icon: Zap,
    accentClass: "bg-surface-soft text-primary",
  },
  {
    situation: "Bosan atau butuh pengalih fokus",
    title: "Permainan & Kuis Visual",
    meta: "Mini game & trivia",
    href: "/games",
    icon: Gamepad2,
    accentClass: "bg-primary-light text-primary",
  },
];

const DIRECTORY_SECTIONS: DirectorySection[] = [
  {
    title: "Kesadaran & Pelacakan Diri",
    subtitle: "Pahami pola pikiran, jam rawan, dan perkembanganmu",
    items: [
      {
        title: "Insight & Grafik Tren",
        description: "Lihat progres hari bersih, energi pulih, dan pemicu utama.",
        meta: "Analitik",
        href: "/insight",
        icon: PieChart,
        keywords: "insight grafik statistik pemicu progres tren",
      },
      {
        title: "Catat Hasrat & Trigger",
        description: "Rekam dorongan, intensitas, dan kondisi HALT saat terjadi.",
        meta: "Jurnal cepat",
        href: "/urge-log",
        icon: Zap,
        keywords: "catat hasrat urge log trigger pemicu halt",
      },
      {
        title: "Kuis Refleksi Diri",
        description: "Evaluasi singkat mengenali kebiasaan dan respons terbaikmu.",
        meta: "3 menit",
        href: "/quiz",
        icon: BrainCircuit,
        keywords: "kuis refleksi evaluasi diri tes",
      },
    ],
  },
  {
    title: "Tenangkan Pikiran & Tubuh",
    subtitle: "Latihan napas, meditasi singkat, dan pengalihan fokus",
    items: [
      {
        title: "Latihan Napas",
        description: "Panduan tarik dan hembus napas bersama pendamping 3D.",
        meta: "2 menit",
        href: "/exercises/breathing",
        icon: Heart,
        keywords: "napas pernapasan panik cemas tenang pet 3d",
      },
      {
        title: "Meditasi Terpandu",
        description: "Sesi fokus hening singkat selama 1 hingga 5 menit.",
        meta: "3 menit",
        href: "/meditation",
        icon: Sun,
        keywords: "meditasi afirmasi tenang rileks",
      },
      {
        title: "Permainan & Kuis",
        description: "Mini game relaksasi dan kuis trivia visual dengan tempo santai.",
        meta: "14 aktivitas",
        href: "/games",
        icon: Gamepad2,
        keywords: "game permainan ombak zen fokus kabut trivia kuis",
      },
    ],
  },
  {
    title: "Edukasi & Kebiasaan Harian",
    subtitle: "Materi berbasis prinsip CBT, ACT, dan kebiasaan harian",
    items: [
      {
        title: "Modul CBT & ACT",
        description: "16 bab belajar dalam 4 fase dengan rujukan riset dan langkah praktis.",
        meta: "16 bab",
        href: "/modules",
        icon: BookOpen,
        keywords: "modul edukasi cbt act halt dopamin urge surfing grounding",
      },
      {
        title: "Rutinitas Harian",
        description: "Checklist kebiasaan & papan status kanban harian.",
        meta: "Daftar & Papan",
        href: "/routines",
        icon: CheckSquare,
        keywords: "rutinitas harian todo trello kanban checklist kebiasaan",
      },
      {
        title: "Lumif Focus Guard",
        description: "Extension proteksi domain, kata kunci pencarian, & jeda sadar.",
        meta: "Extension",
        href: "/focus-guard",
        icon: Shield,
        keywords: "focus guard blokir extension brave firefox chrome keyword domain",
      },
      {
        title: "Latih Ketahanan Fokus",
        description: "Tantangan fokus singkat untuk menjaga perhatian tetap stabil.",
        meta: "Fokus",
        href: "/focus-game",
        icon: Compass,
        keywords: "fokus game konsentrasi perhatian",
      },
    ],
  },
  {
    title: "Pendamping, Komunitas & Akun",
    subtitle: "Dukungan sosial, rawat pet, dan pengaturan personal",
    items: [
      {
        title: "Lair Pendamping",
        description: "Rawat pet, pantau XP, koin, dan evolusi pendamping 3D.",
        meta: "Pet 3D",
        href: "/lair",
        icon: PawPrint,
        keywords: "lair pet peliharaan 3d xp koin evolusi",
      },
      {
        title: "Komunitas",
        description: "Berbagi cerita dan saling mendukung dengan pengguna lain.",
        meta: "Komunitas",
        href: "/community",
        icon: MessageCircle,
        keywords: "komunitas curhat cerita dukungan sosial teman",
      },
      {
        title: "Profil & Setelan",
        description: "Atur target hari bersih, tampilan tema, dan preferensi akun.",
        meta: "Akun",
        href: "/profile",
        icon: Settings,
        keywords: "profil setelan target tema akun keluar",
      },
    ],
  },
];

export default function MoreMenuPage() {
  const [query, setQuery] = useState("");

  const filteredSections = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DIRECTORY_SECTIONS;

    return DIRECTORY_SECTIONS.map((section) => ({
      ...section,
      items: section.items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.keywords.includes(q)
      ),
    })).filter((section) => section.items.length > 0);
  }, [query]);

  return (
    <div className="lumif-with-nav relative flex min-h-dvh flex-col bg-surface-soft font-sans text-foreground">
      <ScreenHeader
        title="Menu Lengkap"
        subtitle="Semua fitur, alat pemulihan, dan pengaturan Lumif dalam satu direktori"
      />

      <main className="flex-1 px-4 pb-[calc(110px+env(safe-area-inset-bottom))] pt-5 md:px-8 md:pb-10">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
          {/* Quick Filter + Situational Strip */}
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-xs sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-heading text-sm font-bold text-foreground sm:text-base">
                  Akses Cepat Berdasarkan Kondisi
                </h2>
                <p className="text-xs text-muted-foreground">
                  Pilih langkah terdekat atau cari alat spesifik di Lumif.
                </p>
              </div>

              <label className="relative flex w-full items-center sm:max-w-xs">
                <Search
                  className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari fitur (mis. napas, HALT, pet)..."
                  aria-label="Cari fitur Lumif"
                  className="h-10 w-full rounded-xl border border-input bg-surface-soft pl-9 pr-9 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Hapus pencarian"
                    className="absolute right-2 flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                )}
              </label>
            </div>

            {!query && (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {QUICK_CONDITIONS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group flex items-center gap-3 rounded-xl border border-border bg-surface-soft/70 px-3.5 py-3 transition hover:border-primary/50 hover:bg-card"
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.accentClass}`}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[11px] font-medium text-muted-foreground">
                          {item.situation}
                        </p>
                        <p className="truncate font-heading text-sm font-bold text-foreground group-hover:text-primary">
                          {item.title}
                        </p>
                        <p className="truncate text-[11px] text-muted-foreground">
                          {item.meta}
                        </p>
                      </div>
                      <ChevronRight
                        className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                        aria-hidden="true"
                      />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Balanced 2x2 Category Directory */}
          {filteredSections.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center">
              <p className="font-heading text-base font-bold text-foreground">
                Fitur tidak ditemukan
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Tidak ada fitur yang cocok dengan kata kunci tersebut.
              </p>
              <button
                type="button"
                onClick={() => setQuery("")}
                className="mt-4 inline-flex min-h-[40px] items-center justify-center rounded-xl bg-primary px-4 font-heading text-xs font-bold text-primary-foreground hover:bg-primary-dark"
              >
                Tampilkan Semua Menu
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {filteredSections.map((section) => (
                <section
                  key={section.title}
                  className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs"
                >
                  <div className="border-b border-border/80 bg-surface-soft/50 px-5 py-4">
                    <h2 className="font-heading text-base font-bold tracking-tight text-foreground">
                      {section.title}
                    </h2>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {section.subtitle}
                    </p>
                  </div>

                  <div className="divide-y divide-border/70">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href + item.title}
                          href={item.href}
                          className="group flex min-h-[72px] items-center gap-3.5 px-5 py-3.5 transition hover:bg-surface-soft/60"
                        >
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                            <Icon className="h-5 w-5" aria-hidden="true" />
                          </span>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="truncate font-heading text-sm font-bold text-card-foreground group-hover:text-primary">
                                {item.title}
                              </h3>
                              <span className="shrink-0 rounded-md bg-surface-soft px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                                {item.meta}
                              </span>
                            </div>
                            <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                              {item.description}
                            </p>
                          </div>

                          <ChevronRight
                            className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                            aria-hidden="true"
                          />
                        </Link>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
