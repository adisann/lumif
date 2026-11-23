export type ToastVariant = "success" | "error" | "warning" | "info";

export type ToastPayload = {
  id?: string;
  variant?: ToastVariant;
  title: string;
  description?: string;
  durationMs?: number;
};

export const LUMIF_TOAST_EVENT = "lumif:toast";

function dispatchToast(payload: ToastPayload) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<ToastPayload>(LUMIF_TOAST_EVENT, {
      detail: {
        id: payload.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        variant: payload.variant ?? "info",
        title: payload.title,
        description: payload.description,
        durationMs: payload.durationMs ?? 4500,
      },
    })
  );
}

export const lumifToast = {
  show: (payload: ToastPayload) => dispatchToast(payload),
  success: (title: string, description?: string, durationMs = 4200) =>
    dispatchToast({ variant: "success", title, description, durationMs }),
  error: (title: string, description?: string, durationMs = 5500) =>
    dispatchToast({ variant: "error", title, description, durationMs }),
  warning: (title: string, description?: string, durationMs = 5000) =>
    dispatchToast({ variant: "warning", title, description, durationMs }),
  info: (title: string, description?: string, durationMs = 4200) =>
    dispatchToast({ variant: "info", title, description, durationMs }),
};
