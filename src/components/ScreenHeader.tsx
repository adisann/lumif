"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showBack?: boolean;
  rightAction?: React.ReactNode;
  className?: string;
};

export default function ScreenHeader({
  title,
  subtitle,
  onBack,
  showBack = true,
  rightAction,
  className,
}: ScreenHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/home");
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex shrink-0 items-center justify-between border-b border-border/70 bg-card/95 px-4 py-3.5 backdrop-blur-md md:px-8 md:py-4",
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          {showBack && (
            <button
              type="button"
              onClick={handleBack}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-xs transition hover:bg-muted active:scale-95"
              aria-label="Kembali"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            </button>
          )}

          <div className="min-w-0">
            <h1 className="truncate font-heading text-lg font-bold tracking-tight text-foreground md:text-xl">
              {title}
            </h1>
            {subtitle && (
              <p className="truncate text-xs font-normal text-muted-foreground md:text-sm">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {rightAction && <div className="flex shrink-0 items-center">{rightAction}</div>}
      </div>
    </header>
  );
}
