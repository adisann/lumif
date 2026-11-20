"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LumifLogo from "@/components/LumifLogo";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router.push("/onboarding");
    }, 2200);

    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <main className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-background px-6">
      <button
        type="button"
        onClick={() => router.push("/onboarding")}
        className="flex flex-col items-center gap-4 rounded-3xl p-6 transition hover:bg-muted/40"
        aria-label="Masuk ke halaman pengenalan Lumif"
      >
        <div className="animate-fadeIn">
          <LumifLogo size="xl" priority />
        </div>
        <span className="text-xs font-semibold text-brand-orange-ink">
          Ketuk untuk melanjutkan
        </span>
      </button>
    </main>
  );
}
