import { ArrowLeft } from "lucide-react";

export default function TopNav({
  onSkip,
  onBack,
  skipText = "Lewati",
}: {
  onSkip?: () => void;
  onBack?: () => void;
  skipText?: string;
}) {
  return (
    <div className="relative z-10 flex w-full items-center justify-between px-6 pt-3">
      <button
        type="button"
        onClick={onBack}
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white shadow-xs transition hover:bg-muted active:scale-95"
        aria-label="Kembali"
      >
        <ArrowLeft className="h-5 w-5 text-foreground" />
      </button>

      {onSkip && (
        <button
          type="button"
          onClick={onSkip}
          className="text-sm font-semibold text-muted-foreground transition hover:text-foreground"
        >
          {skipText}
        </button>
      )}
    </div>
  );
}
