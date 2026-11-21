"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import LumifLogo from "@/components/LumifLogo";
import { createClient } from "@/lib/supabase/client";

export default function SplashScreen() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [isLeaving, setIsLeaving] = useState(false);
  const targetRouteRef = useRef<string>("/onboarding");
  const navigatedRef = useRef(false);

  const navigateNext = useCallback(() => {
    if (navigatedRef.current) return;
    navigatedRef.current = true;
    setIsLeaving(true);
    window.setTimeout(() => {
      router.replace(targetRouteRef.current);
    }, 260);
  }, [router]);

  useEffect(() => {
    let active = true;

    const resolveDestination = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!active) return;
        if (user) {
          targetRouteRef.current = "/home";
          return;
        }
      } catch {
        // Fallback to local demo check or onboarding
      }

      if (typeof window !== "undefined") {
        const demoUser = window.localStorage.getItem("lumif_demo_user");
        if (demoUser) {
          targetRouteRef.current = "/home";
        }
      }
    };

    void resolveDestination();

    const timer = window.setTimeout(() => {
      navigateNext();
    }, 1850);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [navigateNext, supabase]);

  return (
    <main
      onClick={navigateNext}
      className={`relative flex min-h-dvh w-full cursor-pointer items-center justify-center overflow-hidden bg-background px-6 transition-opacity duration-300 ${
        isLeaving ? "opacity-0" : "opacity-100"
      }`}
      aria-label="Memuat Lumif"
    >
      <div className="relative flex flex-col items-center justify-center gap-5">
        {/* Soft sunrise halo behind logo */}
        <span
          aria-hidden="true"
          className="animate-splash-halo pointer-events-none absolute -top-3 h-40 w-40 rounded-full bg-gradient-to-tr from-[#2D936C]/15 via-[#EDBF45]/25 to-[#FF8200]/15 blur-2xl"
        />

        <div className="animate-splash-logo relative z-10">
          <LumifLogo size="xl" priority />
        </div>

        {/* Minimal hairline loading bar */}
        <div
          aria-hidden="true"
          className="relative z-10 h-0.5 w-24 overflow-hidden rounded-full bg-border"
        >
          <span className="animate-splash-bar block h-full w-full rounded-full bg-gradient-to-r from-[#2D936C] via-[#EDBF45] to-[#FF8200]" />
        </div>
      </div>
    </main>
  );
}
