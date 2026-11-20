"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import LumifLogo from "@/components/LumifLogo";
import {
  Home,
  PieChart,
  Users,
  Settings,
  Zap,
  MessageCircle,
  Heart,
  X,
  ChevronRight,
  BookOpen,
  ClipboardList,
  Grid,
  AlertCircle,
  PanelLeftClose,
  PanelLeftOpen,
  PawPrint,
  Gamepad2,
  PenLine,
  Shield,
} from "lucide-react";
import UrgeCheckInModal from "@/components/UrgeCheckInModal";
import EmergencyFlow from "@/components/EmergencyFlow";

const QUICK_ACTIONS = [
  {
    title: "Lair Pendamping",
    desc: "Rawat & cek level pet",
    icon: PawPrint,
    href: "/lair",
  },
  {
    title: "Curhat ke Komunitas",
    desc: "Mengobrol sesama pejuang",
    icon: MessageCircle,
    href: "/community",
  },
  {
    title: "Permainan Tenang",
    desc: "10 aktivitas alihkan fokus",
    icon: Gamepad2,
    href: "/games",
  },
  {
    title: "Catat Hasrat",
    desc: "Rekam intensitas godaan",
    icon: PenLine,
    action: "urge-checkin" as const,
  },
  {
    title: "Focus Guard",
    desc: "Filter situs & pencarian pemicu",
    icon: Shield,
    href: "/focus-guard",
  },
  {
    title: "Latihan Napas",
    desc: "Ambil 2 menit relaksasi",
    icon: Heart,
    href: "/exercises/breathing",
  },
  {
    title: "Modul Edukasi",
    desc: "Belajar tentang pemulihan",
    icon: BookOpen,
    href: "/modules",
  },
  {
    title: "Rutinitas Harian",
    desc: "Checklist pemulihanmu",
    icon: ClipboardList,
    href: "/routines",
  },
];

const SIDEBAR_GROUPS = [
  {
    label: "Utama",
    items: [
      { path: "/home", icon: Home, label: "Beranda" },
      { path: "/insight", icon: PieChart, label: "Insight" },
      { path: "/community", icon: Users, label: "Komunitas" },
    ],
  },
  {
    label: "Alat Pemulihan",
    items: [
      { path: "/games", icon: Gamepad2, label: "Permainan" },
      { path: "/lair", icon: PawPrint, label: "Lair Pet" },
      { path: "/modules", icon: BookOpen, label: "Modul CBT/ACT" },
      { path: "/routines", icon: ClipboardList, label: "Rutinitas" },
      { path: "/focus-guard", icon: Shield, label: "Focus Guard" },
      { path: "/urge-log", icon: PenLine, label: "Catat Hasrat" },
      { path: "/more", icon: Grid, label: "Menu Lengkap" },
    ],
  },
  {
    label: "Akun",
    items: [{ path: "/profile", icon: Settings, label: "Setelan" }],
  },
];

