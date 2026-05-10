"use client";

import { useEffect, useState } from "react";
import {
  HiArrowLeft,
  HiBolt,
  HiChatBubbleOvalLeftEllipsis,
  HiCheck,
  HiCheckCircle,
  HiHeart,
  HiXMark,
} from "react-icons/hi2";

type RelapseStep = "comfort" | "triggers" | "action" | "success";

interface RelapseResetFlowProps {
  isOpen: boolean;
  onClose: () => void;
}

type TriggerItem = {
  id: string;
  emoji: string;
  label: string;
};

type ActionItem = {
  id: string;
  emoji: string;
  label: string;
};

const TRIGGERS: TriggerItem[] = [
  { id: "stress", emoji: "🤯", label: "Stress" },
  { id: "bosan", emoji: "😔", label: "Bosan" },
  { id: "kesepian", emoji: "💔", label: "Kesepian" },
  { id: "capek", emoji: "😮‍💨", label: "Capek" },
  { id: "bingung", emoji: "😵‍💫", label: "Kebingungan" },
  { id: "lainnya", emoji: "•••", label: "Lainnya" },
];

const ACTION_ITEMS: ActionItem[] = [
  { id: "cold-shower", emoji: "🚿", label: "Mandi air dingin" },
  { id: "walk", emoji: "🚶", label: "Jalan 5 menit di luar kamar" },
  { id: "water", emoji: "💧", label: "Minum 2 gelas air putih" },
  { id: "phone-away", emoji: "📵", label: "Letakkan HP di meja lain" },
];

export default function RelapseResetFlow({
  isOpen,
  onClose,
}: RelapseResetFlowProps) {
  const [currentStep, setCurrentStep] = useState<RelapseStep>("comfort");
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep("comfort");
      setSelectedTrigger(null);
      setSelectedAction(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setCurrentStep("comfort");
    setSelectedTrigger(null);
    setSelectedAction(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] h-dvh w-full overflow-hidden bg-white font-lexend text-black">
      <div className="flex h-full w-full flex-col">
        <ResetHeader onBack={handleClose} />

        <main className="min-h-0 flex-1 overflow-y-auto px-[24px] pb-[calc(32px+env(safe-area-inset-bottom))]">
          {currentStep === "comfort" && (
            <ComfortStep onNext={() => setCurrentStep("triggers")} />
          )}

          {currentStep === "triggers" && (
            <TriggerStep
              selectedTrigger={selectedTrigger}
              onSelect={(triggerId) => setSelectedTrigger(triggerId)}
              onNext={() => setCurrentStep("action")}
            />
          )}

          {currentStep === "action" && (
            <ActionStep
              selectedAction={selectedAction}
              onSelect={(actionId) => setSelectedAction(actionId)}
              onNext={() => setCurrentStep("success")}
            />
          )}

          {currentStep === "success" && <SuccessStep onClose={handleClose} />}
        </main>
      </div>
    </div>
  );
}

