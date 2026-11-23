"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getPetSpecies, type PetSpeciesId } from "@/lib/pets";
import { CheckCircle2, Coins, Sparkles } from "lucide-react";

type PetPurchaseConfirmDialogProps = {
  petId: PetSpeciesId | null;
  currentCoins: number;
  purchasedSuccess?: boolean;
  onCancel: () => void;
  onConfirm: (petId: PetSpeciesId) => void;
  onDoneAfterPurchase?: () => void;
  doneButtonLabel?: string;
};

/** Modern centered confirmation & celebration dialog before spending coins on a pet. */
export default function PetPurchaseConfirmDialog({
  petId,
  currentCoins,
  purchasedSuccess = false,
  onCancel,
  onConfirm,
  onDoneAfterPurchase,
  doneButtonLabel = "Lihat di Rumah Pet",
}: PetPurchaseConfirmDialogProps) {
  const pet = petId ? getPetSpecies(petId) : null;
  const remainingCoins = pet ? Math.max(0, currentCoins - pet.unlockCost) : currentCoins;

  return (
    <AlertDialog
      open={Boolean(petId)}
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      <AlertDialogContent>
        {pet && (
          <div className="flex flex-col items-center text-center">
            {purchasedSuccess ? (
              <>
                <div className="animate-streak-pop mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-light text-primary ring-4 ring-primary/15">
                  <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
                </div>

                <AlertDialogTitle>
                  {pet.name} Berhasil Dibuka!
                </AlertDialogTitle>

                <AlertDialogDescription className="mt-2">
                  {pet.defaultNickname} ({pet.name}) kini bergabung sebagai pendamping barumu. Sisa saldo saat ini{" "}
                  <strong className="text-foreground">{currentCoins} Koin</strong>.
                </AlertDialogDescription>

                <div className="mt-6 flex w-full flex-col-reverse gap-2.5 sm:flex-row">
                  <button
                    type="button"
                    onClick={onCancel}
                    className="min-h-[44px] flex-1 rounded-xl border border-border bg-card px-4 font-heading text-xs font-bold text-foreground transition hover:bg-muted"
                  >
                    Tutup
                  </button>
                  {onDoneAfterPurchase && (
                    <button
                      type="button"
                      onClick={onDoneAfterPurchase}
                      className="min-h-[44px] flex-1 rounded-xl bg-primary px-4 font-heading text-xs font-bold text-primary-foreground transition hover:bg-primary-dark"
                    >
                      {doneButtonLabel}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <div
                  className="animate-streak-pop mb-4 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white shadow-md dark:border-card"
                  style={{
                    backgroundColor: `${pet.swatchHex}26`,
                    boxShadow: `0 8px 24px ${pet.swatchHex}40`,
                  }}
                >
                  <Sparkles
                    className="h-7 w-7"
                    style={{ color: pet.swatchHex }}
                    aria-hidden="true"
                  />
                </div>

                <AlertDialogTitle>
                  Buka {pet.name}?
                </AlertDialogTitle>

                <AlertDialogDescription className="mt-1.5">
                  {pet.tagline}
                  {pet.hasEvolution
                    ? ` Termasuk tahap evolusi ${pet.stages.egg.stageLabel}, ${pet.stages.baby.stageLabel}, hingga ${pet.stages.adult.stageLabel}.`
                    : ""}
                </AlertDialogDescription>

                {/* Coin Breakdown Card */}
                <div className="mt-4 w-full space-y-2 rounded-2xl border border-border bg-surface-soft/80 p-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Saldo Koin saat ini</span>
                    <span className="inline-flex items-center gap-1 font-bold text-foreground">
                      <Coins className="h-3.5 w-3.5 text-[#CC6500]" aria-hidden="true" />
                      {currentCoins} Koin
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Biaya membuka pet</span>
                    <span className="font-bold text-brand-orange-ink">
                      -{pet.unlockCost} Koin
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-2">
                    <span className="font-semibold text-foreground">Sisa saldo nanti</span>
                    <span className="font-heading text-sm font-bold text-primary">
                      {remainingCoins} Koin
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex w-full flex-col-reverse gap-2.5 sm:flex-row">
                  <button
                    type="button"
                    onClick={onCancel}
                    className="min-h-[44px] flex-1 rounded-xl border border-border bg-card px-4 font-heading text-xs font-bold text-foreground transition hover:bg-muted"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={() => onConfirm(pet.id)}
                    className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 font-heading text-xs font-bold text-primary-foreground shadow-xs transition hover:bg-primary-dark active:scale-[0.99]"
                  >
                    <Coins className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Ya, Buka ({pet.unlockCost} Koin)</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