const MOBILE_NAV_ITEMS = [
  { path: "/home", icon: Home, label: "Beranda" },
  { path: "/insight", icon: PieChart, label: "Insight" },
  { path: "__bolt__", icon: Zap, label: "Aksi", isBolt: true },
  { path: "/community", icon: Users, label: "Komunitas" },
  { path: "/profile", icon: Settings, label: "Setelan" },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);
  const [showUrgeCheckIn, setShowUrgeCheckIn] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--lumif-sidebar-width",
      isCollapsed ? "84px" : "248px"
    );
  }, [isCollapsed]);

  useEffect(() => {
    if (!showModal) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowModal(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showModal]);

  return (
    <>
      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-end md:justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quick-actions-title"
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs animate-fadeIn"
            onClick={() => setShowModal(false)}
          />

          <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-4 px-5 pb-8 animate-slideUp md:pb-0">
            <div className="flex w-full flex-col gap-3 rounded-3xl border border-border bg-card px-5 py-6 shadow-2xl">
              <div className="flex items-center justify-between px-2 pb-1">
                <h3
                  id="quick-actions-title"
                  className="font-heading text-lg font-bold text-foreground"
                >
                  Aksi Cepat
                </h3>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="hidden h-9 w-9 items-center justify-center rounded-xl border border-border text-foreground transition hover:bg-muted md:flex"
                  aria-label="Tutup aksi cepat"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.title}
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    if (action.action === "urge-checkin") {
                      setShowUrgeCheckIn(true);
                      return;
                    }
                    if (action.href) {
                      router.push(action.href);
                    }
                  }}
                  className="group flex min-h-[56px] w-full items-center justify-between rounded-2xl p-2.5 transition-colors hover:bg-muted/70"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
                      <action.icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="text-left">
                      <p className="font-heading text-sm font-bold leading-snug text-foreground">
                        {action.title}
                      </p>
                      <p className="text-xs leading-snug text-muted-foreground">
                        {action.desc}
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
                    aria-hidden="true"
                  />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex h-13 w-13 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-xl transition-transform active:scale-90 md:hidden"
              aria-label="Tutup aksi cepat"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* Tablet & Desktop Persistent Sidebar */}
      <aside
        aria-label="Navigasi utama"
        className={`fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 md:flex ${
          isCollapsed ? "w-[84px]" : "w-[84px] lg:w-[248px]"
        }`}
      >
        <div
          className={`flex items-center border-b border-sidebar-border transition-all ${
            isCollapsed
              ? "flex-col justify-center gap-2.5 px-3 py-3.5"
              : "justify-center px-3 py-4 lg:justify-between lg:gap-2 lg:px-4"
          }`}
        >
          <Link
            href="/home"
            className="flex min-w-0 items-center gap-3 rounded-xl p-1"
            aria-label="Beranda Lumif"
          >
            <LumifLogo variant="mark" size={isCollapsed ? "xs" : "sm"} />
            {!isCollapsed && (
              <div className="hidden min-w-0 lg:block">
                <span className="block font-heading text-base font-bold tracking-tight text-sidebar-foreground">
                  Lumif
                </span>
                <span className="block truncate text-[11px] font-medium text-brand-orange-ink">
                  Pemulihan Mandiri
                </span>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            aria-expanded={!isCollapsed}
            aria-label={isCollapsed ? "Perluas bilah sisi" : "Ciutkan bilah sisi"}
            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-sidebar-border bg-card text-sidebar-foreground transition hover:bg-muted lg:flex"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" aria-hidden="true" />
            ) : (
              <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
          {SIDEBAR_GROUPS.map((group) => (
            <div key={group.label}>
              {!isCollapsed && (
                <p className="mb-1.5 hidden px-3 text-[11px] font-semibold text-muted-foreground lg:block">
                  {group.label}
                </p>
              )}

              <ul className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname.startsWith(item.path);
                  return (
                    <li key={item.path}>
                      <Link
                        href={item.path}
                        aria-current={isActive ? "page" : undefined}
                        aria-label={item.label}
                        className={`flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors ${
                          isActive
                            ? "border-l-4 border-primary bg-primary-light font-semibold text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        } ${isCollapsed ? "justify-center px-2" : "justify-center lg:justify-start"}`}
                      >
                        <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                        {!isCollapsed && (
                          <span className="hidden truncate lg:inline">
                            {item.label}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="space-y-2 border-t border-sidebar-border p-3">
          <button
            type="button"
            onClick={() => setShowModal(true)}
            aria-label="Aksi Cepat"
            className={`flex min-h-[44px] w-full items-center gap-2.5 rounded-xl bg-accent-gold px-3 py-2.5 font-heading text-sm font-bold text-[#0F172A] shadow-xs transition hover:brightness-95 ${
              isCollapsed ? "justify-center px-2" : "justify-center lg:justify-start"
            }`}
          >
            <Zap className="h-4 w-4 shrink-0 fill-current" aria-hidden="true" />
            {!isCollapsed && (
              <span className="hidden truncate lg:inline">Aksi Cepat</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowEmergency(true)}
            aria-label="Butuh Bantuan Darurat"
            className={`flex min-h-[44px] w-full items-center gap-2.5 rounded-xl bg-[#D82C1C] px-3 py-2.5 font-heading text-sm font-bold text-white shadow-xs transition hover:bg-[#B92214] ${
              isCollapsed ? "justify-center px-2" : "justify-center lg:justify-start"
            }`}
          >
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            {!isCollapsed && (
              <span className="hidden truncate lg:inline">Butuh Bantuan</span>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Navigasi seluler"
        className="fixed bottom-0 left-0 z-50 w-full border-t border-border bg-card/95 px-4 pb-[calc(14px+env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-md md:hidden"
      >
        <div className="mx-auto flex max-w-md items-center justify-between">
          {MOBILE_NAV_ITEMS.map((item) => {
            const Icon = item.icon;

            if (item.isBolt) {
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => setShowModal(true)}
                  aria-label="Buka aksi cepat"
                  className="relative -mt-8 flex min-h-[44px] min-w-[44px] items-center justify-center"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-card bg-[#EDBF45] shadow-md transition-transform hover:scale-105 active:scale-95">
                    <Icon
                      className="h-6 w-6 fill-current text-[#0F172A]"
                      aria-hidden="true"
                    />
                  </div>
                </button>
              );
            }

            const isActive = pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                aria-current={isActive ? "page" : undefined}
                className={`flex min-h-[44px] min-w-[56px] flex-col items-center justify-center gap-1 rounded-xl px-1.5 transition-colors ${
                  isActive
                    ? "font-bold text-primary"
                    : "font-medium text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span className="text-[11px] leading-none">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <UrgeCheckInModal
        isOpen={showUrgeCheckIn}
        onClose={() => setShowUrgeCheckIn(false)}
        onEmergency={() => setShowEmergency(true)}
      />
      <EmergencyFlow
        isOpen={showEmergency}
        onClose={() => setShowEmergency(false)}
      />
    </>
  );
}
