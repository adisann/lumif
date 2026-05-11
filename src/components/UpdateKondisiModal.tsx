"use client";

import { useMemo, useState } from "react";
import { X, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface UpdateKondisiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ConditionId = "stable" | "urge" | "heavy" | "fallen";

type MainCondition = {
  id: ConditionId;
  label: string;
  emoji: string;
  description: string;
  color: string;
  selectedColor: string;
  moodScore: number;
  urgeScore: number;
  energyScore: number;
};

const MAIN_CONDITIONS: MainCondition[] = [
  {
    id: "stable",
    label: "Lagi Stabil",
    emoji: "🌿",
    description: "Aku cukup tenang dan bisa mengontrol diri.",
    color: "border-emerald-100 bg-emerald-50",
    selectedColor: "border-[#2D936C] bg-[#E7F4EE] ring-4 ring-emerald-50",
    moodScore: 8,
    urgeScore: 2,
    energyScore: 7,
  },
  {
    id: "urge",
    label: "Ada Dorongan",
    emoji: "⚡",
    description: "Ada dorongan, tapi aku masih sadar.",
    color: "border-amber-100 bg-amber-50",
    selectedColor: "border-[#F59E0B] bg-[#FFF7E6] ring-4 ring-amber-50",
    moodScore: 6,
    urgeScore: 7,
    energyScore: 5,
  },
  {
    id: "heavy",
    label: "Lagi Berat",
    emoji: "😮‍💨",
    description: "Hari ini terasa berat dan melelahkan.",
    color: "border-orange-100 bg-orange-50",
    selectedColor: "border-[#F97316] bg-[#FFF3E8] ring-4 ring-orange-50",
    moodScore: 4,
    urgeScore: 8,
    energyScore: 3,
  },
  {
    id: "fallen",
    label: "Barusan Jatuh",
    emoji: "🫂",
    description: "Aku butuh reset dan mulai lagi pelan-pelan.",
    color: "border-rose-100 bg-rose-50",
    selectedColor: "border-[#E11D48] bg-[#FFF1F2] ring-4 ring-rose-50",
    moodScore: 3,
    urgeScore: 9,
    energyScore: 2,
  },
];

const FEELING_PILLS = [
  "Stress",
  "Bosan",
  "Kesepian",
  "Capek",
  "Larut malam",
  "Overthinking",
];

export default function UpdateKondisiModal({
  isOpen,
  onClose,
}: UpdateKondisiModalProps) {
  const supabase = useMemo(() => createClient(), []);

  const [selectedCondition, setSelectedCondition] = useState<ConditionId | null>(
    null
  );
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const selectedConditionData = MAIN_CONDITIONS.find(
    (condition) => condition.id === selectedCondition
  );

  const toggleFeeling = (feeling: string) => {
    setSelectedFeelings((prev) =>
      prev.includes(feeling)
        ? prev.filter((item) => item !== feeling)
        : [...prev, feeling]
    );
  };

  const handleClose = () => {
    if (isSaving) return;

    setSelectedCondition(null);
    setSelectedFeelings([]);
    setNote("");
    setErrorMessage("");
    onClose();
  };

  const handleSubmit = async () => {
    if (!selectedConditionData) {
      setErrorMessage("Pilih kondisi utama dulu.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setIsSaving(false);
      setErrorMessage("Sesi login habis. Silakan login ulang.");
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
      setErrorMessage("Gagal menyimpan evaluasi. Coba lagi.");
      return;
    }

    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end bg-black/45 px-[12px] pb-[12px] pt-[40px]">
      <div className="flex max-h-[calc(100dvh-32px)] w-full flex-col overflow-hidden rounded-[28px] bg-white shadow-[0px_18px_60px_rgba(15,23,42,0.28)]">
        <div className="shrink-0 border-b border-[#F1F5F9] px-[22px] pb-[16px] pt-[18px]">
          <div className="flex items-start justify-between gap-[16px]">
            <div>
              <div className="mb-[8px] inline-flex items-center gap-[6px] rounded-full bg-[#E7F4EE] px-[10px] py-[5px]">
                <CheckCircle2 className="h-[14px] w-[14px] text-[#2D936C]" />
                <span className="font-poppins text-[11px] font-bold text-[#2D936C]">
                  Check-in harian
                </span>
              </div>

              <h2 className="font-poppins text-[22px] font-bold tracking-[-0.4px] text-[#0F172A]">
                Evaluasi Harian
              </h2>

              <p className="mt-[4px] text-[13px] leading-[19px] text-[#64748B]">
                Bagaimana kondisi kamu saat ini?
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={isSaving}
              className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-[#F8FAFC] text-[#0F172A] transition active:scale-95 disabled:opacity-50"
            >
              <X className="h-[20px] w-[20px]" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-[22px] py-[18px]">
          {errorMessage && (
            <div className="mb-[14px] rounded-[16px] border border-red-100 bg-red-50 px-[14px] py-[12px] text-[13px] font-medium leading-[18px] text-red-600">
              {errorMessage}
            </div>
          )}

          <section>
            <div className="mb-[12px] flex items-center justify-between">
              <h3 className="font-poppins text-[14px] font-bold text-[#0F172A]">
                Kondisi Utama
              </h3>

              <p className="text-[11px] font-medium text-[#94A3B8]">
                Pilih satu
              </p>
            </div>

            <div className="grid grid-cols-2 gap-[12px]">
              {MAIN_CONDITIONS.map((condition) => {
                const isSelected = selectedCondition === condition.id;

                return (
                  <button
                    key={condition.id}
                    type="button"
                    onClick={() => setSelectedCondition(condition.id)}
                    className={`min-h-[138px] rounded-[22px] border-2 p-[14px] text-left transition active:scale-[0.98] ${isSelected ? condition.selectedColor : condition.color
                      }`}
                  >
                    <div className="mb-[10px] flex h-[38px] w-[38px] items-center justify-center rounded-[14px] bg-white text-[22px] shadow-sm">
                      {condition.emoji}
                    </div>

                    <p className="font-poppins text-[14px] font-bold leading-[18px] text-[#0F172A]">
                      {condition.label}
                    </p>

                    <p className="mt-[6px] text-[11px] leading-[16px] text-[#64748B]">
                      {condition.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="mt-[22px]">
            <div className="mb-[12px] flex items-center justify-between">
              <h3 className="font-poppins text-[14px] font-bold text-[#0F172A]">
                Apa yang kamu rasakan?
              </h3>

              <p className="text-[11px] font-medium text-[#94A3B8]">
                Bisa lebih dari satu
              </p>
            </div>

            <div className="flex flex-wrap gap-[10px]">
              {FEELING_PILLS.map((feeling) => {
                const isSelected = selectedFeelings.includes(feeling);

                return (
                  <button
                    key={feeling}
                    type="button"
                    onClick={() => toggleFeeling(feeling)}
                    className={`rounded-full px-[16px] py-[10px] font-poppins text-[13px] font-bold transition active:scale-95 ${isSelected
                        ? "bg-[#2D936C] text-white shadow-[0px_8px_18px_rgba(45,147,108,0.18)]"
                        : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]"
                      }`}
                  >
                    {feeling}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="mt-[22px]">
            <label className="block">
              <span className="mb-[10px] block font-poppins text-[14px] font-bold text-[#0F172A]">
                Catatan singkat
              </span>

              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Contoh: Hari ini agak berat karena capek dan sendirian..."
                className="min-h-[104px] w-full resize-none rounded-[18px] border border-[#E2E8F0] bg-white px-[14px] py-[12px] text-[13px] leading-[20px] text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#2D936C]"
              />
            </label>
          </section>

          {selectedConditionData && (
            <section className="mt-[18px] rounded-[18px] bg-[#F8FAFC] px-[14px] py-[12px]">
              <p className="font-poppins text-[12px] font-bold text-[#0F172A]">
                Ringkasan skor
              </p>

              <div className="mt-[10px] grid grid-cols-3 gap-[8px]">
                <ScorePreview
                  label="Mood"
                  value={selectedConditionData.moodScore}
                />
                <ScorePreview
                  label="Urge"
                  value={selectedConditionData.urgeScore}
                />
                <ScorePreview
                  label="Energi"
                  value={selectedConditionData.energyScore}
                />
              </div>
            </section>
          )}
        </div>

        <div className="shrink-0 border-t border-[#F1F5F9] bg-white px-[22px] pb-[calc(18px+env(safe-area-inset-bottom))] pt-[14px]">
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedCondition || isSaving}
            className="h-[52px] w-full rounded-[16px] bg-[#2D936C] font-poppins text-[15px] font-bold text-white hover:bg-[#257B5A] disabled:opacity-60"
          >
            {isSaving ? (
              <span className="flex items-center gap-[8px]">
                <Loader2 className="h-[18px] w-[18px] animate-spin" />
                Menyimpan...
              </span>
            ) : (
              "Simpan Evaluasi"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ScorePreview({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[14px] bg-white px-[10px] py-[10px] text-center shadow-sm">
      <p className="text-[11px] font-medium text-[#64748B]">{label}</p>
      <p className="mt-[2px] font-poppins text-[17px] font-bold text-[#2D936C]">
        {value}/10
      </p>
    </div>
  );
}