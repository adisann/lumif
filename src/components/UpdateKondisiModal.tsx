"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Check,
  CheckCircle2,
  CloudRain,
  Loader2,
  Plus,
  RotateCcw,
  Sprout,
  Wind,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { awardPetXp } from "@/lib/pets";
import { notifyUserDataUpdated } from "@/lib/userCache";

interface UpdateKondisiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ConditionId = "stable" | "urge" | "heavy" | "fallen";

type MainCondition = {
  id: ConditionId;
  label: string;
  description: string;
  empathyLine: string;
  completionTitle: string;
  completionBody: string;
  icon: LucideIcon;
  tone: "emerald" | "amber" | "orange";
  moodScore: number;
  urgeScore: number;
  energyScore: number;
};

const MAIN_CONDITIONS: MainCondition[] = [
  {
    id: "stable",
    label: "Cukup Stabil",
    description: "Pikiran cukup tenang dan kendali diri terjaga.",
    empathyLine: "Senang mendengarnya. Momen tenang seperti ini layak dicatat sebagai jangkar harian.",
    completionTitle: "Check-in tersimpan",
    completionBody:
      "Terima kasih sudah meluangkan waktu menyapa dirimu hari ini. Jaga ritme pelan yang nyaman untukmu.",
    icon: Sprout,
    tone: "emerald",
    moodScore: 8,
    urgeScore: 2,
    energyScore: 7,
  },
  {
    id: "urge",
    label: "Ada Dorongan",
    description: "Muncul keinginan, tetapi aku masih sadar penuh.",
    empathyLine: "Menyadari dorongan sebelum bereaksi adalah tanda kendali diri yang nyata.",
    completionTitle: "Terima kasih sudah jujur jeda",
    completionBody:
      "Kamu tidak harus melawan dorongan sendirian. Mengakui kemunculannya saja sudah memberi ruang untuk memilih langkah berikutnya.",
    icon: Zap,
    tone: "amber",
    moodScore: 6,
    urgeScore: 7,
    energyScore: 5,
  },
  {
    id: "heavy",
    label: "Lagi Berat",
    description: "Hari terasa melelahkan dan energiku menipis.",
    empathyLine: "Tidak apa-apa jika hari ini terasa berat. Kamu tidak wajib selalu merasa baik-baik saja.",
    completionTitle: "Check-in diterima dengan hangat",
    completionBody:
      "Di hari yang melelahkan, bertahan selangkah demi selangkah sudah cukup. Beri dirimu izin untuk beristirahat sejenak.",
    icon: CloudRain,
    tone: "orange",
    moodScore: 4,
    urgeScore: 8,
    energyScore: 3,
  },
  {
    id: "fallen",
    label: "Butuh Reset",
    description: "Sempat terpeleset, dan sekarang mau mulai lagi.",
    empathyLine: "Satu kejadian tidak menghapus seluruh usahamu. Kita mulai lagi dari titik ini pelan-pelan.",
    completionTitle: "Langkah baru sudah tercatat",
    completionBody:
      "Terima kasih sudah tetap hadir dan tidak menghilang saat keadaan sulit. Bangkit dengan tenang jauh lebih berarti daripada kesempurnaan.",
    icon: RotateCcw,
    tone: "orange",
    moodScore: 3,
    urgeScore: 9,
    energyScore: 2,
  },
];

const FEELING_OPTIONS: string[] = [
  "Tenang",
  "Lega",
  "Stres",
  "Bosan",
  "Kesepian",
  "Capek",
  "Overthinking",
  "Larut malam",
];

function getToneClasses(tone: MainCondition["tone"], isSelected: boolean) {
  if (!isSelected) {
    return {
      card: "border-border bg-surface-soft/50 hover:border-foreground/20 hover:bg-surface-soft",
      iconWrap: "bg-card text-muted-foreground border border-border/70",
      radio: "border-border bg-card",
    };
  }
  if (tone === "emerald") {
    return {
      card: "border-primary bg-primary-light/70 shadow-xs",
      iconWrap: "bg-primary text-primary-foreground border border-primary",
      radio: "border-primary bg-primary text-primary-foreground",
    };
  }
  if (tone === "amber") {
    return {
      card: "border-[#EDBF45] bg-[#FEF9E6] dark:bg-amber-950/30 shadow-xs",
      iconWrap: "bg-[#EDBF45] text-[#071013] border border-[#EDBF45]",
      radio: "border-[#EDBF45] bg-[#EDBF45] text-[#071013]",
    };
  }
  return {
    card: "border-[#FF8200] bg-[#FFF5EA] dark:bg-orange-950/30 shadow-xs",
    iconWrap: "bg-[#FF8200] text-white border border-[#FF8200]",
    radio: "border-[#FF8200] bg-[#FF8200] text-white",
  };
}

