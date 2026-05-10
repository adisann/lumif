"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import StatusBar from "@/components/StatusBar";
import { HiArrowLongRight, HiArrowLeft } from "react-icons/hi2";

const ONBOARDING_DATA = [
  {
    title: "Perjalanan Bebas PMO",
    description:
      "Ambil kembali kendali atas kesehatanmu, selangkah demi selangkah. Kami akan menemanimu di setiap prosesnya.",
    image: "/assets/Onboarding 1.png",
    buttonText: "Selanjutnya",
  },
  {
    title: "Pelatih AI 24/7",
    description:
      "Pelatih AI pribadimu membantu melacak progres, mengelola dorongan, dan menjaga motivasimu tetap konsisten.",
    image: "/assets/Onboarding 2.png",
    buttonText: "Selanjutnya",
  },
  {
    title: "Pilih Jalur Anda",
    description:
      "Berhenti total atau kurangi secara bertahap, pilih cara yang paling cocok untukmu.",
    image: "/assets/Onboarding 3.png",
    buttonText: "Mulai",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < ONBOARDING_DATA.length - 1) {
      setStep(step + 1);
    } else {
      router.push("/auth");
    }
  };

  const handleSkip = () => {
    router.push("/auth");
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      router.push("/");
    }
  };

  const currentData = ONBOARDING_DATA[step];

  return (
    <div className="bg-[#FAFAFA] relative h-full w-full flex flex-col font-lexend overflow-hidden">

      {/* Top Nav */}
      <div className="flex justify-between items-center px-[24px] pt-[20px] pb-[8px] h-[48px] shrink-0 z-10">
        <button
          onClick={handleBack}
          className="flex h-[48px] w-[48px] items-center justify-center rounded-[10px] bg-white border border-[#e5e5e5]"
        >
          <HiArrowLeft className="h-[20px] w-[20px] text-black" />
        </button>
        {step < 2 && (
          <button
            onClick={handleSkip}
            className="font-poppins text-[14px] font-bold text-[#666] tracking-[-0.28px]"
          >
            Lewati
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-[24px]">
        {/* Image */}
        <div className="relative w-full aspect-square max-w-[260px] mb-[40px]">
          <Image
            src={currentData.image}
            alt={currentData.title}
            fill
            className="object-contain rounded-[24px] shadow-sm"
            priority
          />
        </div>

        {/* Text */}
        <div className="text-center w-full">
          <h2 className="font-poppins text-[20px] font-bold text-black tracking-[-0.4px] mb-[12px]">
            {currentData.title}
          </h2>
          <p className="text-[14px] text-[#666] leading-[1.5] px-[8px]">
            {currentData.description}
          </p>
        </div>
      </div>

      {/* Bottom Area */}
      <div className="px-[24px] pb-[34px] w-full shrink-0 flex flex-col gap-[32px]">
        {/* Progress Dots */}
        <div className="flex justify-center items-center gap-[8px]">
          {ONBOARDING_DATA.map((_, idx) => (
            <div
              key={idx}
              className={`h-[6px] rounded-full transition-all duration-300 ${
                step === idx ? "w-[28px] bg-black" : "w-[6px] bg-[#d9d9d9]"
              }`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="bg-black text-white rounded-[10px] py-[12px] px-[24px] flex items-center justify-center gap-[12px] w-full"
        >
          <span className="font-poppins text-[16px] font-bold tracking-[-0.32px]">
            {currentData.buttonText}
          </span>
          <HiArrowLongRight className="h-[24px] w-[24px]" />
        </button>

        {/* Login Link */}
        <div className="text-center pb-[24px]">
          <span className="text-[14px] text-black">
            Sudah punya akun?{" "}
            <button
              onClick={() => router.push("/auth/login")}
              className="font-bold underline"
            >
              Masuk
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}
