import Image from "next/image";
import { cn } from "@/lib/utils";

export type LumifLogoSize = "xs" | "sm" | "md" | "lg" | "xl";
export type LumifLogoVariant = "full" | "mark";

const FULL_SIZE_MAP: Record<LumifLogoSize, { width: number; height: number }> = {
  xs: { width: 34, height: 42 },
  sm: { width: 42, height: 52 },
  md: { width: 72, height: 88 },
  lg: { width: 96, height: 118 },
  xl: { width: 132, height: 162 },
};

const MARK_SIZE_MAP: Record<LumifLogoSize, { width: number; height: number }> = {
  xs: { width: 32, height: 32 },
  sm: { width: 38, height: 38 },
  md: { width: 56, height: 56 },
  lg: { width: 72, height: 72 },
  xl: { width: 96, height: 96 },
};

type LumifLogoProps = {
  size?: LumifLogoSize;
  variant?: LumifLogoVariant;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
};

export default function LumifLogo({
  size = "md",
  variant = "full",
  width,
  height,
  priority = false,
  className,
}: LumifLogoProps) {
  const dims = variant === "mark" ? MARK_SIZE_MAP[size] : FULL_SIZE_MAP[size];
  const finalWidth = width ?? dims.width;
  const finalHeight = height ?? dims.height;

  return (
    <Image
      src={variant === "mark" ? "/assets/lumif-mark.png" : "/assets/lumif-logo.png"}
      alt="Lumif Logo"
      width={finalWidth}
      height={finalHeight}
      priority={priority}
      unoptimized
      className={cn("shrink-0 object-contain select-none", className)}
    />
  );
}