function ResetHeader({ onBack }: { onBack: () => void }) {
  return (
    <header className="shrink-0 bg-white px-[24px] pb-[16px] pt-[20px]">
      <div className="flex items-center">
        <button
          type="button"
          onClick={onBack}
          className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[#E5E5E5] bg-white transition active:scale-95"
        >
          <HiArrowLeft className="h-[18px] w-[18px] text-black" />
        </button>

        <h1 className="mr-[34px] flex-1 text-center font-poppins text-[20px] font-bold tracking-[-0.4px] text-black">
          Bangkit Kembali
        </h1>
      </div>
    </header>
  );
}

function ComfortStep({ onNext }: { onNext: () => void }) {
  return (
    <section className="flex min-h-full flex-col items-center pt-[48px] text-center">
      <div className="relative mt-[12px] flex w-full justify-center">
        <div className="absolute left-[-20px] top-[165px] text-[52px] leading-none">
          ☁️
        </div>

        <div className="absolute right-[-8px] top-[88px] text-[52px] leading-none">
          ☁️
        </div>

        <div className="flex flex-col items-center">
          <HiHeart className="mb-[34px] h-[78px] w-[78px] text-black" />

          <h2 className="max-w-[330px] font-poppins text-[25px] font-extrabold leading-[29px] tracking-[-0.6px] text-black">
            Nggak apa-apa,
            <br />
            kamu aman di sini
          </h2>

          <p className="mt-[16px] max-w-[310px] text-[14px] font-medium leading-[22px] text-[#1F1F1F]">
            Relaps itu manusiawi. Satu momen ini tidak menghapus semua usaha
            yang sudah kamu lalui. Yuk kita mulai pelan-pelan lagi 😊
          </p>
        </div>
      </div>

      <div className="mt-auto w-full pb-[28px] pt-[72px]">
        <button
          type="button"
          onClick={onNext}
          className="h-[54px] w-full rounded-[10px] bg-[#178B5D] font-poppins text-[16px] font-bold text-white shadow-[0px_10px_24px_rgba(23,139,93,0.2)] transition active:scale-[0.98]"
        >
          Aku mau bangkit lagi →
        </button>
      </div>
    </section>
  );
}

function TriggerStep({
  selectedTrigger,
  onSelect,
  onNext,
}: {
  selectedTrigger: string | null;
  onSelect: (triggerId: string) => void;
  onNext: () => void;
}) {
  return (
    <section className="flex min-h-full flex-col pt-[28px]">
      <div className="flex flex-col items-center text-center">
        <HiChatBubbleOvalLeftEllipsis className="mb-[30px] h-[66px] w-[66px] text-black" />

        <h2 className="max-w-[330px] font-poppins text-[26px] font-extrabold leading-[29px] tracking-[-0.7px] text-black">
          Apa yang terjadi
          <br />
          tadi?
        </h2>

        <p className="mt-[14px] max-w-[285px] text-[14px] font-medium leading-[22px] text-[#1F1F1F]">
          Mengenali pemicu adalah langkah awal untuk belajar pola baru
        </p>
      </div>

      <div className="mt-[32px] grid grid-cols-2 gap-[14px]">
        {TRIGGERS.map((trigger) => {
          const isSelected = selectedTrigger === trigger.id;

          return (
            <button
              key={trigger.id}
              type="button"
              onClick={() => onSelect(trigger.id)}
              className={`flex min-h-[118px] flex-col items-center justify-center rounded-[8px] bg-white px-[12px] py-[16px] shadow-[0px_8px_26px_rgba(0,0,0,0.10)] transition active:scale-[0.97] ${isSelected
                ? "ring-2 ring-[#178B5D] ring-offset-2"
                : "ring-0"
                }`}
            >
              <span className="text-[36px] leading-none">{trigger.emoji}</span>

              <span className="mt-[16px] font-poppins text-[13px] font-bold text-black">
                {trigger.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-[30px] rounded-[10px] bg-[#DDEFE7] px-[14px] py-[12px]">
        <div className="flex items-start gap-[10px]">
          <span className="text-[20px] leading-none">☘️</span>
          <p className="text-left text-[12px] font-medium leading-[17px] text-[#1F1F1F]">
            Tidak apa-apa merasa sulit. Kamu tidak sendirian, kami di sini
            untukmu
          </p>
        </div>
      </div>

      <div className="mt-auto w-full pb-[28px] pt-[28px]">
        <button
          type="button"
          onClick={onNext}
          disabled={!selectedTrigger}
          className={`h-[54px] w-full rounded-[10px] font-poppins text-[16px] font-bold transition active:scale-[0.98] ${selectedTrigger
            ? "bg-[#178B5D] text-white shadow-[0px_10px_24px_rgba(23,139,93,0.2)]"
            : "cursor-not-allowed bg-[#D9D9D9] text-[#8A8A8A]"
            }`}
        >
          Selanjutnya →
        </button>
      </div>
    </section>
  );
}

function ActionStep({
  selectedAction,
  onSelect,
  onNext,
}: {
  selectedAction: string | null;
  onSelect: (actionId: string) => void;
  onNext: () => void;
}) {
  return (
    <section className="flex min-h-full flex-col pt-[34px]">
      <div className="flex flex-col items-center text-center">
        <HiBolt className="mb-[30px] h-[76px] w-[76px] text-black" />

        <h2 className="max-w-[320px] font-poppins text-[25px] font-extrabold leading-[28px] tracking-[-0.6px] text-black">
          Satu aksi kecil buat
          <br />
          bangkit
        </h2>

        <p className="mt-[14px] max-w-[270px] text-[14px] font-medium leading-[22px] text-[#1F1F1F]">
          Pilih satu hal yang akan kamu lakukan sekarang juga
        </p>
      </div>

      <div className="mt-[34px] flex flex-col gap-[12px]">
        {ACTION_ITEMS.map((item) => {
          const isSelected = selectedAction === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`flex min-h-[72px] items-center gap-[18px] rounded-[12px] border bg-white px-[18px] text-left transition active:scale-[0.98] ${isSelected
                ? "border-[#178B5D] bg-[#E7F4EE] shadow-[0px_8px_20px_rgba(23,139,93,0.12)]"
                : "border-[#E1E1E1]"
                }`}
            >
              <span className="w-[34px] text-center text-[28px] leading-none">
                {item.emoji}
              </span>

              <span className="flex-1 font-poppins text-[16px] font-medium text-[#1F1F1F]">
                {item.label}
              </span>

              <span
                className={`flex h-[26px] w-[26px] items-center justify-center rounded-full border ${isSelected
                  ? "border-[#178B5D] bg-[#178B5D] text-white"
                  : "border-[#D4D4D4] bg-white text-transparent"
                  }`}
              >
                <HiCheck className="h-[16px] w-[16px]" />
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-auto w-full pb-[28px] pt-[28px]">
        <button
          type="button"
          onClick={onNext}
          disabled={!selectedAction}
          className={`h-[54px] w-full rounded-[10px] font-poppins text-[16px] font-bold transition active:scale-[0.98] ${selectedAction
            ? "bg-[#178B5D] text-white shadow-[0px_10px_24px_rgba(23,139,93,0.2)]"
            : "cursor-not-allowed bg-[#D9D9D9] text-[#8A8A8A]"
            }`}
        >
          Aku lakuin sekarang
        </button>
      </div>
    </section>
  );
}

function SuccessStep({ onClose }: { onClose: () => void }) {
  return (
    <section className="flex min-h-full flex-col items-center pt-[48px] text-center">
      <HiBolt className="mt-[18px] h-[76px] w-[76px] text-[#F4C542]" />

      <h2 className="mt-[44px] max-w-[320px] font-poppins text-[25px] font-extrabold leading-[28px] tracking-[-0.6px] text-black">
        KAMU SUDAH
        <br />
        BANGKIT
      </h2>

      <p className="mt-[16px] max-w-[305px] text-[14px] font-medium leading-[22px] text-[#1F1F1F]">
        Hebat! Kamu sudah berhasil mengambil momentum. Tumbuh itu bukan tidak
        pernah relaps, tapi seberapa cepat kita bangkit
      </p>

      <p className="mt-[46px] max-w-[260px] font-poppins text-[13px] font-bold uppercase leading-[20px] text-[#178B5D]">
        Kamu berhasil bangkit dalam kurang dari 1 menit
      </p>

      <div className="mt-auto w-full pb-[28px] pt-[38px]">
        <button
          type="button"
          onClick={onClose}
          className="h-[54px] w-full rounded-[10px] bg-[#178B5D] font-poppins text-[16px] font-bold text-white shadow-[0px_10px_24px_rgba(23,139,93,0.2)] transition active:scale-[0.98]"
        >
          Kembali ke Dashboard
        </button>
      </div>
    </section>
  );
}