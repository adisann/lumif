"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Droplets, RotateCcw, Sun } from "lucide-react";
import BreathingOrb, { type BreathingStep } from "@/components/BreathingOrb";

type GameCompleteProps = {
  onComplete: (summary: string) => void;
};

/* ============================================================================
 * 1. GELEMBUNG KETENANGAN (60fps drifting bubbles + pop ripples, timer bug fixed)
 * ========================================================================== */
type CalmBubble = {
  id: number;
  x: number;
  y: number;
  size: number;
  speedY: number;
  swayPhase: number;
  color: string;
};

type PopRipple = {
  id: number;
  x: number;
  y: number;
  color: string;
};

const BUBBLE_COLORS = [
  "rgba(45, 147, 108, 0.28)",
  "rgba(255, 130, 0, 0.24)",
  "rgba(237, 191, 69, 0.28)",
  "rgba(37, 123, 90, 0.24)",
];

const INITIAL_BUBBLES: CalmBubble[] = [
  { id: 1, x: 24, y: 74, size: 64, speedY: 9, swayPhase: 0.4, color: BUBBLE_COLORS[0] },
  { id: 2, x: 54, y: 82, size: 72, speedY: 7.5, swayPhase: 1.7, color: BUBBLE_COLORS[1] },
  { id: 3, x: 78, y: 66, size: 60, speedY: 10, swayPhase: 2.9, color: BUBBLE_COLORS[2] },
  { id: 4, x: 38, y: 46, size: 58, speedY: 8.5, swayPhase: 4.1, color: BUBBLE_COLORS[3] },
];

export function BubblesGame({ onComplete }: GameCompleteProps) {
  const [poppedCount, setPoppedCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(40);
  const [bubbles, setBubbles] = useState<CalmBubble[]>(INITIAL_BUBBLES);
  const [ripples, setRipples] = useState<PopRipple[]>([]);

  const poppedRef = useRef(0);
  const rippleSeqRef = useRef(1);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Independent 1s countdown (never resets on bubble pop)
  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          onCompleteRef.current(
            `Berhasil memecahkan ${poppedRef.current} gelembung ketenangan.`
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  // Gentle 60fps upward float + spawn
  useEffect(() => {
    let rafId = 0;
    let lastNow = performance.now();
    let spawnAccumulator = 0;
    let idSeq = 100;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastNow) / 1000);
      lastNow = now;
      spawnAccumulator += dt;

      setBubbles((prev) => {
        const moved = prev
          .map((b) => ({
            ...b,
            y: b.y - b.speedY * dt,
            x: Math.min(88, Math.max(12, b.x + Math.sin(now / 700 + b.swayPhase) * 0.08)),
          }))
          .filter((b) => b.y > -12);

        if (spawnAccumulator >= 0.85 && moved.length < 9) {
          spawnAccumulator = 0;
          idSeq += 1;
          moved.push({
            id: idSeq,
            x: 16 + ((idSeq * 29) % 68),
            y: 104,
            size: 54 + ((idSeq * 11) % 24),
            speedY: 8 + ((idSeq * 3) % 5),
            swayPhase: idSeq * 1.1,
            color: BUBBLE_COLORS[idSeq % BUBBLE_COLORS.length],
          });
        }
        return moved;
      });

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  const popBubble = (b: CalmBubble) => {
    poppedRef.current += 1;
    setPoppedCount(poppedRef.current);
    setBubbles((prev) => prev.filter((item) => item.id !== b.id));

    rippleSeqRef.current += 1;
    const rippleId = rippleSeqRef.current;
    setRipples((prev) => [...prev.slice(-5), { id: rippleId, x: b.x, y: b.y, color: b.color }]);
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 450);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-2xl bg-surface-soft px-4 py-3 text-xs">
        <span>
          Terpecahkan:{" "}
          <strong className="text-brand-orange-ink">{poppedCount} gelembung</strong>
        </span>
        <span className="font-heading font-bold text-primary">
          {timeLeft}s tersisa
        </span>
      </div>

      <div className="relative h-[300px] w-full overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-[#EFF8F4] to-card sm:h-[360px]">
        {ripples.map((r) => (
          <span
            key={r.id}
            aria-hidden="true"
            style={{ left: `${r.x}%`, top: `${r.y}%`, borderColor: r.color }}
            className="pointer-events-none absolute h-20 w-20 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full border-2 opacity-60"
          />
        ))}

        {bubbles.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => popBubble(b)}
            aria-label="Sentuh gelembung ketenangan"
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: `${b.size}px`,
              height: `${b.size}px`,
              backgroundColor: b.color,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/80 shadow-sm backdrop-blur-[2px] transition-transform hover:scale-105 active:scale-75"
          >
            <span
              aria-hidden="true"
              className="absolute left-3 top-2.5 h-3 w-3 rounded-full bg-white/85"
            />
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() =>
            onComplete(`Berhasil memecahkan ${poppedRef.current} gelembung ketenangan.`)
          }
          className="min-h-[40px] rounded-xl bg-primary px-4 font-heading text-xs font-bold text-primary-foreground hover:bg-primary-dark"
        >
          Selesai Sekarang
        </button>
      </div>
    </div>
  );
}

