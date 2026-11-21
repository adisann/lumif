"use client";

import { useId } from "react";

type StreakFlameProps = {
  active?: boolean;
  size?: "sm" | "md" | "lg";
  showSparks?: boolean;
  className?: string;
};

const SIZE_MAP = {
  sm: { box: "h-5 w-5", svg: "h-4 w-4", glow: "h-5 w-5" },
  md: { box: "h-8 w-8", svg: "h-6 w-6", glow: "h-8 w-8" },
  lg: { box: "h-12 w-12", svg: "h-9 w-9", glow: "h-11 w-11" },
};

/** Animated Duolingo-style flame icon representing an active daily streak. */
export default function StreakFlame({
  active = true,
  size = "sm",
  showSparks = true,
  className = "",
}: StreakFlameProps) {
  const uid = useId().replace(/:/g, "");
  const outerGradId = `lumif-flame-outer-${uid}`;
  const innerGradId = `lumif-flame-inner-${uid}`;
  const dims = SIZE_MAP[size];

  if (!active) {
    return (
      <span
        className={`relative inline-flex shrink-0 items-center justify-center ${dims.box} ${className}`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" className={`${dims.svg} text-current opacity-65`} fill="none">
          <path
            d="M12.3 2.5C12.3 2.5 17.5 6.8 17.5 12.2C17.5 16.5 14.9 20 12 20C9.1 20 6.5 16.5 6.5 12.2C6.5 9.8 7.5 7.9 8.7 6.5C8.9 8.1 9.8 9.2 10.6 9.6C10.2 6.8 11.4 4.2 12.3 2.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center ${dims.box} ${className}`}
      aria-hidden="true"
    >
      {/* Ambient radial fire glow */}
      <span
        className={`animate-streak-glow pointer-events-none absolute rounded-full bg-gradient-to-t from-[#FF8200]/55 via-[#EDBF45]/60 to-[#FFF3B0]/40 blur-[5px] ${dims.glow}`}
      />

      {/* Rising sparks */}
      {showSparks && (
        <>
          <span className="animate-streak-spark-1 pointer-events-none absolute -top-0.5 left-1 h-1 w-1 rounded-full bg-[#EDBF45] shadow-[0_0_4px_#FF8200]" />
          <span className="animate-streak-spark-2 pointer-events-none absolute -top-1 right-1 h-1 w-1 rounded-full bg-[#FF8200] shadow-[0_0_4px_#EDBF45]" />
          <span className="animate-streak-spark-3 pointer-events-none absolute -right-0.5 top-1.5 h-0.5 w-0.5 rounded-full bg-[#FFF3B0]" />
        </>
      )}

      {/* Animated layered SVG flame */}
      <svg viewBox="0 0 24 24" className={`relative z-10 ${dims.svg} drop-shadow-[0_1px_4px_rgba(255,130,0,0.45)]`}>
        <defs>
          <linearGradient id={outerGradId} x1="12" y1="2" x2="12" y2="21" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFE169" />
            <stop offset="52%" stopColor="#FF9E1B" />
            <stop offset="100%" stopColor="#FF6B00" />
          </linearGradient>
          <linearGradient id={innerGradId} x1="12" y1="9" x2="12" y2="19.5" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFBE0" />
            <stop offset="65%" stopColor="#EDBF45" />
            <stop offset="100%" stopColor="#FF9E1B" />
          </linearGradient>
        </defs>

        <path
          className="animate-streak-flame"
          d="M12.4 2.2C12.4 2.2 18.2 6.8 18.2 12.6C18.2 17.2 15.2 21 12 21C8.8 21 5.8 17.2 5.8 12.6C5.8 9.9 7 7.8 8.3 6.3C8.5 8.1 9.5 9.3 10.4 9.7C9.9 6.7 11.3 3.9 12.4 2.2Z"
          fill={`url(#${outerGradId})`}
        />
        <path
          className="animate-streak-core"
          d="M12.2 9.4C12.2 9.4 15.1 11.8 15.1 14.8C15.1 17.3 13.7 19.3 12 19.3C10.3 19.3 8.9 17.3 8.9 14.8C8.9 13.2 9.7 11.9 10.6 11.1C10.7 12.1 11.2 12.8 11.8 13C11.5 11.5 11.8 10.2 12.2 9.4Z"
          fill={`url(#${innerGradId})`}
        />
      </svg>
    </span>
  );
}
