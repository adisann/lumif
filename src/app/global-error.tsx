"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function GlobalErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Lumif global error boundary caught:", error);
  }, [error]);

  return (
    <html lang="id">
      <body className="flex min-h-svh w-full items-center justify-center bg-[#F8FAF9] px-6 py-10 font-sans text-[#0F172A]">
        <div className="w-full max-w-md rounded-3xl border border-[#E2E8F0] bg-white p-7 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600">
            <AlertCircle className="h-7 w-7" aria-hidden="true" />
          </div>

          <h1 className="text-xl font-bold">Aplikasi Perlu Dimuat Ulang</h1>
          <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
            Terjadi gangguan sistem yang tidak terduga. Klik tombol di bawah untuk memulihkan sesi tanpa kehilangan catatan lokalmu.
          </p>

          <button
            type="button"
            onClick={() => reset()}
            className="mt-6 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#257B5A] px-4 text-sm font-bold text-white transition hover:bg-[#1D6348]"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span>Muat Ulang Aplikasi</span>
          </button>
        </div>
      </body>
    </html>
  );
}
