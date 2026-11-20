"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import ScreenHeader from "@/components/ScreenHeader";
import { CheckCircle2 } from "lucide-react";

type Question = {
  id: number;
  question: string;
  options: { label: string; feedback: string }[];
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Kapan dorongan impulsif paling sering muncul?",
    options: [
      {
        label: "Saat lelah atau larut malam",
        feedback:
          "Kelelahan menurunkan kendali prefrontal cortex. Tidur teratur adalah perisai utamamu.",
      },
      {
        label: "Saat merasa bosan tanpa kegiatan",
        feedback:
          "Otak mencari stimulasi instan saat bosan. Siapkan aktivitas pengganti berdurasi 5 menit.",
      },
      {
        label: "Saat mengalami stres kerja atau kuliah",
        feedback:
          "Dorongan sering dipakai sebagai pelarian emosi. Latihan napas 2 menit membantu menurunkannya.",
      },
      {
        label: "Saat sendirian di kamar",
        feedback:
          "Lingkungan memicu kebiasaan. Mengubah posisi atau keluar kamar sering memutus pola otomatis.",
      },
    ],
  },
  {
    id: 2,
    question: "Apa reaksi pertamamu saat dorongan mulai terasa?",
    options: [
      {
        label: "Panik dan mencoba melawan sekuat tenaga",
        feedback:
          "Melawan secara agresif sering memperbesar fokus pada dorongan. Coba teknik Urge Surfing.",
      },
      {
        label: "Mencari distraksi seperti air minum atau musik",
        feedback:
          "Pilihan tepat. Menunda 3 menit memberi waktu bagi gelombang dorongan untuk surut.",
      },
      {
        label: "Langsung menyerah tanpa sempat berpikir",
        feedback:
          "Itu tanda pola otomatis. Memberi jeda 10 detik saja sudah merupakan kemajuan awal.",
      },
    ],
  },
  {
    id: 3,
    question: "Apa tujuan utama yang paling ingin kamu capai?",
    options: [
      {
        label: "Mengembalikan fokus, konsentrasi, dan daya ingat",
        feedback:
          "Sistem reward yang lebih stabil akan membantu ketajaman mental pulih bertahap.",
      },
      {
        label: "Bebas dari rasa bersalah dan cemas",
        feedback:
          "Penerimaan diri (ACT) dan langkah jujur membantu meringankan beban mental.",
      },
      {
        label: "Membangun disiplin dan rutinitas baru",
        feedback:
          "Kebiasaan baru menggantikan kebiasaan lama. Mulai dari rutinitas kecil setiap hari.",
      },
    ],
  },
];

export default function QuizPage() {
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = QUESTIONS[currentIndex];

  const handleNext = () => {
    if (selectedOption === null) return;

    const nextAnswers = [...answers, selectedOption];
    setAnswers(nextAnswers);
    setSelectedOption(null);

    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  return (
    <div className="lumif-with-nav relative flex min-h-dvh flex-col bg-surface-soft font-sans text-foreground">
      <ScreenHeader
        title="Kuis Refleksi Diri"
        subtitle="Pola pikir & strategi pengalihan"
      />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 pb-[calc(110px+env(safe-area-inset-bottom))] pt-6 md:px-8 md:pb-10">
        <div className="flex flex-1 flex-col rounded-3xl border border-border bg-card p-6 shadow-xs md:p-8">
          {isCompleted ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-primary">
                <CheckCircle2 className="h-10 w-10" aria-hidden="true" />
              </div>

              <h2 className="font-heading text-2xl font-bold text-card-foreground">
                Refleksi Selesai!
              </h2>

              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                Kamu semakin memahami pola pemicu dan kebutuhan mentalmu. Gunakan
                catatan ini untuk memperkuat rutinitas harianmu.
              </p>

              <div className="mt-6 flex w-full max-w-sm flex-col gap-3">
                <button
                  type="button"
                  onClick={() => router.push("/exercises/breathing")}
                  className="min-h-[48px] rounded-xl bg-primary font-heading text-sm font-bold text-primary-foreground shadow-xs hover:bg-primary-dark"
                >
                  Coba Latihan Napas
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/home")}
                  className="min-h-[48px] rounded-xl border border-border bg-card font-heading text-sm font-bold text-card-foreground hover:bg-muted"
                >
                  Kembali ke Beranda
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <div className="mb-3 flex items-center justify-between text-xs font-semibold text-muted-foreground">
                  <span>
                    Pertanyaan {currentIndex + 1} dari {QUESTIONS.length}
                  </span>
                  <span>
                    {Math.round(((currentIndex + 1) / QUESTIONS.length) * 100)}%
                  </span>
                </div>
                <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{
                      width: `${((currentIndex + 1) / QUESTIONS.length) * 100}%`,
                    }}
                  />
                </div>

                <h2 className="font-heading text-lg font-bold leading-snug text-card-foreground md:text-xl">
                  {currentQ.question}
                </h2>

                <div className="mt-6 flex flex-col gap-3">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setSelectedOption(idx)}
                        aria-pressed={isSelected}
                        className={`flex min-h-[56px] flex-col rounded-2xl border p-4 text-left transition-colors ${
                          isSelected
                            ? "border-primary bg-primary-light"
                            : "border-border bg-surface-soft hover:border-primary/40"
                        }`}
                      >
                        <span className="font-heading text-sm font-semibold text-foreground">
                          {opt.label}
                        </span>
                        {isSelected && (
                          <p className="mt-2 text-xs leading-relaxed text-primary">
                            {opt.feedback}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                disabled={selectedOption === null}
                onClick={handleNext}
                className="mt-6 flex min-h-[48px] w-full items-center justify-center rounded-xl bg-primary font-heading text-sm font-bold text-primary-foreground shadow-xs transition hover:bg-primary-dark disabled:opacity-50"
              >
                {currentIndex === QUESTIONS.length - 1 ? "Selesaikan" : "Lanjut"}
              </button>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
