"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, RotateCcw, Trash2 } from "lucide-react";

type GameCompleteProps = {
  onComplete: (summary: string) => void;
};

function syncCanvasDpr(canvas: HTMLCanvasElement): {
  width: number;
  height: number;
  dpr: number;
} {
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(300, Math.round(rect.width));
  const height = Math.max(240, Math.round(rect.height));
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
    canvas.width = width * dpr;
    canvas.height = height * dpr;
  }
  return { width, height, dpr };
}

/* ============================================================================
 * 2. TAMAN ZEN (HiDPI sand rake canvas + draggable stones & moss)
 * ========================================================================== */
type ZenItem = {
  id: number;
  x: number;
  y: number;
  kind: "stone" | "moss";
  r: number;
};

export function ZenGardenGame({ onComplete }: GameCompleteProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const midPosRef = useRef<{ x: number; y: number } | null>(null);
  const drawingRef = useRef(false);

  const [items, setItems] = useState<ZenItem[]>([
    { id: 1, x: 0.25, y: 0.38, kind: "stone", r: 22 },
    { id: 2, x: 0.72, y: 0.62, kind: "moss", r: 18 },
  ]);
  const [draggingItemId, setDraggingItemId] = useState<number | null>(null);
  const [strokesCount, setStrokesCount] = useState(0);

  const paintBaseSand = (canvas: HTMLCanvasElement) => {
    const { width, height, dpr } = syncCanvasDpr(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = "#F4EFE6";
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = "rgba(186, 173, 150, 0.35)";
    ctx.lineWidth = 1.5;
    for (let y = 16; y < height; y += 16) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    paintBaseSand(canvas);
    const observer = new ResizeObserver(() => {
      if (canvasRef.current) paintBaseSand(canvasRef.current);
    });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  const drawRakeCurve = (
    p0: { x: number; y: number },
    p1: { x: number; y: number },
    p2: { x: number; y: number }
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const dx = p2.x - p0.x;
    const dy = p2.y - p0.y;
    const len = Math.hypot(dx, dy);
    if (len < 1) return;

    const nx = -dy / len;
    const ny = dx / len;

    for (const offset of [-11, 0, 11]) {
      ctx.strokeStyle = "#DDD2BE";
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(p0.x + nx * offset, p0.y + ny * offset);
      ctx.quadraticCurveTo(
        p1.x + nx * offset,
        p1.y + ny * offset,
        p2.x + nx * offset,
        p2.y + ny * offset
      );
      ctx.stroke();

      ctx.strokeStyle = "#FBF8F2";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(p0.x + nx * offset - 1, p0.y + ny * offset - 1);
      ctx.quadraticCurveTo(
        p1.x + nx * offset - 1,
        p1.y + ny * offset - 1,
        p2.x + nx * offset - 1,
        p2.y + ny * offset - 1
      );
      ctx.stroke();
    }
  };

  const getLocalCssPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      rx: (e.clientX - rect.left) / rect.width,
      ry: (e.clientY - rect.top) / rect.height,
    };
  };

  const addItem = (kind: "stone" | "moss") => {
    setItems((prev) => [
      ...prev.slice(-7),
      {
        id: Date.now() + prev.length,
        x: 0.22 + ((prev.length * 0.19) % 0.56),
        y: 0.25 + ((prev.length * 0.23) % 0.5),
        kind,
        r: kind === "stone" ? 21 : 17,
      },
    ]);
  };

  return (
    <div className="space-y-4">
      <div className="relative h-[310px] w-full overflow-hidden rounded-2xl border border-[#DDD3C0] bg-[#F4EFE6] sm:h-[360px]">
        <canvas
          ref={canvasRef}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            const pos = getLocalCssPos(e);
            const rect = e.currentTarget.getBoundingClientRect();
            const hitItem = items.find((item) => {
              const ix = item.x * rect.width;
              const iy = item.y * rect.height;
              return Math.hypot(pos.x - ix, pos.y - iy) <= item.r + 8;
            });

            if (hitItem) {
              setDraggingItemId(hitItem.id);
              return;
            }

            drawingRef.current = true;
            lastPosRef.current = { x: pos.x, y: pos.y };
            midPosRef.current = { x: pos.x, y: pos.y };
            setStrokesCount((c) => c + 1);
          }}
          onPointerMove={(e) => {
            const pos = getLocalCssPos(e);
            if (draggingItemId !== null) {
              const clampedX = Math.min(0.92, Math.max(0.08, pos.rx));
              const clampedY = Math.min(0.88, Math.max(0.12, pos.ry));
              setItems((prev) =>
                prev.map((it) =>
                  it.id === draggingItemId
                    ? { ...it, x: clampedX, y: clampedY }
                    : it
                )
              );
              return;
            }
            if (!drawingRef.current || !lastPosRef.current || !midPosRef.current) return;
            const nextMid = {
              x: (lastPosRef.current.x + pos.x) / 2,
              y: (lastPosRef.current.y + pos.y) / 2,
            };
            drawRakeCurve(midPosRef.current, lastPosRef.current, nextMid);
            midPosRef.current = nextMid;
            lastPosRef.current = { x: pos.x, y: pos.y };
          }}
          onPointerUp={() => {
            drawingRef.current = false;
            lastPosRef.current = null;
            midPosRef.current = null;
            setDraggingItemId(null);
          }}
          className={`h-full w-full touch-none ${
            draggingItemId !== null ? "cursor-grabbing" : "cursor-crosshair"
          }`}
        />

        {items.map((item) => (
          <div
            key={item.id}
            style={{
              left: `${item.x * 100}%`,
              top: `${item.y * 100}%`,
              width: `${item.r * 2}px`,
              height: `${item.r * 1.65}px`,
            }}
            className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 shadow-sm transition-transform ${
              draggingItemId === item.id ? "scale-110" : ""
            } ${
              item.kind === "stone"
                ? "rounded-[48%_52%_44%_56%] bg-gradient-to-br from-[#8D99AE] to-[#5C677D]"
                : "rounded-full bg-gradient-to-br from-[#2D936C] to-[#1D6348]"
            }`}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => addItem("stone")}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-border bg-card px-3 text-xs font-semibold hover:bg-muted"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Tambah Batu
          </button>
          <button
            type="button"
            onClick={() => addItem("moss")}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-border bg-card px-3 text-xs font-semibold hover:bg-muted"
          >
            <Plus className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            Tambah Lumut
          </button>
          <button
            type="button"
            onClick={() => {
              if (canvasRef.current) paintBaseSand(canvasRef.current);
              setStrokesCount(0);
            }}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-border bg-card px-3 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            Ratakan Pasir
          </button>
        </div>

        <button
          type="button"
          onClick={() =>
            onComplete(
              `Taman Zen selesai dengan ${strokesCount} garis pola dan ${items.length} batu atau lumut.`
            )
          }
          className="min-h-[40px] rounded-xl bg-primary px-4 font-heading text-xs font-bold text-primary-foreground hover:bg-primary-dark"
        >
          Selesai & Simpan
        </button>
      </div>
    </div>
  );
}

/* ============================================================================
 * 4. OMBAK BERLALU (HiDPI ACT Urge Surfing Paper Boat, zero 60fps re-renders)
 * ========================================================================== */
export function PassingWavesGame({ onComplete }: GameCompleteProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const boatXRef = useRef(0.5);
  const targetBoatXRef = useRef(0.5);
  const wavePhaseRef = useRef<"Datang" | "Puncak" | "Mereda">("Datang");

  const [secondsLeft, setSecondsLeft] = useState(45);
  const [waveStrength, setWaveStrength] = useState<"Datang" | "Puncak" | "Mereda">("Datang");

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          onComplete("Gelombang dorongan berhasil diikuti hingga mereda dengan tenang.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        targetBoatXRef.current = Math.max(0.12, targetBoatXRef.current - 0.08);
      } else if (e.key === "ArrowRight") {
        targetBoatXRef.current = Math.min(0.88, targetBoatXRef.current + 0.08);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let dims = syncCanvasDpr(canvas);

    const observer = new ResizeObserver(() => {
      if (canvasRef.current) dims = syncCanvasDpr(canvasRef.current);
    });
    observer.observe(canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) return () => observer.disconnect();

    let rafId = 0;
    const start = performance.now();
    const wakeParticles: { x: number; y: number; life: number; r: number }[] = [];
    let lastWake = 0;

    const draw = (now: number) => {
      const t = (now - start) / 1000;
      const { width: w, height: h, dpr } = dims;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, "#FDF8EE");
      skyGrad.addColorStop(1, "#DDF2E9");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Warm sun
      ctx.fillStyle = "rgba(255, 130, 0, 0.22)";
      ctx.beginPath();
      ctx.arc(w * 0.82, h * 0.22, 34, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#EDBF45";
      ctx.beginPath();
      ctx.arc(w * 0.82, h * 0.22, 20, 0, Math.PI * 2);
      ctx.fill();

      const cycle = Math.sin(t * 0.3);
      const amp = 16 + (cycle + 1) * 14;
      const nextPhase: "Datang" | "Puncak" | "Mereda" =
        cycle > 0.45 ? "Puncak" : cycle < -0.25 ? "Mereda" : "Datang";
      if (nextPhase !== wavePhaseRef.current) {
        wavePhaseRef.current = nextPhase;
        setWaveStrength(nextPhase);
      }

      const waveY = (x: number, phaseOffset: number, base: number, ampScale: number) =>
        base + Math.sin(x * 0.015 + t * 1.9 + phaseOffset) * amp * ampScale;

      // Far wave
      ctx.fillStyle = "#7BC4A6";
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 6) {
        ctx.lineTo(x, waveY(x, 1.5, h * 0.56, 0.72));
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fill();

      // Main wave
      ctx.fillStyle = "#2D936C";
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 6) {
        ctx.lineTo(x, waveY(x, 0, h * 0.64, 1));
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fill();

      // Foam crest highlight
      ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 6) {
        const y = waveY(x, 0, h * 0.64, 1);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Smooth boat glide
      boatXRef.current += (targetBoatXRef.current - boatXRef.current) * 0.1;
      const bx = boatXRef.current * w;
      const by = waveY(bx, 0, h * 0.64, 1);
      const slope =
        (waveY(bx + 10, 0, h * 0.64, 1) - waveY(bx - 10, 0, h * 0.64, 1)) / 20;
      const angle = Math.atan(slope);

      // Gentle wake particles behind hull
      if (t - lastWake > 0.12) {
        lastWake = t;
        wakeParticles.push({ x: bx - 18, y: by + 4, life: 1, r: 4 });
      }
      for (let i = wakeParticles.length - 1; i >= 0; i--) {
        const p = wakeParticles[i];
        p.x -= 1.1;
        p.life -= 0.025;
        if (p.life <= 0) {
          wakeParticles.splice(i, 1);
          continue;
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${p.life * 0.6})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (1.4 - p.life * 0.4), 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw paper boat
      ctx.save();
      ctx.translate(bx, by - 4);
      ctx.rotate(angle);

      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.moveTo(-28, -6);
      ctx.lineTo(28, -6);
      ctx.lineTo(17, 10);
      ctx.lineTo(-17, 10);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#257B5A";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#FF8200";
      ctx.beginPath();
      ctx.moveTo(0, -36);
      ctx.lineTo(20, -8);
      ctx.lineTo(-14, -8);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      rafId = window.requestAnimationFrame(draw);
    };

    rafId = window.requestAnimationFrame(draw);
    return () => {
      window.cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  const steerBoat = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    targetBoatXRef.current = Math.min(0.88, Math.max(0.12, ratio));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-2xl bg-surface-soft px-4 py-3 text-xs">
        <span>
          Fase ombak:{" "}
          <strong className="text-brand-orange-ink">{waveStrength}</strong>
        </span>
        <span className="font-heading font-bold text-primary">
          {secondsLeft}s tersisa
        </span>
      </div>

      <div className="relative h-[290px] w-full overflow-hidden rounded-2xl border border-border sm:h-[340px]">
        <canvas
          ref={canvasRef}
          onPointerMove={steerBoat}
          onPointerDown={steerBoat}
          className="h-full w-full touch-none cursor-ew-resize"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>
          Geser kiri/kanan atau gunakan tombol panah keyboard untuk mengikuti ombak tanpa melawannya.
        </span>
        <button
          type="button"
          onClick={() => onComplete("Ombak berhasil diikuti hingga mereda.")}
          className="min-h-[40px] rounded-xl bg-primary px-4 font-heading text-xs font-bold text-primary-foreground hover:bg-primary-dark"
        >
          Selesai Sekarang
        </button>
      </div>
    </div>
  );
}

/* ============================================================================
 * 8. JEJAK TENANG (True HiDPI continuous curved path tracing)
 * ========================================================================== */
const CALM_WAYPOINTS = [
  { x: 0.14, y: 0.72 },
  { x: 0.3, y: 0.32 },
  { x: 0.5, y: 0.66 },
  { x: 0.7, y: 0.28 },
  { x: 0.86, y: 0.56 },
];

function sampleCalmCurve(t: number): { x: number; y: number } {
  // Piecewise Catmull-Rom-like smooth blend through 5 normalized points
  const scaled = t * (CALM_WAYPOINTS.length - 1);
  const idx = Math.min(CALM_WAYPOINTS.length - 2, Math.floor(scaled));
  const localT = scaled - idx;
  const p0 = CALM_WAYPOINTS[Math.max(0, idx - 1)];
  const p1 = CALM_WAYPOINTS[idx];
  const p2 = CALM_WAYPOINTS[idx + 1];
  const p3 = CALM_WAYPOINTS[Math.min(CALM_WAYPOINTS.length - 1, idx + 2)];

  const t2 = localT * localT;
  const t3 = t2 * localT;

  const interp = (a: number, b: number, c: number, d: number) =>
    0.5 *
    (2 * b +
      (-a + c) * localT +
      (2 * a - 5 * b + 4 * c - d) * t2 +
      (-a + 3 * b - 3 * c + d) * t3);

  return {
    x: interp(p0.x, p1.x, p2.x, p3.x),
    y: interp(p0.y, p1.y, p2.y, p3.y),
  };
}

export function CalmPathGame({ onComplete }: GameCompleteProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const progressRef = useRef(0);
  const tracingRef = useRef(false);
  const offPathRef = useRef(false);
  const completedRef = useRef(false);

  const [progressPct, setProgressPct] = useState(0);
  const [isOffPath, setIsOffPath] = useState(false);

  const drawPath = (canvas: HTMLCanvasElement) => {
    const { width: w, height: h, dpr } = syncCanvasDpr(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.fillStyle = "#F8FAF9";
    ctx.fillRect(0, 0, w, h);

    const steps = 120;

    // Guide ribbon
    ctx.strokeStyle = offPathRef.current ? "rgba(255, 130, 0, 0.25)" : "#DCE6E1";
    ctx.lineWidth = 22;
    ctx.lineCap = "round";
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const pt = sampleCalmCurve(i / steps);
      if (i === 0) ctx.moveTo(pt.x * w, pt.y * h);
      else ctx.lineTo(pt.x * w, pt.y * h);
    }
    ctx.stroke();

    // Dashed centerline
    ctx.save();
    ctx.strokeStyle = "#9FB7AA";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const pt = sampleCalmCurve(i / steps);
      if (i === 0) ctx.moveTo(pt.x * w, pt.y * h);
      else ctx.lineTo(pt.x * w, pt.y * h);
    }
    ctx.stroke();
    ctx.restore();

    // Active traced progress line
    if (progressRef.current > 0) {
      const maxIdx = Math.round(progressRef.current * steps);
      ctx.strokeStyle = "#2D936C";
      ctx.lineWidth = 10;
      ctx.lineCap = "round";
      ctx.beginPath();
      for (let i = 0; i <= maxIdx; i++) {
        const pt = sampleCalmCurve(i / steps);
        if (i === 0) ctx.moveTo(pt.x * w, pt.y * h);
        else ctx.lineTo(pt.x * w, pt.y * h);
      }
      ctx.stroke();
    }

    // Station nodes 1..5
    CALM_WAYPOINTS.forEach((wp, idx) => {
      const wpT = idx / (CALM_WAYPOINTS.length - 1);
      const reached = progressRef.current >= wpT - 0.02;
      ctx.fillStyle = reached ? "#257B5A" : "#FFFFFF";
      ctx.strokeStyle = reached ? "#257B5A" : "#FF8200";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(wp.x * w, wp.y * h, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = reached ? "#FFFFFF" : "#071013";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(idx + 1), wp.x * w, wp.y * h + 0.5);
    });

    // Current cursor orb on path
    const head = sampleCalmCurve(progressRef.current);
    ctx.fillStyle = "#FF8200";
    ctx.beginPath();
    ctx.arc(head.x * w, head.y * h, 9, 0, Math.PI * 2);
    ctx.fill();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawPath(canvas);
    const observer = new ResizeObserver(() => {
      if (canvasRef.current) drawPath(canvasRef.current);
    });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  const handleTrace = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || completedRef.current) return;
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    // Search forward window near current progress
    let bestT = progressRef.current;
    let bestDist = Infinity;
    const searchStart = Math.max(0, progressRef.current - 0.04);
    const searchEnd = Math.min(1, progressRef.current + 0.14);

    for (let t = searchStart; t <= searchEnd; t += 0.005) {
      const pt = sampleCalmCurve(t);
      const d = Math.hypot(px - pt.x * rect.width, py - pt.y * rect.height);
      if (d < bestDist) {
        bestDist = d;
        bestT = t;
      }
    }

    const nextOff = bestDist > 34;
    if (nextOff !== offPathRef.current) {
      offPathRef.current = nextOff;
      setIsOffPath(nextOff);
    }

    if (!nextOff && bestT > progressRef.current) {
      progressRef.current = Math.min(1, bestT);
      setProgressPct(Math.round(progressRef.current * 100));
      if (progressRef.current >= 0.97 && !completedRef.current) {
        completedRef.current = true;
        progressRef.current = 1;
        setProgressPct(100);
        drawPath(canvas);
        window.setTimeout(() => {
          onComplete("Jejak Tenang berhasil ditelusuri hingga titik akhir.");
        }, 350);
        return;
      }
    }
    drawPath(canvas);
  };

  const resetTrace = () => {
    completedRef.current = false;
    progressRef.current = 0;
    offPathRef.current = false;
    setProgressPct(0);
    setIsOffPath(false);
    if (canvasRef.current) drawPath(canvasRef.current);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-2xl bg-surface-soft px-4 py-3 text-xs">
        <span className="font-semibold text-foreground">
          {isOffPath
            ? "Sedikit di luar jalur, kembali ke titik oranye untuk melanjutkan."
            : "Ikuti jalur lengkung dari titik 1 ke 5 secara perlahan."}
        </span>
        <span className="font-heading font-bold text-primary">
          {progressPct}%
        </span>
      </div>

      <div className="relative h-[290px] w-full overflow-hidden rounded-2xl border border-border sm:h-[340px]">
        <canvas
          ref={canvasRef}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            tracingRef.current = true;
            handleTrace(e);
          }}
          onPointerMove={(e) => {
            if (!tracingRef.current) return;
            handleTrace(e);
          }}
          onPointerUp={() => {
            tracingRef.current = false;
          }}
          className="h-full w-full touch-none cursor-pointer"
        />
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Jika jari terlepas atau meleset, jalur tidak direset dan bisa diteruskan kapan saja.</span>
        <button
          type="button"
          onClick={resetTrace}
          className="inline-flex min-h-[38px] items-center gap-1 rounded-xl border border-border bg-card px-3 font-semibold hover:bg-muted"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Ulang
        </button>
      </div>
    </div>
  );
}

/* ============================================================================
 * 10. SINGKIRKAN KABUT (HiDPI + real pixel-grid coverage percentage)
 * ========================================================================== */
const FOG_GRID_COLS = 16;
const FOG_GRID_ROWS = 10;
const TOTAL_FOG_CELLS = FOG_GRID_COLS * FOG_GRID_ROWS;

export function ClearFogGame({ onComplete }: GameCompleteProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wipingRef = useRef(false);
  const clearedGridRef = useRef<Uint8Array>(new Uint8Array(TOTAL_FOG_CELLS));
  const [clearedPct, setClearedPct] = useState(0);

  const paintFog = (canvas: HTMLCanvasElement) => {
    const { width, height, dpr } = syncCanvasDpr(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, "rgba(235, 242, 239, 0.96)");
    grad.addColorStop(1, "rgba(213, 226, 220, 0.98)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    paintFog(canvas);
    const observer = new ResizeObserver(() => {
      if (canvasRef.current) paintFog(canvasRef.current);
    });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  const wipeAt = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "destination-out";
    const brushRadius = 40;
    const rad = ctx.createRadialGradient(x, y, 8, x, y, brushRadius);
    rad.addColorStop(0, "rgba(0,0,0,1)");
    rad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = rad;
    ctx.beginPath();
    ctx.arc(x, y, brushRadius, 0, Math.PI * 2);
    ctx.fill();

    // Mark real grid cells covered by brush
    const cellW = rect.width / FOG_GRID_COLS;
    const cellH = rect.height / FOG_GRID_ROWS;
    let newlyCleared = 0;

    for (let r = 0; r < FOG_GRID_ROWS; r++) {
      for (let c = 0; c < FOG_GRID_COLS; c++) {
        const idx = r * FOG_GRID_COLS + c;
        if (clearedGridRef.current[idx] === 1) continue;
        const cx = (c + 0.5) * cellW;
        const cy = (r + 0.5) * cellH;
        if (Math.hypot(x - cx, y - cy) <= brushRadius * 0.95) {
          clearedGridRef.current[idx] = 1;
          newlyCleared++;
        }
      }
    }

    if (newlyCleared > 0) {
      let total = 0;
      for (let i = 0; i < TOTAL_FOG_CELLS; i++) {
        total += clearedGridRef.current[i];
      }
      setClearedPct(Math.min(100, Math.round((total / TOTAL_FOG_CELLS) * 100)));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-2xl bg-surface-soft px-4 py-3 text-xs">
        <span>Usap area kabut untuk menampakkan pemandangan pagi</span>
        <span className="font-heading font-bold text-primary">
          {clearedPct}% tersingkap
        </span>
      </div>

      <div className="relative h-[290px] w-full overflow-hidden rounded-2xl border border-border sm:h-[340px]">
        <svg
          viewBox="0 0 600 320"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <linearGradient id="morningSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFE1BF" />
              <stop offset="60%" stopColor="#FDF6EC" />
              <stop offset="100%" stopColor="#D7EFE4" />
            </linearGradient>
          </defs>
          <rect width="600" height="320" fill="url(#morningSky)" />
          <circle cx="460" cy="82" r="38" fill="#FF8200" opacity="0.82" />
          <path d="M0 245 L130 135 L260 225 L395 115 L600 245 L600 320 L0 320 Z" fill="#5D9E82" />
          <path d="M0 270 L180 175 L340 250 L495 160 L600 235 L600 320 L0 320 Z" fill="#257B5A" />
          <path d="M0 285 L600 285 L600 320 L0 320 Z" fill="#18543D" />
        </svg>

        <canvas
          ref={canvasRef}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            wipingRef.current = true;
            wipeAt(e);
          }}
          onPointerMove={(e) => {
            if (!wipingRef.current) return;
            wipeAt(e);
          }}
          onPointerUp={() => {
            wipingRef.current = false;
          }}
          className="relative z-10 h-full w-full touch-none cursor-grab active:cursor-grabbing"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => {
            clearedGridRef.current.fill(0);
            if (canvasRef.current) paintFog(canvasRef.current);
            setClearedPct(0);
          }}
          className="inline-flex min-h-[40px] items-center gap-1 rounded-xl border border-border bg-card px-3 text-xs font-semibold hover:bg-muted"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Kabut Ulang
        </button>

        <button
          type="button"
          onClick={() =>
            onComplete(`Sebanyak ${clearedPct}% kabut pagi telah disingkirkan dengan tenang.`)
          }
          className="min-h-[40px] rounded-xl bg-primary px-5 font-heading text-xs font-bold text-primary-foreground hover:bg-primary-dark"
        >
          Selesai ({clearedPct}%)
        </button>
      </div>
    </div>
  );
}
