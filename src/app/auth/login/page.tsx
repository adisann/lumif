"use client";

import { useRouter } from "next/navigation";
import StatusBar from "@/components/StatusBar";
import { HiArrowLeft } from "react-icons/hi2";
import { useState } from "react";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy login, bypass actual authentication
    router.push("/home");
  };

  return (
    <div className="bg-[#FAFAFA] relative h-full w-full flex flex-col font-lexend overflow-y-auto">

      {/* Top Nav */}
      <div className="flex justify-start px-[24px] pt-[20px] pb-[8px] h-[48px] shrink-0">
        <button
          onClick={() => router.back()}
          className="flex h-[48px] w-[48px] items-center justify-center rounded-[10px] bg-white border border-[#e5e5e5]"
        >
          <HiArrowLeft className="h-[20px] w-[20px] text-black" />
        </button>
      </div>

      {/* Header */}
      <div className="px-[24px] mt-[24px] mb-[32px]">
        <h1 className="font-poppins text-[28px] font-bold text-black tracking-[-0.56px] leading-[1.2] mb-[8px]">
          Selamat Datang<br/>Kembali
        </h1>
        <p className="text-[14px] text-[#666] leading-[1.5]">
          Silakan masukkan alamat email dan kata sandi kamu.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="px-[24px] flex flex-col flex-1">
        
        {/* Email Field */}
        <div className="flex flex-col gap-[8px] mb-[16px]">
          <label className="text-[14px] font-medium text-black">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Masukkan email"
            className="h-[48px] px-[16px] rounded-[10px] bg-white border border-[#e5e5e5] text-[14px] text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
            required
          />
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-[8px] mb-[16px]">
          <label className="text-[14px] font-medium text-black">Kata Sandi</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan kata sandi"
            className="h-[48px] px-[16px] rounded-[10px] bg-white border border-[#e5e5e5] text-[14px] text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
            required
          />
        </div>

        {/* Remember me & Forgot Password */}
        <div className="flex justify-between items-center mb-[40px]">
          <label className="flex items-center gap-[8px] cursor-pointer">
            <input type="checkbox" className="w-[16px] h-[16px] rounded-[4px] accent-black cursor-pointer" />
            <span className="text-[12px] text-black">Tetap masuk</span>
          </label>
          <button type="button" className="text-[12px] font-medium text-black underline">
            Lupa kata sandi?
          </button>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="bg-black text-white rounded-[10px] h-[48px] w-full flex items-center justify-center font-poppins text-[16px] font-bold tracking-[-0.32px] shadow-md hover:bg-gray-800 transition-colors mt-auto mb-[24px]"
        >
          Masuk
        </button>

        {/* Register Link */}
        <div className="text-center pb-[34px]">
          <span className="text-[14px] text-black">
            Belum punya akun?{" "}
            <button type="button" className="font-bold underline">
              Buat akun
            </button>
          </span>
        </div>
      </form>
    </div>
  );
}
