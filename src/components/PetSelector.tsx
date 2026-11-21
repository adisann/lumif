"use client";

import {
  PET_SPECIES,
  type PetCategory,
  type PetSpeciesId,
} from "@/lib/pets";
import { Check, Coins, Lock } from "lucide-react";

type PetSelectorProps = {
  selectedId: PetSpeciesId;
  nickname: string;
  unlockedSpecies?: PetSpeciesId[];
  coins?: number;
  allowUnlock?: boolean;
  unlockNotice?: string;
  onSelectSpecies: (id: PetSpeciesId, defaultNickname: string) => void;
  onUnlockSpecies?: (id: PetSpeciesId) => void;
  onChangeNickname: (value: string) => void;
};

const CATEGORY_SECTIONS: { key: PetCategory; title: string }[] = [
  { key: "starter", title: "Teman Dasar" },
  { key: "hewan", title: "Kupu-kupu, Rusa & Kuda" },
  { key: "unik", title: "Hewan Unik" },
  { key: "naga", title: "Naga Evolusi (Telur · Baby · Dewasa)" },
];

export default function PetSelector({
  selectedId,
  nickname,
  unlockedSpecies = ["duck"],
  coins = 0,
  allowUnlock = false,
  unlockNotice = "",
  onSelectSpecies,
  onUnlockSpecies,
  onChangeNickname,
}: PetSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold text-card-foreground">
            Pilih Pet Pendamping
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Mulai dengan hewan lucu, lalu kumpulkan Koin dari misi dan streak untuk membuka pet baru.
          </p>
        </div>

        {allowUnlock && (
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <Coins className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span>{coins} Koin</span>
          </div>
        )}
      </div>

      {unlockNotice && (
        <div
          role="status"
          className="rounded-xl border border-primary/25 bg-primary-light px-3 py-2 text-xs font-semibold text-foreground"
        >
          {unlockNotice}
        </div>
      )}

      <div className="max-h-[290px] space-y-4 overflow-y-auto pr-1">
        {CATEGORY_SECTIONS.map((section) => {
          const items = PET_SPECIES.filter((p) => p.category === section.key);
          if (items.length === 0) return null;

          return (
            <div key={section.key} className="space-y-2">
              <p className="text-[11px] font-bold text-muted-foreground">
                {section.title}
              </p>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {items.map((pet) => {
                  const isUnlocked = unlockedSpecies.includes(pet.id);
                  const isSelected = selectedId === pet.id;
                  const canAfford = coins >= pet.unlockCost;

                  return (
                    <button
                      key={pet.id}
                      type="button"
                      disabled={!isUnlocked && (!allowUnlock || !canAfford)}
                      onClick={() => {
                        if (isUnlocked) {
                          onSelectSpecies(pet.id, pet.defaultNickname);
                        } else if (allowUnlock && onUnlockSpecies) {
                          onUnlockSpecies(pet.id);
                        }
                      }}
                      aria-pressed={isSelected}
                      className={`flex min-h-[68px] items-start justify-between gap-2 rounded-xl border p-3 text-left transition-colors ${
                        isSelected
                          ? "border-primary bg-primary-light"
                          : isUnlocked
                            ? "border-border bg-surface-soft hover:border-primary/40"
                            : allowUnlock && canAfford
                              ? "border-amber-400/70 bg-amber-50/70 hover:bg-amber-100/60 dark:bg-amber-950/20"
                              : "border-border/60 bg-muted/40 opacity-75"
                      }`}
                    >
                      <div className="flex min-w-0 items-start gap-2.5">
                        <span
                          className="mt-0.5 h-5 w-5 shrink-0 rounded-full border border-black/10"
                          style={{ backgroundColor: pet.swatchHex }}
                          aria-hidden="true"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-heading text-xs font-bold text-foreground">
                            {pet.name}
                          </p>
                          <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                            {isUnlocked
                              ? pet.hasEvolution
                                ? `${pet.stages.egg.stageLabel} · ${pet.stages.baby.stageLabel} · ${pet.stages.adult.stageLabel}`
                                : pet.categoryLabel
                              : `Butuh ${pet.unlockCost} Koin`}
                          </p>
                        </div>
                      </div>

                      {isSelected ? (
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check className="h-3 w-3" aria-hidden="true" />
                        </span>
                      ) : !isUnlocked ? (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-card px-2 py-0.5 text-[10px] font-bold text-foreground">
                          <Lock className="h-3 w-3" aria-hidden="true" />
                          {pet.unlockCost}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-card-foreground">
          Nama panggilan pet
        </span>
        <input
          type="text"
          value={nickname}
          onChange={(e) => onChangeNickname(e.target.value)}
          maxLength={24}
          placeholder="Contoh: Kwek"
          className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground"
        />
      </label>
    </div>
  );
}