/* ============================================================================
 * 3. CAHAYA NAPAS (Guided rhythmic breath orb)
 * ========================================================================== */
const CAHAYA_STEPS: BreathingStep[] = [
  { phase: "inhale", title: "Tarik Nafas", subtitle: "Biarkan cahaya mengembang perlahan", helper: "Isi paru-parumu dengan tenang", duration: 4 },
  { phase: "exhale", title: "Hembuskan", subtitle: "Ikuti cahaya menyusut lembut", helper: "Lepaskan beban di bahu", duration: 4 },
  { phase: "inhale", title: "Tarik Nafas", subtitle: "Hirup udara dengan ritme stabil", helper: "Rasakan ketenangan masuk", duration: 4 },
  { phase: "exhale", title: "Hembuskan", subtitle: "Buang napas sampai tuntas", helper: "Kembali ke saat ini", duration: 4 },
  { phase: "inhale", title: "Tarik Nafas", subtitle: "Satu tarikan dalam terakhir", helper: "Tetap tenang dan nyaman", duration: 4 },
  { phase: "exhale", title: "Hembuskan", subtitle: "Lepaskan sisa ketegangan", helper: "Kamu aman dan terkendali", duration: 4 },
];

export function BreathLightGame({ onComplete }: GameCompleteProps) {
  return (
    <div className="flex justify-center py-2">
      <BreathingOrb
        steps={CAHAYA_STEPS}
        onComplete={() => onComplete("Sesi Cahaya Napas selesai diikuti dengan tenang.")}
      />
    </div>
  );
}

/* ============================================================================
 * 5. SUSUN WARNA (Official Lumif palette gradient sort)
 * ========================================================================== */
const COLOR_PALETTES = [
  {
    name: "Hijau Lumif",
    shades: ["#E6F5EE", "#C2E6D6", "#96D4B8", "#62BC96", "#2D936C", "#1D6348"],
  },
  {
    name: "Senja Oranye",
    shades: ["#FFF3E0", "#FFD9A8", "#FFBD70", "#FF9F38", "#FF8200", "#CC6500"],
  },
  {
    name: "Emas Pagi",
    shades: ["#FEF9E7", "#FCEEB5", "#F9E284", "#F4D35E", "#EDBF45", "#B58D18"],
  },
];

