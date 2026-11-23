"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, Home, RotateCcw } from "lucide-react";

export default function AppErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Lumif route error boundary caught:", error);
  }, [error]);

  return (
    <main className="flex min-h-svh w-full items-center justify-center bg-surface-soft px-6 py-10 font-sans text-foreground">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-7 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/15 text-destructive">
          <AlertCircle className="h-7 w-7" aria-hidden="true" />
        </div>

        <h1 className="font-heading text-xl font-bold text-card-foreground">
          Ada Kendala Sementara
        </h1>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
          Halaman mengalami gangguan tak terduga, tetapi data lokalmu tetap aman. Kamu bisa mencoba memuat ulang bagian ini atau kembali ke beranda.
        </p>

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 font-heading text-xs font-bold text-primary-foreground transition hover:bg-primary-dark"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span>Coba Lagi</span>
          </button>

          <Link
            href="/home"
            className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 font-heading text-xs font-bold text-foreground transition hover:bg-muted"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            <span>Ke Beranda</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
