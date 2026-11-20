"use client";

import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import ScreenHeader from "@/components/ScreenHeader";
import { Play, Pause, CheckCircle2 } from "lucide-react";

const AFFIRMATIONS = [
  "Dorongan ini hanyalah gelombang sementara. Ia akan naik dan akan turun.",
  "Kamu tidak harus menuruti setiap pikiran yang muncul.",
  "Rasakan napasmu mengalir bebas dan lembut.",
  "Setiap detik kamu bertahan, otakmu sedang memulihkan kendali dirinya.",
  "Kamu aman di sini, sekarang, di saat ini.",
];

export default function MeditationPage() {
  const [selectedDuration, setSelectedDuration] = useState(180);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isRunning, setIsRunning] = useState(false);
  const [affirmationIndex, setAffirmationIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setIsCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = window.setInterval(() => {
      setAffirmationIndex((prev) => (prev + 1) % AFFIRMATIONS.length);
    }, 8000);

    return () => window.clearInterval(interval);
  }, [isRunning]);

  const selectDuration = (seconds: number) => {
    setSelectedDuration(seconds);
    setTimeLeft(seconds);
    setIsRunning(false);
    setIsCompleted(false);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  return (
    <div className="lumif-with-nav relative flex min-h-dvh flex-col bg-surface-soft font-sans text-foreground">
      <ScreenHeader
        title="Meditasi Terpandu"
        subtitle="Afirmasi & ketenangan pikiran"
      />

      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-[calc(110px+env(safe-area-inset-bottom))] pt-6 text-center md:pb-12">
        <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-xs md:p-10">
          {isCompleted ? (
            <div className="flex flex-col items-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-primary">
                <CheckCircle2 className="h-10 w-10" aria-hidden="true" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-card-foreground">
                Sesi Meditasi Selesai
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Tubuh dan pikiranmu sudah kembali rileks. Bawalah ketenangan ini
                ke aktivitasmu selanjutnya.
              </p>
              <button
                type="button"
                onClick={() => selectDuration(selectedDuration)}
                className="mt-6 min-h-[48px] rounded-xl bg-primary px-8 font-heading text-sm font-bold text-primary-foreground shadow-xs hover:bg-primary-dark"
              >
                Ulangi Sesi
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="mb-8 flex flex-wrap justify-center gap-2">
                {[
                  { label: "1 Menit", sec: 60 },
                  { label: "3 Menit", sec: 180 },
                  { label: "5 Menit", sec: 300 },
                ].map((item) => (
                  <button
                    key={item.sec}
                    type="button"
                    disabled={isRunning}
                    onClick={() => selectDuration(item.sec)}
                    className={`min-h-[44px] rounded-full px-4 py-2 text-xs font-bold transition-colors disabled:opacity-50 ${
                      selectedDuration === item.sec
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-surface-soft text-foreground hover:bg-muted"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="relative mb-8 flex h-[220px] w-[220px] items-center justify-center">
                <div
                  className={`absolute inset-0 rounded-full bg-primary/10 transition-transform duration-1000 ${
                    isRunning ? "scale-105" : ""
                  }`}
                />
                <div
                  className={`absolute h-[180px] w-[180px] rounded-full bg-primary/20 transition-transform duration-1000 ${
                    isRunning ? "scale-105" : ""
                  }`}
                />
                <div className="relative z-10 flex h-[144px] w-[144px] flex-col items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
                  <span className="font-heading text-3xl font-bold tracking-wider">
                    {formattedTime}
                  </span>
                  <span className="text-xs font-medium opacity-90">
                    {isRunning ? "Bernapas..." : "Siap"}
                  </span>
                </div>
              </div>

              <div className="mb-8 min-h-[60px] max-w-sm">
                <p className="font-heading text-sm font-semibold leading-relaxed text-card-foreground">
                  &ldquo;{AFFIRMATIONS[affirmationIndex]}&rdquo;
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsRunning((prev) => !prev)}
                className="flex min-h-[48px] items-center gap-2 rounded-xl bg-primary px-8 font-heading text-sm font-bold text-primary-foreground shadow-xs hover:bg-primary-dark"
              >
                {isRunning ? (
                  <>
                    <Pause className="h-5 w-5" aria-hidden="true" /> Jeda Meditasi
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" aria-hidden="true" /> Mulai Meditasi
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
