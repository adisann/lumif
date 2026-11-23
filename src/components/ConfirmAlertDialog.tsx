"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
} from "lucide-react";

export type ConfirmAlertVariant = "warning" | "danger" | "info" | "success";

type ConfirmAlertDialogProps = {
  open: boolean;
  variant?: ConfirmAlertVariant;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  hideCancel?: boolean;
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
};

const ICON_MAP: Record<
  ConfirmAlertVariant,
  {
    icon: typeof AlertTriangle;
    wrapClass: string;
    buttonClass: string;
  }
> = {
  warning: {
    icon: AlertTriangle,
    wrapClass: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
    buttonClass: "bg-primary text-primary-foreground hover:bg-primary-dark",
  },
  danger: {
    icon: AlertCircle,
    wrapClass: "bg-destructive/15 text-destructive",
    buttonClass: "bg-[#D82C1C] text-white hover:bg-[#B92214]",
  },
  info: {
    icon: Info,
    wrapClass: "bg-primary-light text-primary",
    buttonClass: "bg-primary text-primary-foreground hover:bg-primary-dark",
  },
  success: {
    icon: CheckCircle2,
    wrapClass: "bg-primary-light text-primary",
    buttonClass: "bg-primary text-primary-foreground hover:bg-primary-dark",
  },
};

/** SweetAlert-style centered confirmation / feedback modal built on Base UI AlertDialog. */
export default function ConfirmAlertDialog({
  open,
  variant = "warning",
  title,
  description,
  confirmLabel = "Ya, Lanjutkan",
  cancelLabel = "Batal",
  hideCancel = false,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmAlertDialogProps) {
  const meta = ICON_MAP[variant];
  const Icon = meta.icon;

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !isLoading) onCancel();
      }}
    >
      <AlertDialogContent>
        <div className="flex flex-col items-center text-center">
          <div
            className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${meta.wrapClass}`}
            aria-hidden="true"
          >
            <Icon className="h-7 w-7" />
          </div>

          <AlertDialogTitle className="font-heading text-lg font-bold text-card-foreground">
            {title}
          </AlertDialogTitle>

          <AlertDialogDescription className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
            {description}
          </AlertDialogDescription>

          <div
            className={`mt-6 flex w-full gap-2.5 ${
              hideCancel ? "justify-center" : "flex-col sm:flex-row"
            }`}
          >
            {!hideCancel && (
              <button
                type="button"
                disabled={isLoading}
                onClick={onCancel}
                className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl border border-border bg-card px-4 font-heading text-xs font-bold text-foreground transition hover:bg-muted disabled:opacity-50"
              >
                {cancelLabel}
              </button>
            )}
            <button
              type="button"
              disabled={isLoading}
              onClick={() => void onConfirm()}
              className={`flex min-h-[44px] flex-1 items-center justify-center rounded-xl px-4 font-heading text-xs font-bold transition disabled:opacity-50 ${meta.buttonClass}`}
            >
              {isLoading ? "Memproses..." : confirmLabel}
            </button>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
