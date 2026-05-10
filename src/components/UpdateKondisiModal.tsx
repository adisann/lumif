"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UpdateKondisiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MAIN_CONDITIONS = [
  { id: "stable", label: "Lagi Stabil", emoji: "😊", color: "border-emerald-200 bg-emerald-50" },
  { id: "urge", label: "Ada Dorongan", emoji: "😰", color: "border-amber-200 bg-amber-50" },
  { id: "heavy", label: "Lagi Berat", emoji: "😔", color: "border-orange-200 bg-orange-50" },
  { id: "fallen", label: "Barusan Jatuh", emoji: "😞", color: "border-rose-200 bg-rose-50" },
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
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);

  const toggleFeeling = (feeling: string) => {
    setSelectedFeelings(prev =>
      prev.includes(feeling) ? prev.filter(f => f !== feeling) : [...prev, feeling]
    );
  };

  const handleSubmit = () => {
    if (selectedCondition) {
      console.log({
        condition: selectedCondition,
        feelings: selectedFeelings,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedCondition(null);
    setSelectedFeelings([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end">
      <div 
        className="absolute inset-0" 
        onClick={handleClose}
      />
      <div className="relative w-full bg-white rounded-t-[32px] p-[28px] animate-slideUp shadow-2xl">
        <div className="flex justify-between items-center mb-[28px]">
          <div>
            <h2 className="font-poppins text-[22px] font-bold text-[#0F172A]">
              Evaluasi Harian
            </h2>
            <p className="text-[13px] text-[#64748B]">Bagaimana perasaan Anda saat ini?</p>
          </div>
          <button
            onClick={handleClose}
            className="text-[#64748B] hover:bg-[#F1F5F9] rounded-full p-[10px] transition-colors"
          >
            <X className="w-[24px] h-[24px]" />
          </button>
        </div>

        {/* Main Conditions Grid */}
        <div className="mb-[32px]">
          <p className="text-[12px] font-bold text-[#94A3B8] mb-[16px] uppercase tracking-wider">
            Kondisi Utama
          </p>
          <div className="grid grid-cols-2 gap-[16px]">
            {MAIN_CONDITIONS.map((condition) => (
              <button
                key={condition.id}
                onClick={() => setSelectedCondition(condition.id)}
                className={`p-[20px] rounded-[20px] border-2 transition-all active:scale-95 text-left flex flex-col gap-2 ${
                  selectedCondition === condition.id
                    ? "border-[#2D936C] bg-emerald-50 ring-4 ring-emerald-50"
                    : "border-[#F1F5F9] hover:border-[#2D936C]"
                }`}
              >
                <div className="text-[28px]">{condition.emoji}</div>
                <p className="text-[13px] font-poppins font-bold text-[#1E293B]">
                  {condition.label}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Feeling Pills */}
        <div className="mb-[32px]">
          <p className="text-[12px] font-bold text-[#94A3B8] mb-[16px] uppercase tracking-wider">
            Apa yang kamu rasakan?
          </p>
          <div className="flex flex-wrap gap-[10px]">
            {FEELING_PILLS.map((feeling) => (
              <button
                key={feeling}
                onClick={() => toggleFeeling(feeling)}
                className={`px-[18px] py-[10px] rounded-full text-[13px] font-poppins font-bold transition-all active:scale-95 ${
                  selectedFeelings.includes(feeling)
                    ? "bg-[#2D936C] text-white shadow-lg shadow-emerald-200"
                    : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]"
                }`}
              >
                {feeling}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!selectedCondition}
          className={`w-full py-[28px] rounded-[18px] text-[16px] font-bold transition-all ${
            selectedCondition
              ? "bg-[#2D936C] text-white hover:bg-[#257B5A] shadow-xl shadow-emerald-100"
              : "bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed"
          }`}
        >
          Simpan Evaluasi
        </Button>
        
        <div className="h-[20px]" />
      </div>
    </div>
  );
}
