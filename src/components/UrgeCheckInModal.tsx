"use client";

import { useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import {
  CheckCircle2,
  Clock3,
  Flame,
  Loader2,
  MapPin,
  Moon,
  MoveRight,
  ShieldAlert,
  TimerReset,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type UrgeCheckInModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onEmergency?: () => void;
};

const TRIGGERS = [
  "Stres",
  "Bosan",
  "Sendirian",
  "Capek",
  "Media sosial",
  "Larut malam",
  "Overthinking",
  "Pemicu visual",
];

const CONTEXTS = [
  { label: "Kamar", icon: Moon },
  { label: "Kamar mandi", icon: MapPin },
  { label: "Kasur", icon: Clock3 },
  { label: "Sendiri", icon: ShieldAlert },
];

const ACTIONS = [
  "Tarik napas 2 menit",
  "Pindah ruangan",
  "Minum air",
  "Jauhkan HP",
  "Chat teman",
  "Journaling singkat",
];

export default function UrgeCheckInModal({
  isOpen,
  onClose,
  onEmergency,
}: UrgeCheckInModalProps) {
  const supabase = useMemo(() => createClient(), []);

  const [status, setStatus] = useState<"active" | "passed">("active");
  const [intensity, setIntensity] = useState(6);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [selectedContext, setSelectedContext] = useState("Kamar");
  const [selectedActions, setSelectedActions] = useState<string[]>([
    "Tarik napas 2 menit",
  ]);
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [saved, setSaved] = useState(false);

  const moodScore = Math.max(2, 9 - Math.round(intensity / 2));
  const energyScore = Math.max(2, 8 - Math.round(intensity / 3));

  const resetState = () => {
    setStatus("active");
    setIntensity(6);
    setSelectedTriggers([]);
    setSelectedContext("Kamar");
    setSelectedActions(["Tarik napas 2 menit"]);
    setNote("");
    setErrorMessage("");
    setSaved(false);
  };

  const handleClose = () => {
    if (isSaving) return;
    resetState();
    onClose();
  };

  const toggleValue = (
    value: string,
    setter: Dispatch<SetStateAction<string[]>>,
  ) => {
    setter((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  const handleEmergency = () => {
    handleClose();
    onEmergency?.();
  };

  const handleSubmit = async () => {
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
      type: "urge_log",
      status,
      intensity,
      triggers: selectedTriggers,
      context: selectedContext,
      actions: selectedActions,
      user_note: note.trim(),
    });

    const { error } = await supabase.from("checkins").insert({
      user_id: user.id,
      mood_score: moodScore,
      urge_score: intensity,
      energy_score: energyScore,
      note: checkinNote,
    });

    setIsSaving(false);

    if (error) {
      console.error("Gagal menyimpan catatan hasrat:", error);
      setErrorMessage("Gagal menyimpan catatan. Coba lagi.");
      return;
    }

    setSaved(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end bg-black/45 px-3 pb-3 pt-10 font-lexend">
      <div className="flex max-h-[calc(100dvh-24px)] w-full flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_18px_60px_rgba(15,23,42,0.28)]">
        <div className="shrink-0 border-b border-[#F1F5F9] px-6 pb-5 pt-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#FFF2E8] px-3 py-1.5">
                <Flame className="h-4 w-4 text-[#E86B1C]" />
                <span className="font-poppins text-xs font-bold text-[#B45309]">
                  Check-in hasrat
                </span>
              </div>

              <h2 className="font-poppins text-[23px] font-bold leading-tight text-[#0F172A]">
                Catat dorongan yang muncul
              </h2>
              <p className="mt-2 max-w-[310px] text-[13px] leading-5 text-[#64748B]">
                Tangkap polanya dalam 30 detik. Kamu tidak perlu menunggu sampai
                semuanya sempurna.
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={isSaving}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F8FAFC] text-[#0F172A] transition active:scale-95 disabled:opacity-50"
              aria-label="Tutup catat hasrat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {saved ? (
          <SavedState
            intensity={intensity}
            onClose={handleClose}
            onEmergency={intensity >= 8 ? handleEmergency : undefined}
          />
        ) : (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
              {errorMessage && (
                <div className="mb-4 rounded-[16px] border border-red-100 bg-red-50 px-4 py-3 text-[13px] font-medium leading-5 text-red-600">
                  {errorMessage}
                </div>
              )}

              <section>
                <div className="grid grid-cols-2 rounded-[16px] bg-[#F1F5F9] p-1">
                  {[
                    { id: "active", label: "Sedang terjadi" },
                    { id: "passed", label: "Sudah lewat" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setStatus(item.id as "active" | "passed")}
                      className={cn(
                        "h-11 rounded-[13px] font-poppins text-sm font-bold transition",
                        status === item.id
                          ? "bg-white text-[#0F172A] shadow-sm"
                          : "text-[#64748B]",
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </section>

              <section className="mt-6 rounded-[22px] border border-[#F1F5F9] bg-[#FAFAFA] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-poppins text-[14px] font-bold text-[#0F172A]">
                      Intensitas dorongan
                    </h3>
                    <p className="mt-1 text-xs text-[#64748B]">
                      1 ringan, 10 sangat kuat.
                    </p>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-white shadow-sm">
                    <span className="font-poppins text-[22px] font-bold text-[#2D936C]">
                      {intensity}
                    </span>
                  </div>
                </div>

                <input
                  type="range"
                  min={1}
                  max={10}
                  value={intensity}
                  onChange={(event) => setIntensity(Number(event.target.value))}
                  className="h-2 w-full accent-[#2D936C]"
                  aria-label="Intensitas dorongan"
                />

                <div className="mt-3 flex justify-between text-[11px] font-semibold text-[#94A3B8]">
                  <span>Terkendali</span>
                  <span>Butuh bantuan</span>
                </div>

                {intensity >= 8 && (
                  <button
                    type="button"
                    onClick={handleEmergency}
                    className="mt-4 flex w-full items-center justify-between rounded-[16px] bg-[#D82C1C] px-4 py-3 text-left text-white shadow-sm transition active:scale-[0.99]"
                  >
                    <span>
                      <span className="block font-poppins text-sm font-bold">
                        Dorongan sedang kuat
                      </span>
                      <span className="mt-0.5 block text-xs text-white/80">
                        Buka bantuan darurat sekarang.
                      </span>
                    </span>
                    <MoveRight className="h-5 w-5" />
                  </button>
                )}
              </section>

              <PillSection
                title="Pemicu yang terasa"
                helper="Bisa pilih lebih dari satu"
                values={TRIGGERS}
                selected={selectedTriggers}
                onToggle={(value) => toggleValue(value, setSelectedTriggers)}
              />

              <section className="mt-6">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-poppins text-[14px] font-bold text-[#0F172A]">
                    Situasi saat ini
                  </h3>
                  <span className="text-[11px] font-medium text-[#94A3B8]">
                    Pilih satu
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {CONTEXTS.map((context) => {
                    const Icon = context.icon;
                    const active = selectedContext === context.label;

                    return (
                      <button
                        key={context.label}
                        type="button"
                        onClick={() => setSelectedContext(context.label)}
                        className={cn(
                          "flex min-h-[64px] items-center gap-3 rounded-[18px] border px-4 text-left transition active:scale-[0.99]",
                          active
                            ? "border-[#2D936C] bg-[#EAF7F1]"
                            : "border-[#E2E8F0] bg-white",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-[12px]",
                            active
                              ? "bg-[#2D936C] text-white"
                              : "bg-[#F1F5F9] text-[#64748B]",
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="font-poppins text-[13px] font-bold text-[#0F172A]">
                          {context.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

              <PillSection
                title="Aksi yang sudah/akan kamu lakukan"
                helper="Pilih yang paling realistis"
                values={ACTIONS}
                selected={selectedActions}
                onToggle={(value) => toggleValue(value, setSelectedActions)}
              />

              <section className="mt-6">
                <label className="block">
                  <span className="mb-3 block font-poppins text-[14px] font-bold text-[#0F172A]">
                    Catatan singkat
                  </span>
                  <textarea
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Contoh: Muncul setelah scrolling lama. Aku mau pindah ruangan dulu."
                    className="min-h-[112px] w-full resize-none rounded-[18px] border border-[#E2E8F0] bg-white px-4 py-3 text-[13px] leading-5 text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#2D936C]"
                  />
                </label>
              </section>
            </div>

            <div className="shrink-0 border-t border-[#F1F5F9] bg-white px-6 pb-[calc(18px+env(safe-area-inset-bottom))] pt-4">
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSaving}
                className="h-[52px] w-full rounded-[16px] bg-[#2D936C] font-poppins text-[15px] font-bold text-white hover:bg-[#257B5A]"
              >
                {isSaving ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-[18px] w-[18px] animate-spin" />
                    Menyimpan...
                  </span>
                ) : (
                  "Simpan Catatan Hasrat"
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PillSection({
  title,
  helper,
  values,
  selected,
  onToggle,
}: {
  title: string;
  helper: string;
  values: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <section className="mt-6">
      <div className="mb-3 flex items-center justify-between gap-4">
        <h3 className="font-poppins text-[14px] font-bold text-[#0F172A]">
          {title}
        </h3>
        <span className="shrink-0 text-[11px] font-medium text-[#94A3B8]">
          {helper}
        </span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {values.map((value) => {
          const active = selected.includes(value);

          return (
            <button
              key={value}
              type="button"
              onClick={() => onToggle(value)}
              className={cn(
                "rounded-full px-4 py-2.5 font-poppins text-[12px] font-bold transition active:scale-95",
                active
                  ? "bg-[#2D936C] text-white shadow-[0_8px_18px_rgba(45,147,108,0.18)]"
                  : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]",
              )}
            >
              {value}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function SavedState({
  intensity,
  onClose,
  onEmergency,
}: {
  intensity: number;
  onClose: () => void;
  onEmergency?: () => void;
}) {
  return (
    <div className="flex min-h-[420px] flex-1 flex-col items-center justify-center px-6 py-8 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#EAF7F1] text-[#2D936C]">
        <CheckCircle2 className="h-11 w-11" />
      </div>
      <h3 className="font-poppins text-[24px] font-bold text-[#0F172A]">
        Catatan tersimpan
      </h3>
      <p className="mt-3 max-w-[310px] text-[14px] leading-6 text-[#64748B]">
        Kamu baru saja membuat data penting untuk mengenali pola. Intensitas
        hari ini tercatat {intensity}/10.
      </p>

      <div className="mt-8 flex w-full flex-col gap-3">
        {onEmergency && (
          <Button
            type="button"
            onClick={onEmergency}
            className="h-[52px] w-full rounded-[16px] bg-[#D82C1C] font-poppins text-[15px] font-bold text-white hover:bg-[#BE2417]"
          >
            <ShieldAlert className="h-5 w-5" />
            Buka Bantuan Darurat
          </Button>
        )}
        <Button
          type="button"
          onClick={onClose}
          className="h-[52px] w-full rounded-[16px] bg-[#2D936C] font-poppins text-[15px] font-bold text-white hover:bg-[#257B5A]"
        >
          <TimerReset className="h-5 w-5" />
          Kembali ke Dashboard
        </Button>
      </div>
    </div>
  );
}
