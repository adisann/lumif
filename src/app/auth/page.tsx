"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaGoogle, FaApple } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { HiArrowLeft } from "react-icons/hi2";

const LOGO_URL = "/assets/Logo Lumif.png";

export default function AuthOptionsScreen() {
  const router = useRouter();

  return (
    <main className="relative flex h-dvh w-full flex-col overflow-hidden bg-white font-lexend text-black">
      {/* Back Button */}
      <header className="absolute left-0 right-0 top-0 z-10 px-[24px] pt-[20px]">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-[48px] w-[48px] items-center justify-center rounded-[12px] border border-[#E5E7EB] bg-white shadow-sm transition active:scale-95"
          aria-label="Kembali"
        >
          <HiArrowLeft className="h-[20px] w-[20px] text-black" />
        </button>
      </header>

      {/* Center Content */}
      <section className="flex flex-1 items-center justify-center px-[24px]">
        <div className="w-full max-w-[416px] -translate-y-[24px]">
          {/* Logo */}
          <div className="mb-[42px] flex justify-center">
            <div className="relative h-[128px] w-[226px]">
              <Image
                src={LOGO_URL}
                alt="Lumif Logo"
                fill
                className="object-contain"
                priority
                unoptimized
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex w-full flex-col gap-[24px]">
            <button
              type="button"
              className="flex h-[52px] w-full items-center justify-center gap-[12px] rounded-[10px] border border-[#E5E5E5] bg-white text-black shadow-sm transition hover:bg-gray-50 active:scale-[0.98]"
            >
              <FaGoogle className="h-[20px] w-[20px] text-[#4285F4]" />
              <span className="font-poppins text-[16px] font-medium tracking-[-0.32px]">
                Lanjutkan dengan Google
              </span>
            </button>

            <button
              type="button"
              className="flex h-[52px] w-full items-center justify-center gap-[12px] rounded-[10px] bg-black text-white shadow-sm transition hover:bg-gray-800 active:scale-[0.98]"
            >
              <FaApple className="h-[22px] w-[22px]" />
              <span className="font-poppins text-[16px] font-medium tracking-[-0.32px]">
                Lanjutkan dengan Apple
              </span>
            </button>

            <button
              type="button"
              onClick={() => router.push("/auth/login")}
              className="flex h-[52px] w-full items-center justify-center gap-[12px] rounded-[10px] border border-[#E5E5E5] bg-white text-black shadow-sm transition hover:bg-gray-50 active:scale-[0.98]"
            >
              <HiOutlineMail className="h-[22px] w-[22px]" />
              <span className="font-poppins text-[16px] font-medium tracking-[-0.32px]">
                Lanjutkan dengan Email
              </span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}