export default function UpdateKondisiModal({
  isOpen,
  onClose,
}: UpdateKondisiModalProps) {
  const supabase = useMemo(() => createClient(), []);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isSavingRef = useRef(false);

  const [selectedCondition, setSelectedCondition] = useState<ConditionId | null>(
    null
  );
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const selectedConditionData = MAIN_CONDITIONS.find(
    (condition) => condition.id === selectedCondition
  );

  const resetFormState = useCallback(() => {
    setSelectedCondition(null);
    setSelectedFeelings([]);
    setShowNoteInput(false);
    setNote("");
    setErrorMessage("");
    setIsCompleted(false);
    setIsSaving(false);
  }, []);

  const handleClose = useCallback(() => {
    if (isSaving) return;
    resetFormState();
    onClose();
  }, [isSaving, onClose, resetFormState]);

  const toggleFeeling = (feeling: string) => {
    setSelectedFeelings((prev) =>
      prev.includes(feeling)
        ? prev.filter((item) => item !== feeling)
        : [...prev, feeling]
    );
  };

  const handleConditionKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    idx: number
  ) => {
    let nextIdx: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      nextIdx = (idx + 1) % MAIN_CONDITIONS.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      nextIdx = (idx - 1 + MAIN_CONDITIONS.length) % MAIN_CONDITIONS.length;
    }
    if (nextIdx === null) return;

    e.preventDefault();
    const target = MAIN_CONDITIONS[nextIdx];
    setSelectedCondition(target.id);
    setErrorMessage("");

    const radioButtons =
      dialogRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]');
    radioButtons?.[nextIdx]?.focus();
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!selectedConditionData) {
      setErrorMessage("Pilih kondisi yang paling mendekati keadaanmu saat ini.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        awardPetXp(25);
        setIsSaving(false);
        setIsCompleted(true);
        return;
      }

      const checkinNote = JSON.stringify({
        condition_id: selectedConditionData.id,
        condition_label: selectedConditionData.label,
        feelings: selectedFeelings,
        user_note: note.trim(),
      });

      const { error } = await supabase.from("checkins").insert({
        user_id: user.id,
        mood_score: selectedConditionData.moodScore,
        urge_score: selectedConditionData.urgeScore,
        energy_score: selectedConditionData.energyScore,
        note: checkinNote,
      });

      setIsSaving(false);

      if (error) {
        console.error("Gagal menyimpan checkin:", error);
        setErrorMessage("Belum berhasil menyimpan check-in. Coba sekali lagi.");
        return;
      }

      notifyUserDataUpdated(user.id);
      awardPetXp(25);
      setIsCompleted(true);
    } catch (err) {
      console.warn("Supabase checkins offline fallback:", err);
      awardPetXp(25);
      setIsSaving(false);
      setIsCompleted(true);
    }
  };

  useEffect(() => {
    isSavingRef.current = isSaving;
  }, [isSaving]);

  useEffect(() => {
    if (!isOpen) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const timer = window.setTimeout(() => {
      const firstRadio = dialogRef.current?.querySelector<HTMLButtonElement>(
        '[role="radio"]'
      );
      firstRadio?.focus();
    }, 20);

    return () => {
      window.clearTimeout(timer);
      previousFocusRef.current?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSavingRef.current) {
        handleClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const needsGroundingSuggestion =
    selectedCondition === "urge" ||
    selectedCondition === "heavy" ||
    selectedCondition === "fallen";

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/50 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isSaving) {
          handleClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="update-kondisi-title"
        aria-describedby="update-kondisi-desc"
        className="flex max-h-[92dvh] w-full max-w-[540px] flex-col overflow-hidden rounded-t-3xl border border-border bg-card text-card-foreground shadow-2xl animate-slideUp sm:rounded-3xl sm:animate-fadeIn"
      >
        {/* Header */}
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border/80 px-5 pb-4 pt-5 sm:px-6">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wide text-primary">
              Check-in Harian
            </p>
            <h2
              id="update-kondisi-title"
              className="mt-0.5 font-heading text-xl font-bold tracking-tight text-foreground"
            >
              {isCompleted
                ? selectedConditionData?.completionTitle ?? "Check-in tersimpan"
                : "Bagaimana kabarmu saat ini?"}
            </h2>
            {!isCompleted && (
              <p
                id="update-kondisi-desc"
                className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm"
              >
                Tidak perlu terlihat baik-baik saja. Pilih yang paling jujur menggambarkan kondisimu.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSaving}
            aria-label="Tutup dialog check-in harian"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-soft/70 text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        {isCompleted ? (
          <div className="flex flex-col items-start px-5 py-6 sm:px-6 sm:py-7">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary">
              <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
            </div>

            <p
              id="update-kondisi-desc"
              className="mt-4 text-sm leading-relaxed text-foreground/90 sm:text-[15px]"
            >
              {selectedConditionData?.completionBody}
            </p>

            {selectedFeelings.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {selectedFeelings.map((item) => (
                  <span
                    key={item}
                    className="rounded-lg bg-surface-soft px-2.5 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-6 flex w-full flex-col-reverse gap-2.5 sm:flex-row sm:items-center sm:justify-end">
              {needsGroundingSuggestion && (
                <Link
                  href="/exercises/breathing"
                  onClick={handleClose}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-border bg-surface-soft px-4 font-heading text-xs font-bold text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:text-sm"
                >
                  <Wind className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span>Latihan Napas 2 Menit</span>
                </Link>
              )}

              <Button
                type="button"
                onClick={handleClose}
                className="min-h-[44px] rounded-xl bg-primary px-6 font-heading text-sm font-bold text-primary-foreground hover:bg-primary-dark"
              >
                Selesai
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
              {errorMessage && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
                >
                  {errorMessage}
                </div>
              )}

              {/* Step 1: Primary Condition */}
              <fieldset>
                <div className="mb-2.5 flex items-baseline justify-between gap-2">
                  <legend className="font-heading text-sm font-bold text-foreground">
                    1. Kondisi utama
                  </legend>
                  <span className="text-[11px] font-medium text-muted-foreground">
                    Pilih satu
                  </span>
                </div>

                <div
                  role="radiogroup"
                  aria-label="Kondisi utama saat ini"
                  className="grid grid-cols-1 gap-2.5 sm:grid-cols-2"
                >
                  {MAIN_CONDITIONS.map((condition, idx) => {
                    const isSelected = selectedCondition === condition.id;
                    const Icon = condition.icon;
                    const tone = getToneClasses(condition.tone, isSelected);

                    return (
                      <button
                        key={condition.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => {
                          setSelectedCondition(condition.id);
                          setErrorMessage("");
                        }}
                        onKeyDown={(e) => handleConditionKeyDown(e, idx)}
                        className={`group flex min-h-[76px] items-start gap-3 rounded-2xl border p-3.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.99] ${tone.card}`}
                      >
                        <span
                          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${tone.iconWrap}`}
                        >
                          <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-heading text-sm font-bold text-foreground">
                              {condition.label}
                            </span>
                            <span
                              aria-hidden="true"
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${tone.radio}`}
                            >
                              {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                            {condition.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {selectedConditionData && (
                  <p className="mt-2.5 rounded-xl bg-surface-soft px-3.5 py-2.5 text-xs leading-relaxed text-foreground/85">
                    {selectedConditionData.empathyLine}
                  </p>
                )}
              </fieldset>

              {/* Step 2: Feelings */}
              <section aria-labelledby="feelings-label">
                <div className="mb-2.5 flex items-baseline justify-between gap-2">
                  <h3
                    id="feelings-label"
                    className="font-heading text-sm font-bold text-foreground"
                  >
                    2. Apa yang sedang terasa?
                  </h3>
                  <span className="text-[11px] font-medium text-muted-foreground">
                    Opsional · boleh lebih dari satu
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {FEELING_OPTIONS.map((feeling) => {
                    const isSelected = selectedFeelings.includes(feeling);

                    return (
                      <button
                        key={feeling}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => toggleFeeling(feeling)}
                        className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-95 ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card text-foreground/85 hover:bg-surface-soft"
                        }`}
                      >
                        {isSelected && (
                          <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        )}
                        <span>{feeling}</span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Step 3: Compact Optional Note */}
              <section>
                {showNoteInput || note.length > 0 ? (
                  <label className="block">
                    <span className="mb-1.5 flex items-center justify-between text-xs font-bold text-foreground">
                      <span>3. Catatan singkat</span>
                      <span className="font-normal text-muted-foreground">
                        Opsional
                      </span>
                    </span>
                    <textarea
                      ref={textareaRef}
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                      rows={2}
                      placeholder="Satu kalimat saja cukup, misalnya pemicu atau hal kecil yang membantu..."
                      className="min-h-[72px] w-full resize-none rounded-xl border border-input bg-surface-soft/60 px-3.5 py-2.5 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-card focus:outline-none"
                    />
                  </label>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setShowNoteInput(true);
                      window.requestAnimationFrame(() => textareaRef.current?.focus());
                    }}
                    className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border border-dashed border-border px-3.5 text-xs font-semibold text-muted-foreground transition hover:border-primary/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Tambah catatan singkat (opsional)</span>
                  </button>
                )}
              </section>
            </div>

            {/* Footer Actions */}
            <footer className="flex shrink-0 items-center justify-end gap-2.5 border-t border-border/80 bg-card px-5 pb-[calc(16px+env(safe-area-inset-bottom))] pt-3.5 sm:px-6 sm:pb-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSaving}
                className="min-h-[44px] rounded-xl px-4 font-heading text-xs font-bold sm:text-sm"
              >
                Nanti saja
              </Button>

              <Button
                type="submit"
                disabled={!selectedCondition || isSaving}
                className="min-h-[44px] flex-1 rounded-xl bg-primary px-5 font-heading text-xs font-bold text-primary-foreground hover:bg-primary-dark disabled:opacity-50 sm:flex-none sm:text-sm"
              >
                {isSaving ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    <span>Menyimpan...</span>
                  </span>
                ) : (
                  "Simpan Check-in"
                )}
              </Button>
            </footer>
          </form>
        )}
      </div>
    </div>
  );
}
