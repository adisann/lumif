"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import ScreenHeader from "@/components/ScreenHeader";
import {
  MINI_GAME_GROUPS,
  MINI_GAMES,
  type MiniGameId,
} from "@/components/minigames/MiniGameCatalog";
import {
  CalmPathGame,
  ClearFogGame,
  PassingWavesGame,
  ZenGardenGame,
} from "@/components/minigames/CanvasMiniGames";
import {
  BreathLightGame,
  BubblesGame,
  ColorSortGame,
  GroundingFindGame,
  GrowHopeGame,
  PaperFoldGame,
} from "@/components/minigames/InteractiveMiniGames";
import TriviaQuizGame from "@/components/minigames/TriviaQuizGame";
import { TRIVIA_DECKS, type TriviaDeck } from "@/lib/triviaData";
import { awardPetReward } from "@/lib/pets";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Coins,
  Play,
  RotateCcw,
} from "lucide-react";

type GamesTab = "all" | "trivia" | "relax";

export default function GamesPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<GamesTab>("all");
  const [activeId, setActiveId] = useState<MiniGameId | null>(null);
  const [activeTriviaId, setActiveTriviaId] = useState<string | null>(null);
  const [completionSummary, setCompletionSummary] = useState<string | null>(null);
  const [gameRunKey, setGameRunKey] = useState(0);

  const activeGame = activeId
    ? MINI_GAMES.find((g) => g.id === activeId) ?? null
    : null;

  const activeTrivia: TriviaDeck | null = activeTriviaId
    ? TRIVIA_DECKS.find((d) => d.id === activeTriviaId) ?? null
    : null;

  const isPlaying = Boolean(activeGame || activeTrivia);

  const handleComplete = useCallback((summary: string) => {
    awardPetReward(15, 10);
    setCompletionSummary(summary);
  }, []);

  const openGame = (id: MiniGameId) => {
    setActiveTriviaId(null);
    setActiveId(id);
    setCompletionSummary(null);
    setGameRunKey((k) => k + 1);
  };

  const openTrivia = (id: string) => {
    setActiveId(null);
    setActiveTriviaId(id);
    setCompletionSummary(null);
    setGameRunKey((k) => k + 1);
  };

  const closeActive = () => {
    setActiveId(null);
    setActiveTriviaId(null);
    setCompletionSummary(null);
  };

  const renderGame = () => {
    if (activeTrivia) {
      return (
        <TriviaQuizGame
          key={`${activeTrivia.id}_${gameRunKey}`}
          deck={activeTrivia}
          onComplete={handleComplete}
        />
      );
    }
    if (!activeId) return null;
    switch (activeId) {
      case "bubbles":
        return <BubblesGame key={gameRunKey} onComplete={handleComplete} />;
      case "zen-garden":
        return <ZenGardenGame key={gameRunKey} onComplete={handleComplete} />;
      case "breath-light":
        return <BreathLightGame key={gameRunKey} onComplete={handleComplete} />;
      case "passing-waves":
        return <PassingWavesGame key={gameRunKey} onComplete={handleComplete} />;
      case "color-sort":
        return <ColorSortGame key={gameRunKey} onComplete={handleComplete} />;
      case "grow-hope":
        return <GrowHopeGame key={gameRunKey} onComplete={handleComplete} />;
      case "grounding-find":
        return <GroundingFindGame key={gameRunKey} onComplete={handleComplete} />;
      case "calm-path":
        return <CalmPathGame key={gameRunKey} onComplete={handleComplete} />;
      case "paper-fold":
        return <PaperFoldGame key={gameRunKey} onComplete={handleComplete} />;
      case "clear-fog":
        return <ClearFogGame key={gameRunKey} onComplete={handleComplete} />;
      default:
        return null;
    }
  };

  const headerTitle = activeTrivia
    ? activeTrivia.title
    : activeGame
    ? activeGame.title
    : "Permainan Alihkan Fokus";

  const headerSubtitle = activeTrivia
    ? `${activeTrivia.category} · ${activeTrivia.questions.length} soal trivia`
    : activeGame
    ? activeGame.mechanism
    : "Pilih aktivitas relaksasi atau kuis trivia ringan sesuai kondisimu";

  return (
    <div className="lumif-with-nav relative flex min-h-dvh flex-col bg-surface-soft font-sans text-foreground">
      <ScreenHeader title={headerTitle} subtitle={headerSubtitle} />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-[calc(110px+env(safe-area-inset-bottom))] pt-5 md:px-8 md:pb-10">
        {!isPlaying ? (
          <div className="space-y-6">
            {/* Calm Overview & Single Primary Quick Action */}
            <section className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:p-6">
              <div className="space-y-1">
                <h2 className="font-heading text-base font-bold text-foreground sm:text-lg">
                  Butuh pengalih fokus singkat?
                </h2>
                <p className="max-w-xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  Pilih permainan singkat atau kuis visual tanpa batas waktu ketat untuk memberi jeda saat dorongan atau rasa bosan muncul.
                </p>
              </div>

              <button
                type="button"
                onClick={() => openGame("passing-waves")}
                className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 font-heading text-xs font-bold text-primary-foreground transition hover:bg-primary-dark sm:text-sm"
              >
                <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                <span>Mulai Sesi Singkat</span>
              </button>
            </section>

            {/* Filter Pills */}
            <div
              role="tablist"
              aria-label="Kategori permainan"
              className="flex flex-wrap gap-2"
            >
              {(
                [
                  { id: "all", label: "Semua" },
                  { id: "trivia", label: `Kuis Trivia (${TRIVIA_DECKS.length})` },
                  { id: "relax", label: `Mini Game (${MINI_GAMES.length})` },
                ] as { id: GamesTab; label: string }[]
              ).map((tab) => {
                const active = selectedTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`min-h-[40px] rounded-xl px-4 font-heading text-xs font-bold transition ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-card text-muted-foreground hover:border-border hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Visual Photo Trivia Section (Clean Split Card, Zero Nested Floating Blur Boxes) */}
            {(selectedTab === "all" || selectedTab === "trivia") && (
              <section className="space-y-3">
                <div>
                  <h2 className="font-heading text-base font-bold text-foreground">
                    Kuis Trivia Visual
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Tebak gambar dunia, alam, kuliner, dan antariksa dengan tempo santai.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {TRIVIA_DECKS.map((deck) => (
                    <button
                      key={deck.id}
                      type="button"
                      onClick={() => openTrivia(deck.id)}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card text-left transition hover:border-primary/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <div className="relative h-40 w-full overflow-hidden bg-muted sm:h-44">
                        <Image
                          src={deck.coverImage}
                          alt={deck.coverAlt}
                          fill
                          sizes="(max-width: 640px) 100vw, 480px"
                          unoptimized
                          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                      </div>

                      <div className="flex w-full items-center justify-between gap-3 p-4">
                        <div className="min-w-0">
                          <h3 className="truncate font-heading text-sm font-bold text-foreground group-hover:text-primary sm:text-base">
                            {deck.title}
                          </h3>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {deck.duration} · {deck.questions.length} soal
                          </p>
                        </div>

                        <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-primary">
                          <span>Main</span>
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Situational Relaxing Mini-Games */}
            {(selectedTab === "all" || selectedTab === "relax") &&
              MINI_GAME_GROUPS.map((group) => {
                const groupGames = MINI_GAMES.filter((g) => g.group === group.key);
                return (
                  <section key={group.key} className="space-y-3">
                    <div>
                      <h2 className="font-heading text-base font-bold text-foreground">
                        {group.title}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {group.subtitle}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {groupGames.map((game) => {
                        const Icon = game.icon;
                        return (
                          <button
                            key={game.id}
                            type="button"
                            onClick={() => openGame(game.id)}
                            className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-5 text-left transition hover:border-primary/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                          >
                            <div>
                              <div className="mb-3 flex items-center justify-between gap-2">
                                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border/70 bg-surface-soft text-primary">
                                  <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                                </span>
                                <span className="text-xs font-medium text-muted-foreground">
                                  {game.duration}
                                </span>
                              </div>

                              <h3 className="font-heading text-sm font-bold text-card-foreground group-hover:text-primary sm:text-base">
                                {game.title}
                              </h3>
                              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                {game.description}
                              </p>
                            </div>

                            <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs font-medium text-muted-foreground">
                              <span>{game.mechanism}</span>
                              <ArrowRight
                                className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                                aria-hidden="true"
                              />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
          </div>
        ) : (
          <div className="mx-auto w-full max-w-4xl rounded-2xl border border-border bg-card p-4 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
              <button
                type="button"
                onClick={closeActive}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-border bg-surface-soft px-3.5 text-xs font-semibold text-foreground hover:bg-muted"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Kembali ke daftar
              </button>

              <span className="text-xs font-medium text-muted-foreground">
                {activeTrivia ? activeTrivia.duration : activeGame?.duration}
              </span>
            </div>

            {completionSummary ? (
              <div className="flex flex-col items-center py-8 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary">
                  <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
                </div>
                <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
                  Sesi Selesai
                </h2>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                  {completionSummary}
                </p>

                <div className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface-soft px-3.5 py-2 text-xs font-semibold text-foreground">
                  <Coins className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span>+15 XP Pendamping &amp; +10 Koin</span>
                </div>

                <div className="mt-6 flex flex-wrap justify-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setCompletionSummary(null);
                      setGameRunKey((k) => k + 1);
                    }}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-primary px-5 font-heading text-xs font-bold text-primary-foreground hover:bg-primary-dark"
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    Main Lagi
                  </button>
                  <button
                    type="button"
                    onClick={closeActive}
                    className="min-h-[44px] rounded-xl border border-border bg-card px-5 font-heading text-xs font-semibold text-foreground hover:bg-surface-soft"
                  >
                    Pilih Aktivitas Lain
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/home")}
                    className="min-h-[44px] rounded-xl border border-border bg-card px-4 font-heading text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    Ke Beranda
                  </button>
                </div>
              </div>
            ) : (
              renderGame()
            )}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
