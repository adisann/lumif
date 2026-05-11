"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { createClient } from "@/lib/supabase/client";
import {
  HiUser,
  HiLockClosed,
  HiBell,
  HiMail,
  HiMoon,
  HiChevronRight,
  HiArrowLeft,
  HiLogout,
} from "react-icons/hi";

export default function ProfileScreen() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [pushNotif, setPushNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const handleLogout = async () => {
    setLogoutError("");
    setIsLoggingOut(true);

    const { error } = await supabase.auth.signOut();

    setIsLoggingOut(false);

    if (error) {
      console.error("Gagal logout:", error);
      setLogoutError("Gagal keluar. Coba lagi.");
      return;
    }

    router.replace("/auth/login");
  };

  return (
    <main className="relative flex h-dvh w-full flex-col overflow-hidden bg-[#FAFAFA] font-lexend text-black">
      <header className="shrink-0 bg-white px-[24px] pb-[16px] pt-[20px]">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] border border-[#E8E8E8] bg-white transition active:scale-95"
          >
            <HiArrowLeft className="h-[18px] w-[18px] text-black" />
          </button>

          <h1 className="mr-[34px] flex-1 text-center font-poppins text-[20px] font-bold tracking-[-0.4px] text-black">
            Pengaturan
          </h1>
        </div>
      </header>

      <section className="flex-1 overflow-y-auto px-[24px] pb-[calc(110px+env(safe-area-inset-bottom))] pt-[24px]">
        <div className="mb-[24px] rounded-[24px] bg-[#2D936C] px-[20px] py-[22px] text-white shadow-[0px_10px_24px_rgba(45,147,108,0.22)]">
          <p className="font-poppins text-[18px] font-bold">
            Akun Lumif
          </p>
          <p className="mt-[4px] text-[13px] leading-[20px] text-white/80">
            Kelola akun, notifikasi, dan preferensi aplikasimu.
          </p>
        </div>

        {logoutError && (
          <div className="mb-[16px] rounded-[16px] border border-red-100 bg-red-50 px-[14px] py-[12px] text-[13px] font-medium text-red-600">
            {logoutError}
          </div>
        )}

        <div className="space-y-[24px]">
          <section>
            <h2 className="mb-[12px] font-poppins text-[14px] font-bold text-[#0F172A]">
              Akun
            </h2>

            <div className="overflow-hidden rounded-[20px] border border-[#F1F5F9] bg-white shadow-sm">
              <button
                type="button"
                className="flex w-full items-center justify-between px-[16px] py-[16px] text-left transition hover:bg-[#FAFAFA] active:scale-[0.99]"
              >
                <div className="flex items-center gap-[12px]">
                  <div className="flex h-[40px] w-[40px] items-center justify-center rounded-[14px] bg-[#E7F3EF] text-[#2D936C]">
                    <HiUser className="h-[20px] w-[20px]" />
                  </div>

                  <div>
                    <p className="font-poppins text-[14px] font-bold text-[#1E293B]">
                      Ubah Profil
                    </p>
                    <p className="mt-[2px] text-[12px] text-[#64748B]">
                      Atur nama dan informasi akun
                    </p>
                  </div>
                </div>

                <HiChevronRight className="h-[20px] w-[20px] text-[#94A3B8]" />
              </button>

              <div className="mx-[16px] h-px bg-[#F1F5F9]" />

              <button
                type="button"
                className="flex w-full items-center justify-between px-[16px] py-[16px] text-left transition hover:bg-[#FAFAFA] active:scale-[0.99]"
              >
                <div className="flex items-center gap-[12px]">
                  <div className="flex h-[40px] w-[40px] items-center justify-center rounded-[14px] bg-[#FFF8E7] text-[#EAB308]">
                    <HiLockClosed className="h-[20px] w-[20px]" />
                  </div>

                  <div>
                    <p className="font-poppins text-[14px] font-bold text-[#1E293B]">
                      Ubah Kata Sandi
                    </p>
                    <p className="mt-[2px] text-[12px] text-[#64748B]">
                      Perbarui keamanan akun
                    </p>
                  </div>
                </div>

                <HiChevronRight className="h-[20px] w-[20px] text-[#94A3B8]" />
              </button>
            </div>
          </section>

          <section>
            <h2 className="mb-[12px] font-poppins text-[14px] font-bold text-[#0F172A]">
              Notifikasi
            </h2>

            <div className="overflow-hidden rounded-[20px] border border-[#F1F5F9] bg-white shadow-sm">
              <SettingToggleRow
                icon={<HiBell className="h-[20px] w-[20px]" />}
                iconClassName="bg-[#E7F3EF] text-[#2D936C]"
                title="Kirim Notifikasi"
                description="Pengingat misi dan check-in"
                active={pushNotif}
                onToggle={() => setPushNotif((prev) => !prev)}
              />

              <div className="mx-[16px] h-px bg-[#F1F5F9]" />

              <SettingToggleRow
                icon={<HiMail className="h-[20px] w-[20px]" />}
                iconClassName="bg-[#EEF2FF] text-[#4F46E5]"
                title="Kirim Email"
                description="Ringkasan progres lewat email"
                active={emailNotif}
                onToggle={() => setEmailNotif((prev) => !prev)}
              />
            </div>
          </section>

          <section>
            <h2 className="mb-[12px] font-poppins text-[14px] font-bold text-[#0F172A]">
              Tampilan
            </h2>

            <div className="overflow-hidden rounded-[20px] border border-[#F1F5F9] bg-white shadow-sm">
              <SettingToggleRow
                icon={<HiMoon className="h-[20px] w-[20px]" />}
                iconClassName="bg-[#F3F4F6] text-[#475569]"
                title="Mode Gelap"
                description="Ubah tema tampilan aplikasi"
                active={darkMode}
                onToggle={() => setDarkMode((prev) => !prev)}
              />
            </div>
          </section>

          <section>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex h-[54px] w-full items-center justify-center gap-[10px] rounded-[16px] bg-[#D82C1C] font-poppins text-[15px] font-bold text-white shadow-[0px_10px_24px_rgba(216,44,28,0.18)] transition active:scale-[0.98] disabled:opacity-60"
            >
              <HiLogout className="h-[20px] w-[20px]" />
              {isLoggingOut ? "Keluar..." : "Keluar"}
            </button>
          </section>
        </div>
      </section>

      <BottomNav />
    </main>
  );
}

function SettingToggleRow({
  icon,
  iconClassName,
  title,
  description,
  active,
  onToggle,
}: {
  icon: React.ReactNode;
  iconClassName: string;
  title: string;
  description: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-[16px] py-[16px]">
      <div className="flex items-center gap-[12px]">
        <div
          className={`flex h-[40px] w-[40px] items-center justify-center rounded-[14px] ${iconClassName}`}
        >
          {icon}
        </div>

        <div>
          <p className="font-poppins text-[14px] font-bold text-[#1E293B]">
            {title}
          </p>
          <p className="mt-[2px] text-[12px] text-[#64748B]">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onToggle}
        className={`relative h-[26px] w-[48px] rounded-full transition-colors ${active ? "bg-[#2D936C]" : "bg-[#E5E7EB]"
          }`}
      >
        <span
          className={`absolute top-[3px] h-[20px] w-[20px] rounded-full bg-white shadow-sm transition-transform ${active ? "translate-x-[24px]" : "translate-x-[4px]"
            }`}
        />
      </button>
    </div>
  );
}