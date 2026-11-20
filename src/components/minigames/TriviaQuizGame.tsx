"use client";

import { useState } from "react";
import Image from "next/image";
import type { TriviaDeck } from "@/lib/triviaData";
import { ArrowRight, CheckCircle2, HelpCircle, XCircle } from "lucide-react";

const OPTION_LETTERS = ["A", "B", "C", "D"] as const;

export default function TriviaQuizGame({
  deck,
  onComplete,
}: {
  deck: TriviaDeck;
  onComplete: (summary: string) => void;
}) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  const currentQuestion = deck.questions[questionIndex];
  const totalQuestions = deck.questions.length;
  const isAnswered = selectedIdx !== null;
  const isLastQuestion = questionIndex === totalQuestions - 1;
  const progressPct = Math.round(((questionIndex + (isAnswered ? 1 : 0)) / totalQuestions) * 100);

  const handleSelectOption = (optIdx: number) => {
    if (isAnswered) return;
    setSelectedIdx(optIdx);
    if (optIdx === currentQuestion.correctIndex) {
      setCorrectCount((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setQuestionIndex((prev) => prev + 1);
      setSelectedIdx(null);
      return;
    }

    onComplete(
      `Kamu menyelesaikan kuis "${deck.title}" dengan ${correctCount} dari ${totalQuestions} jawaban tepat. Pikiran dapat istirahat segar lewat rasa ingin tahu yang sehat.`
    );
  };

  return (
    <div className="space-y-5">
      {/* Quizizz-style calm progress header */}
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-primary-light px-2.5 py-1 font-heading font-bold text-primary">
              {deck.category}
            </span>
            <span className="font-semibold text-muted-foreground">
              Soal {questionIndex + 1} dari {totalQuestions}
            </span>
          </div>

          <span className="font-heading font-bold text-brand-orange-ink">
            Benar: {correctCount}
          </span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-surface-soft">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Optional photographic visual prompt */}
      {currentQuestion.image && (
        <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-border bg-muted sm:h-60">
          <Image
            src={currentQuestion.image}
            alt={currentQuestion.imageAlt || deck.coverAlt}
            fill
            sizes="(max-width: 768px) 100vw, 760px"
            unoptimized
            className="object-cover"
          />
        </div>
      )}

      {/* Question text */}
      <h2 className="font-heading text-lg font-bold leading-snug text-foreground sm:text-xl">
        {currentQuestion.question}
      </h2>

      {/* Answer Options */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {currentQuestion.options.map((optionText, idx) => {
          const isThisSelected = selectedIdx === idx;
          const isThisCorrect = idx === currentQuestion.correctIndex;

          let cardClass =
            "border-border bg-surface-soft/70 text-foreground hover:border-primary/50 hover:bg-primary-light/40";
          let badgeClass = "bg-card text-muted-foreground border border-border";

          if (isAnswered) {
            if (isThisCorrect) {
              cardClass =
                "border-primary bg-primary-light text-foreground shadow-xs";
              badgeClass = "bg-primary text-primary-foreground border border-primary";
            } else if (isThisSelected) {
              cardClass =
                "border-[#FF8200] bg-[#FFF4E8] dark:bg-orange-950/35 text-foreground";
              badgeClass = "bg-[#FF8200] text-white border border-[#FF8200]";
            } else {
              cardClass = "border-border/60 bg-muted/40 text-muted-foreground opacity-75";
            }
          }

          return (
            <button
              key={optionText}
              type="button"
              disabled={isAnswered}
              onClick={() => handleSelectOption(idx)}
              className={`flex min-h-[56px] items-center gap-3 rounded-2xl border p-3.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.99] disabled:cursor-default ${cardClass}`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-heading text-xs font-bold ${badgeClass}`}
              >
                {OPTION_LETTERS[idx]}
              </span>

              <span className="flex-1 text-sm font-semibold leading-snug">
                {optionText}
              </span>

              {isAnswered && isThisCorrect && (
                <CheckCircle2
                  className="h-5 w-5 shrink-0 text-primary"
                  aria-hidden="true"
                />
              )}
              {isAnswered && isThisSelected && !isThisCorrect && (
                <XCircle
                  className="h-5 w-5 shrink-0 text-[#FF8200]"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Fun Fact Explanation & Next CTA */}
      {isAnswered && (
        <div className="space-y-4 rounded-2xl border border-border bg-surface-soft/80 p-4 sm:p-5">
          <div className="flex items-start gap-2.5">
            <HelpCircle
              className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <div>
              <p className="font-heading text-xs font-bold uppercase tracking-wide text-primary">
                {selectedIdx === currentQuestion.correctIndex
                  ? "Tepat sekali · Fakta Singkat"
                  : "Jawaban Kurang Tepat · Fakta Singkat"}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-foreground/90 sm:text-sm">
                {currentQuestion.funFact}
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-primary px-5 font-heading text-xs font-bold text-primary-foreground transition hover:bg-primary-dark sm:text-sm"
            >
              <span>
                {isLastQuestion ? "Selesaikan Kuis" : "Soal Berikutnya"}
              </span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