export function ColorSortGame({ onComplete }: GameCompleteProps) {
  const [paletteIdx, setPaletteIdx] = useState(0);
  const target = COLOR_PALETTES[paletteIdx].shades;
  const [tiles, setTiles] = useState<string[]>(() => [
    target[3],
    target[0],
    target[5],
    target[1],
    target[4],
    target[2],
  ]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);

  const isSorted = tiles.every((hex, i) => hex === target[i]);

  const switchPalette = (idx: number) => {
    const nextTarget = COLOR_PALETTES[idx].shades;
    setPaletteIdx(idx);
    setTiles([
      nextTarget[4],
      nextTarget[1],
      nextTarget[5],
      nextTarget[0],
      nextTarget[3],
      nextTarget[2],
    ]);
    setSelectedIdx(null);
    setMoves(0);
  };

  const handleTileClick = (idx: number) => {
    if (isSorted) return;
    if (selectedIdx === null) {
      setSelectedIdx(idx);
      return;
    }
    if (selectedIdx === idx) {
      setSelectedIdx(null);
      return;
    }

    const next = [...tiles];
    const tmp = next[selectedIdx];
    next[selectedIdx] = next[idx];
    next[idx] = tmp;
    setTiles(next);
    setSelectedIdx(null);
    setMoves((m) => m + 1);

    if (next.every((hex, i) => hex === target[i])) {
      window.setTimeout(() => {
        onComplete(`Gradasi warna tersusun rapi dalam ${moves + 1} pertukaran.`);
      }, 450);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {COLOR_PALETTES.map((pal, idx) => (
            <button
              key={pal.name}
              type="button"
              onClick={() => switchPalette(idx)}
              className={`min-h-[38px] rounded-xl px-3 text-xs font-bold transition ${
                paletteIdx === idx
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              {pal.name}
            </button>
          ))}
        </div>

        <span className="text-xs font-semibold text-muted-foreground">
          Langkah: <strong className="text-brand-orange-ink">{moves}</strong>
        </span>
      </div>

      <div className="rounded-2xl bg-surface-soft p-5">
        <div className="mb-3 flex justify-between text-xs font-semibold text-muted-foreground">
          <span>Paling Terang</span>
          <span>Paling Gelap</span>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {tiles.map((hex, idx) => {
            const isSelected = selectedIdx === idx;
            const correctSpot = hex === target[idx];
            return (
              <button
                key={`${hex}-${idx}`}
                type="button"
                onClick={() => handleTileClick(idx)}
                style={{ backgroundColor: hex }}
                aria-label={`Keping warna ke-${idx + 1}`}
                aria-pressed={isSelected}
                className={`flex h-24 items-end justify-center rounded-2xl border-2 p-2 transition-transform sm:h-28 ${
                  isSelected
                    ? "scale-105 border-[#071013] shadow-md"
                    : "border-white/80 hover:scale-[1.02]"
                }`}
              >
                {correctSpot && isSorted && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-primary">
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Klik dua kepingan untuk menukar posisinya hingga gradasi terasa harmonis. Tanpa batas waktu.
      </p>
    </div>
  );
}

/* ============================================================================
 * 6. TUMBUHKAN HARAPAN (Water & Sunlight nurturing plant, official palette)
 * ========================================================================== */
const GROWTH_LABELS = [
  "Benih Hangat",
  "Tunas Muda",
  "Daun Berkembang",
  "Bunga Mekar",
];

export function GrowHopeGame({ onComplete }: GameCompleteProps) {
  const [water, setWater] = useState(25);
  const [sunlight, setSunlight] = useState(40);
  const [growth, setGrowth] = useState(15);

  const stage = growth >= 90 ? 3 : growth >= 60 ? 2 : growth >= 35 ? 1 : 0;

  const waterPlant = () => {
    setWater((w) => Math.min(100, w + 22));
    setGrowth((g) => Math.min(100, g + 22));
  };

  const adjustSun = (nextSun: number) => {
    setSunlight(nextSun);
    if (nextSun >= 50 && nextSun <= 90) {
      setGrowth((g) => Math.min(100, g + 8));
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-center">
      <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-[#FFF7EB] to-[#EAF7F1] p-6 md:col-span-6">
        <svg viewBox="0 0 200 200" className="h-52 w-52">
          <circle
            cx="155"
            cy="42"
            r={16 + sunlight * 0.14}
            fill="#FF8200"
            opacity={0.18 + sunlight * 0.006}
          />
          <polygon points="68,145 132,145 122,186 78,186" fill="#C96F4B" />
          <rect x="62" y="136" width="76" height="12" rx="4" fill="#D9825E" />

          {stage >= 1 && (
            <path
              d={stage >= 2 ? "M100 136 Q96 105 100 74" : "M100 136 Q98 118 100 106"}
              stroke="#257B5A"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
          )}

          {stage === 0 && (
            <ellipse cx="100" cy="128" rx="10" ry="7" fill="#8C6244" />
          )}

          {stage >= 1 && (
            <>
              <ellipse cx="86" cy="112" rx="13" ry="7" transform="rotate(-25 86 112)" fill="#2D936C" />
              <ellipse cx="114" cy="108" rx="13" ry="7" transform="rotate(25 114 108)" fill="#47A480" />
            </>
          )}
          {stage >= 2 && (
            <>
              <ellipse cx="83" cy="86" rx="16" ry="8" transform="rotate(-30 83 86)" fill="#257B5A" />
              <ellipse cx="117" cy="84" rx="16" ry="8" transform="rotate(30 117 84)" fill="#2D936C" />
            </>
          )}

          {stage >= 3 && (
            <g transform="translate(100,66)">
              <circle cx="0" cy="-12" r="10" fill="#FF8200" />
              <circle cx="11" cy="-3" r="10" fill="#FFA23A" />
              <circle cx="7" cy="10" r="10" fill="#FF8200" />
              <circle cx="-7" cy="10" r="10" fill="#FFA23A" />
              <circle cx="-11" cy="-3" r="10" fill="#FF8200" />
              <circle cx="0" cy="0" r="8" fill="#EDBF45" />
            </g>
          )}
        </svg>

        <p className="mt-2 font-heading text-sm font-bold text-primary">
          {GROWTH_LABELS[stage]} ({growth}%)
        </p>
      </div>

      <div className="space-y-4 md:col-span-6">
        <div className="rounded-2xl bg-surface-soft p-4">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold">
            <span className="inline-flex items-center gap-1.5 text-primary">
              <Droplets className="h-4 w-4" aria-hidden="true" />
              Kelembapan Air
            </span>
            <span>{water}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${water}%` }} />
          </div>
          <button
            type="button"
            onClick={waterPlant}
            className="mt-3 min-h-[44px] w-full rounded-xl bg-primary font-heading text-xs font-bold text-primary-foreground hover:bg-primary-dark"
          >
            Siram Air Perlahan
          </button>
        </div>

        <div className="rounded-2xl bg-surface-soft p-4">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold">
            <span className="inline-flex items-center gap-1.5 text-brand-orange-ink">
              <Sun className="h-4 w-4 text-brand-orange" aria-hidden="true" />
              Cahaya Hangat
            </span>
            <span>{sunlight}%</span>
          </div>
          <input
            type="range"
            min={10}
            max={100}
            value={sunlight}
            onChange={(e) => adjustSun(Number(e.target.value))}
            aria-label="Atur cahaya matahari"
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-[#FF8200]"
          />
          <p className="mt-2 text-[11px] text-muted-foreground">
            Tanamanmu tidak akan pernah layu. Nikmati pertumbuhannya pelan-pelan.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            onComplete(`Tanaman mencapai tahap ${GROWTH_LABELS[stage]} (${growth}%).`)
          }
          className="min-h-[44px] w-full rounded-xl border border-primary bg-primary-light font-heading text-xs font-bold text-primary hover:bg-primary hover:text-primary-foreground"
        >
          {growth >= 90 ? "Panen & Selesai" : "Selesai Rawat Sekarang"}
        </button>
      </div>
    </div>
  );
}

/* ============================================================================
 * 7. TEMUKAN SEKITARMU (Keyboard-accessible 2-phase Grounding)
 * ========================================================================== */
const SCENE_ITEMS = [
  { id: "cup", label: "Cangkir Hangat" },
  { id: "book", label: "Buku Catatan" },
  { id: "leaf", label: "Daun Pakis" },
];

const REAL_WORLD_PROMPTS = [
  "Temukan 1 benda nyata berwarna hijau atau cokelat di ruanganmu",
  "Dengarkan 1 suara paling pelan di sekitarmu saat ini",
  "Sentuh 1 permukaan yang terasa sejuk atau bertekstur",
];

export function GroundingFindGame({ onComplete }: GameCompleteProps) {
  const [foundIds, setFoundIds] = useState<string[]>([]);
  const [realChecked, setRealChecked] = useState<number[]>([]);

  const allIllustrationFound = foundIds.length === SCENE_ITEMS.length;

  const markFound = (id: string) => {
    setFoundIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const handleSvgKey = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      markFound(id);
    }
  };

  const toggleReal = (idx: number) => {
    setRealChecked((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="space-y-5">
      {!allIllustrationFound ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-muted-foreground">
              Tahap 1: Cari 3 benda tenang di dalam ilustrasi
            </span>
            <div className="flex flex-wrap gap-2">
              {SCENE_ITEMS.map((item) => {
                const found = foundIds.includes(item.id);
                return (
                  <span
                    key={item.id}
                    className={`rounded-md px-2.5 py-1 font-bold ${
                      found
                        ? "bg-primary-light text-primary line-through"
                        : "bg-surface-soft text-foreground"
                    }`}
                  >
                    {item.label}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-[#F5F8F6]">
            <svg viewBox="0 0 600 300" className="h-[250px] w-full sm:h-[300px]">
              <rect width="600" height="300" fill="#EDF4F0" />
              <rect x="0" y="210" width="600" height="90" fill="#E3D7C3" />
              {/* Window with sunlight */}
              <rect x="210" y="34" width="180" height="120" rx="10" fill="#FFF7E8" stroke="#9FB7AA" strokeWidth="6" />
              <circle cx="348" cy="70" r="16" fill="#EDBF45" opacity="0.65" />
              <line x1="300" y1="34" x2="300" y2="154" stroke="#9FB7AA" strokeWidth="4" />
              <line x1="210" y1="94" x2="390" y2="94" stroke="#9FB7AA" strokeWidth="4" />
              {/* Desk */}
              <rect x="90" y="185" width="420" height="22" rx="6" fill="#C4A484" />
              <rect x="115" y="207" width="16" height="70" fill="#9E7E5F" />
              <rect x="469" y="207" width="16" height="70" fill="#9E7E5F" />

              {/* Item 1: Cangkir Hangat */}
              <g
                role="button"
                tabIndex={0}
                aria-label="Cangkir Hangat"
                onClick={() => markFound("cup")}
                onKeyDown={(e) => handleSvgKey(e, "cup")}
                className="cursor-pointer focus:outline-none"
              >
                {foundIds.includes("cup") && (
                  <circle cx="171" cy="168" r="28" fill="rgba(45, 147, 108, 0.2)" stroke="#2D936C" strokeWidth="2.5" />
                )}
                <rect x="155" y="152" width="32" height="33" rx="6" fill="#FF8200" />
                <path d="M187 159 Q198 159 198 168 Q198 177 187 177" fill="none" stroke="#FF8200" strokeWidth="4" />
              </g>

              {/* Item 2: Buku Catatan */}
              <g
                role="button"
                tabIndex={0}
                aria-label="Buku Catatan"
                onClick={() => markFound("book")}
                onKeyDown={(e) => handleSvgKey(e, "book")}
                className="cursor-pointer focus:outline-none"
              >
                {foundIds.includes("book") && (
                  <circle cx="318" cy="176" r="38" fill="rgba(45, 147, 108, 0.2)" stroke="#2D936C" strokeWidth="2.5" />
                )}
                <rect x="285" y="168" width="66" height="17" rx="3" fill="#257B5A" />
                <line x1="292" y1="176" x2="344" y2="176" stroke="#EDBF45" strokeWidth="2.5" />
              </g>

              {/* Item 3: Daun Pakis */}
              <g
                role="button"
                tabIndex={0}
                aria-label="Daun Pakis"
                onClick={() => markFound("leaf")}
                onKeyDown={(e) => handleSvgKey(e, "leaf")}
                className="cursor-pointer focus:outline-none"
              >
                {foundIds.includes("leaf") && (
                  <circle cx="455" cy="155" r="34" fill="rgba(45, 147, 108, 0.2)" stroke="#2D936C" strokeWidth="2.5" />
                )}
                <polygon points="435,155 475,155 468,185 442,185" fill="#B56E4C" />
                <ellipse cx="445" cy="138" rx="14" ry="7" transform="rotate(-35 445 138)" fill="#2D936C" />
                <ellipse cx="465" cy="138" rx="14" ry="7" transform="rotate(35 465 138)" fill="#257B5A" />
              </g>
            </svg>
          </div>
        </>
      ) : (
        <div className="space-y-4 rounded-2xl bg-surface-soft p-5">
          <div>
            <h3 className="font-heading text-base font-bold text-primary">
              Tahap 2: Amati Ruangan Nyatamu
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Ketiga benda di gambar sudah ketemu. Sekarang arahkan perhatian ke sekitarmu saat ini:
            </p>
          </div>

          <div className="space-y-2.5">
            {REAL_WORLD_PROMPTS.map((prompt, idx) => {
              const checked = realChecked.includes(idx);
              return (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => toggleReal(idx)}
                  aria-pressed={checked}
                  className={`flex min-h-[54px] w-full items-center gap-3 rounded-xl border p-3.5 text-left text-xs font-semibold transition ${
                    checked
                      ? "border-primary bg-primary-light text-foreground"
                      : "border-border bg-card text-card-foreground hover:border-primary/40"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${
                      checked
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-background"
                    }`}
                  >
                    {checked && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                  </span>
                  <span>{prompt}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() =>
              onComplete("Latihan grounding visual dan orientasi ruangan selesai.")
            }
            className="min-h-[44px] w-full rounded-xl bg-primary font-heading text-xs font-bold text-primary-foreground hover:bg-primary-dark"
          >
            Selesai Grounding ({realChecked.length}/3)
          </button>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
 * 9. LIPAT KERTAS (Smooth layered CSS/SVG crease folding)
 * ========================================================================== */
type OrigamiId = "boat" | "bird" | "flower";

const ORIGAMI_DATA: Record<
  OrigamiId,
  { name: string; baseColor: string; foldColor: string; accentColor: string; labels: string[] }
> = {
  boat: {
    name: "Perahu Kertas",
    baseColor: "#CBEADF",
    foldColor: "#2D936C",
    accentColor: "#FF8200",
    labels: [
      "Lipat kertas menjadi dua bagian horizontal",
      "Lipat kedua sudut atas ke garis tengah",
      "Lipat tepi bawah ke atas membentuk pinggiran perahu",
      "Buka perlahan hingga Perahu Kertas berdiri",
    ],
  },
  bird: {
    name: "Burung Bangau",
    baseColor: "#FFE4C2",
    foldColor: "#FF8200",
    accentColor: "#257B5A",
    labels: [
      "Lipat diagonal membentuk dasar berlian",
      "Lipat sisi kiri dan kanan ke sumbu tengah",
      "Lipat leher dan ekor mengarah ke atas",
      "Bentangkan kedua sayap Burung Bangau",
    ],
  },
  flower: {
    name: "Bunga Teratai",
    baseColor: "#FDF2D6",
    foldColor: "#EDBF45",
    accentColor: "#FF8200",
    labels: [
      "Lipat keempat sudut menuju titik pusat",
      "Lipat lapisan kedua lebih rapat ke dalam",
      "Balikkan lipatan untuk membentuk dasar kelopak",
      "Rekahkan kelopak Bunga Teratai satu per satu",
    ],
  },
};

export function PaperFoldGame({ onComplete }: GameCompleteProps) {
  const [pattern, setPattern] = useState<OrigamiId>("boat");
  const [stepIdx, setStepIdx] = useState(0);

  const info = ORIGAMI_DATA[pattern];
  const isLast = stepIdx === info.labels.length - 1;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(Object.keys(ORIGAMI_DATA) as OrigamiId[]).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setPattern(id);
              setStepIdx(0);
            }}
            className={`min-h-[38px] rounded-xl px-3.5 text-xs font-bold transition ${
              pattern === id
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-muted-foreground hover:bg-muted"
            }`}
          >
            {ORIGAMI_DATA[id].name}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center rounded-2xl bg-surface-soft p-6 text-center">
        <div className="relative flex h-52 w-52 items-center justify-center">
          <svg viewBox="0 0 200 200" className="h-full w-full overflow-visible">
            {/* Base sheet */}
            <rect
              x="40"
              y="40"
              width="120"
              height="120"
              rx="6"
              fill={info.baseColor}
              stroke="#071013"
              strokeOpacity="0.15"
              strokeWidth="2"
              className="origin-center transition-all duration-500"
              style={{
                transform:
                  stepIdx >= 1 ? "scaleY(0.62) translateY(20px)" : "scaleY(1)",
                opacity: stepIdx >= 3 ? 0.25 : 1,
              }}
            />

            {/* Left flap */}
            <polygon
              points="40,100 100,42 100,145"
              fill={info.foldColor}
              opacity={stepIdx >= 1 ? 0.92 : 0.25}
              className="origin-[100px_100px] transition-all duration-500"
              style={{
                transform:
                  stepIdx >= 2
                    ? "scaleX(0.92) rotate(-6deg)"
                    : stepIdx === 1
                      ? "scaleX(1)"
                      : "scaleX(0.25)",
              }}
            />

            {/* Right flap */}
            <polygon
              points="160,100 100,42 100,145"
              fill={info.foldColor}
              opacity={stepIdx >= 1 ? 0.78 : 0.25}
              className="origin-[100px_100px] transition-all duration-500"
              style={{
                transform:
                  stepIdx >= 2
                    ? "scaleX(0.92) rotate(6deg)"
                    : stepIdx === 1
                      ? "scaleX(1)"
                      : "scaleX(0.25)",
              }}
            />

            {/* Final silhouette crest */}
            <polygon
              points={
                pattern === "boat"
                  ? "32,124 168,124 142,160 58,160"
                  : pattern === "bird"
                    ? "26,90 100,108 174,72 128,144 72,144"
                    : "100,42 130,82 162,102 128,134 136,162 100,144 64,162 72,134 38,102 70,82"
              }
              fill={info.accentColor}
              className="origin-center transition-all duration-500"
              style={{
                opacity: stepIdx >= 3 ? 1 : 0,
                transform: stepIdx >= 3 ? "scale(1)" : "scale(0.6)",
              }}
            />

            {/* Dashed crease guide */}
            <line
              x1="100"
              y1="38"
              x2="100"
              y2="162"
              stroke="#071013"
              strokeOpacity="0.25"
              strokeDasharray="4 4"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        <p className="mt-2 text-xs font-bold text-brand-orange-ink">
          Langkah {stepIdx + 1} dari {info.labels.length}
        </p>
        <p className="mt-1 font-heading text-sm font-bold text-foreground">
          {info.labels[stepIdx]}
        </p>

        <div className="mt-5 flex gap-3">
          {stepIdx > 0 && (
            <button
              type="button"
              onClick={() => setStepIdx(0)}
              className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border border-border bg-card px-4 text-xs font-bold hover:bg-muted"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Ulang
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (!isLast) {
                setStepIdx((s) => s + 1);
              } else {
                onComplete(`Origami ${info.name} selesai dilipat.`);
              }
            }}
            className="min-h-[42px] rounded-xl bg-primary px-6 font-heading text-xs font-bold text-primary-foreground hover:bg-primary-dark"
          >
            {isLast ? `Selesai (${info.name})` : "Lipat Langkah Berikutnya"}
          </button>
        </div>
      </div>
    </div>
  );
}
