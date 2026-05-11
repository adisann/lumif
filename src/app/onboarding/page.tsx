"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { HiArrowLongRight, HiArrowLeft } from "react-icons/hi2";

const ONBOARDING_DATA = [
  {
    title: "Perjalanan Bebas PMO",
    description:
      "Ambil kembali kendali atas kesehatanmu, selangkah demi selangkah. Lumif membantumu menjaga progres, memahami pola, dan bangkit lagi saat terasa berat.",
    image: "/assets/Onboarding 1.png",
    buttonText: "Selanjutnya",
  },
  {
    title: "Komunitas Aman",
    description:
      "Temukan ruang suportif untuk berbagi cerita, saling menguatkan, dan merasa tidak sendirian dalam proses pemulihan.",
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
      setStep((prev) => prev + 1);
      return;
    }

    router.push("/auth");
  };

  const handleSkip = () => {
    router.push("/auth");
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
      return;
    }

    router.push("/");
  };

  const currentData = ONBOARDING_DATA[step];

  return (
    <main className="relative flex h-dvh w-full flex-col overflow-hidden bg-[#FAFAFA] font-lexend text-black">
      {/* Top Nav */}
      <header className="absolute left-0 right-0 top-0 z-10 flex h-[88px] items-center justify-between px-[24px] pt-[20px]">
        <button
          type="button"
          onClick={handleBack}
          className="flex h-[44px] w-[44px] items-center justify-center rounded-[12px] border border-[#E5E7EB] bg-white shadow-sm transition active:scale-95"
          aria-label="Kembali"
        >
          <HiArrowLeft className="h-[20px] w-[20px] text-black" />
        </button>

        {step < ONBOARDING_DATA.length - 1 ? (
          <button
            type="button"
            onClick={handleSkip}
            className="font-poppins text-[14px] font-bold tracking-[-0.28px] text-[#666]"
          >
            Lewati
          </button>
        ) : (
          <div className="h-[44px] w-[44px]" />
        )}
      </header>

      {/* Center Content */}
      <section className="flex flex-1 items-center justify-center px-[24px]">
        <div className="w-full -translate-y-[28px]">
          <div className="mx-auto mb-[36px] aspect-square w-full max-w-[260px]">
            <div className="relative h-full w-full">
              <Image
                src={currentData.image}
                alt={currentData.title}
                fill
                className="rounded-[24px] object-contain"
                priority
              />
            </div>
          </div>

          <div className="mx-auto w-full max-w-[360px] text-center">
            <h1 className="mb-[12px] font-poppins text-[22px] font-bold tracking-[-0.44px] text-black">
              {currentData.title}
            </h1>

            <p className="px-[8px] text-[14px] leading-[22px] text-[#666]">
              {currentData.description}
            </p>
          </div>
        </div>
      </section>

      {/* Bottom Area */}
      <section className="shrink-0 px-[24px] pb-[calc(34px+env(safe-area-inset-bottom))]">
        <div className="mb-[32px] flex items-center justify-center gap-[8px]">
          {ONBOARDING_DATA.map((_, idx) => (
            <div
              key={idx}
              className={`h-[6px] rounded-full transition-all duration-300 ${step === idx ? "w-[28px] bg-[#2D936C]" : "w-[6px] bg-[#D9D9D9]"
                }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="flex h-[52px] w-full items-center justify-center gap-[12px] rounded-[12px] bg-[#2D936C] px-[24px] text-white shadow-[0px_10px_24px_rgba(45,147,108,0.18)] transition active:scale-[0.98]"
        >
          <span className="font-poppins text-[16px] font-bold tracking-[-0.32px]">
            {currentData.buttonText}
          </span>
          <HiArrowLongRight className="h-[24px] w-[24px]" />
        </button>

        <div className="pt-[28px] text-center">
          <span className="text-[14px] text-black">
            Sudah punya akun?{" "}
            <button
              type="button"
              onClick={() => router.push("/auth/login")}
              className="font-bold text-[#2D936C]"
            >
              Masuk
            </button>
          </span>
        </div>
      </section>
    </main>
  );
}