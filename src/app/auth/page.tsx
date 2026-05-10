"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import StatusBar from "@/components/StatusBar";
import { FaGoogle, FaApple } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { HiArrowLeft } from "react-icons/hi2";

const LOGO_URL = "/assets/Logo Lumif.png";

export default function AuthOptionsScreen() {
  const router = useRouter();

  return (
    <div className="bg-white relative h-full w-full flex flex-col font-lexend">

      {/* Top Nav */}
      <div className="flex justify-start px-[24px] pt-[20px] pb-[8px] h-[48px] shrink-0">
        <button
          onClick={() => router.back()}
          className="flex h-[48px] w-[48px] items-center justify-center rounded-[10px] bg-white border border-[#e5e5e5]"
        >
          <HiArrowLeft className="h-[20px] w-[20px] text-black" />
        </button>
      </div>

      {/* Logo Area */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-[226px] h-[128px]">
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

      {/* Buttons Area */}
      <div className="px-[24px] pb-[70px] w-full shrink-0 flex flex-col gap-[24px]">
        <button className="bg-white border border-[#e5e5e5] text-black rounded-[10px] h-[48px] flex items-center justify-center gap-[12px] w-full shadow-sm hover:bg-gray-50 transition-colors">
          <FaGoogle className="h-[20px] w-[20px] text-[#4285F4]" />
          <span className="font-poppins text-[16px] font-medium tracking-[-0.32px]">
            Lanjutkan dengan Google
          </span>
        </button>

        <button className="bg-black text-white rounded-[10px] h-[48px] flex items-center justify-center gap-[12px] w-full shadow-sm hover:bg-gray-800 transition-colors">
          <FaApple className="h-[22px] w-[22px]" />
          <span className="font-poppins text-[16px] font-medium tracking-[-0.32px]">
            Lanjutkan dengan Apple
          </span>
        </button>

        <button 
          onClick={() => router.push("/auth/login")}
          className="bg-white border border-[#e5e5e5] text-black rounded-[10px] h-[48px] flex items-center justify-center gap-[12px] w-full shadow-sm hover:bg-gray-50 transition-colors"
        >
          <HiOutlineMail className="h-[22px] w-[22px]" />
          <span className="font-poppins text-[16px] font-medium tracking-[-0.32px]">
            Lanjutkan dengan Email
          </span>
        </button>
      </div>
    </div>
  );
}
