"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";
import {
  LUMIF_TOAST_EVENT,
  type ToastPayload,
  type ToastVariant,
} from "@/lib/toast";

type ActiveToast = Required<Pick<ToastPayload, "id" | "variant" | "title" | "durationMs">> & {
  description?: string;
};

const VARIANT_META: Record<
  ToastVariant,
  {
    icon: typeof Info;
    badgeClass: string;
    borderClass: string;
  }
> = {
  success: {
    icon: CheckCircle2,
    badgeClass: "bg-primary-light text-primary",
    borderClass: "border-primary/30",
  },
  error: {
    icon: AlertCircle,
    badgeClass: "bg-destructive/15 text-destructive",
    borderClass: "border-destructive/35",
  },
  warning: {
    icon: AlertTriangle,
    badgeClass: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
    borderClass: "border-amber-400/50",
  },
  info: {
    icon: Info,
    badgeClass: "bg-muted text-foreground",
    borderClass: "border-border",
  },
};

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ActiveToast;
  onDismiss: (id: string) => void;
}) {
  const timerRef = useRef<number | null>(null);
  const remainingRef = useRef(toast.durationMs);
  const startedAtRef = useRef(0);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    if (remainingRef.current <= 0) return;
    startedAtRef.current = Date.now();
    timerRef.current = window.setTimeout(() => {
      onDismiss(toast.id);
    }, remainingRef.current);
  }, [clearTimer, onDismiss, toast.id]);

  const pauseTimer = useCallback(() => {
    if (timerRef.current === null) return;
    const elapsed = Date.now() - startedAtRef.current;
    remainingRef.current = Math.max(400, remainingRef.current - elapsed);
    clearTimer();
  }, [clearTimer]);

  useEffect(() => {
    startTimer();
    return clearTimer;
  }, [startTimer, clearTimer]);

  const meta = VARIANT_META[toast.variant];
  const Icon = meta.icon;

  return (
    <div
      role={toast.variant === "error" ? "alert" : "status"}
      aria-live={toast.variant === "error" ? "assertive" : "polite"}
      onMouseEnter={pauseTimer}
      onMouseLeave={startTimer}
      onFocus={pauseTimer}
      onBlur={startTimer}
      className={`pointer-events-auto flex w-full items-start gap-3 rounded-2xl border bg-card/98 p-3.5 text-card-foreground shadow-lg backdrop-blur-xs animate-fadeIn ${meta.borderClass}`}
    >
      <span
        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${meta.badgeClass}`}
        aria-hidden="true"
      >
        <Icon className="h-4 w-4" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="font-heading text-xs font-bold leading-snug text-card-foreground sm:text-sm">
          {toast.title}
        </p>
        {toast.description && (
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            {toast.description}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Tutup notifikasi"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export default function ToastProvider() {
  const [toasts, setToasts] = useState<ActiveToast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  useEffect(() => {
    const onToast = (event: Event) => {
      const detail = (event as CustomEvent<ToastPayload>).detail;
      if (!detail || !detail.title) return;

      const next: ActiveToast = {
        id: detail.id ?? `${Date.now()}`,
        variant: detail.variant ?? "info",
        title: detail.title,
        description: detail.description,
        durationMs: detail.durationMs ?? 4500,
      };

      setToasts((prev) => {
        const deduped = prev.filter((item) => item.title !== next.title);
        return [next, ...deduped].slice(0, 4);
      });
    };

    window.addEventListener(LUMIF_TOAST_EVENT, onToast);
    return () => window.removeEventListener(LUMIF_TOAST_EVENT, onToast);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-label="Notifikasi aplikasi"
      className="pointer-events-none fixed inset-x-3 top-3 z-[11000] flex flex-col gap-2 sm:inset-x-auto sm:right-4 sm:top-4 sm:w-[360px]"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
      ))}
    </div>
  );
}
