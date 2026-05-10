"use client";

import { useState } from "react";
import StatusBar from "@/components/StatusBar";
import BottomNav from "@/components/BottomNav";
import { HiUser, HiLockClosed, HiBell, HiMail, HiMoon, HiChevronRight } from "react-icons/hi";

export default function ProfileScreen() {
  const [pushNotif, setPushNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="bg-[#FAFAFA] relative h-full w-full flex flex-col font-lexend overflow-hidden">

      {/* Top Nav */}
      <div className="flex items-center px-[24px] pt-[20px] pb-[16px] shrink-0 bg-[#FAFAFA]">
        <h1 className="flex-1 font-poppins text-[24px] font-bold text-black tracking-[-0.48px]">
          Pengaturan
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-[24px] pb-[100px] flex flex-col gap-[32px]">
        
        {/* Akun Section */}
        <div>
          <h2 className="font-poppins text-[16px] font-bold text-black mb-[16px]">Akun</h2>
          <div className="bg-white rounded-[16px] border border-[#f0f0f0] overflow-hidden">
            <button className="w-full flex items-center justify-between p-[16px] hover:bg-gray-50 transition-colors border-b border-[#f0f0f0]">
              <div className="flex items-center gap-[12px]">
                <div className="w-[40px] h-[40px] rounded-[10px] bg-[#f5f5f5] flex items-center justify-center text-black">
                  <HiUser className="w-[20px] h-[20px]" />
                </div>
                <span className="font-medium text-[14px] text-black">Ubah Profil</span>
              </div>
              <HiChevronRight className="w-[20px] h-[20px] text-[#999]" />
            </button>
            <button className="w-full flex items-center justify-between p-[16px] hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-[12px]">
                <div className="w-[40px] h-[40px] rounded-[10px] bg-[#f5f5f5] flex items-center justify-center text-black">
                  <HiLockClosed className="w-[20px] h-[20px]" />
                </div>
                <span className="font-medium text-[14px] text-black">Ubah Kata Sandi</span>
              </div>
              <HiChevronRight className="w-[20px] h-[20px] text-[#999]" />
            </button>
          </div>
        </div>

        {/* Notifikasi Section */}
        <div>
          <h2 className="font-poppins text-[16px] font-bold text-black mb-[16px]">Notifikasi</h2>
          <div className="bg-white rounded-[16px] border border-[#f0f0f0] overflow-hidden">
            <div className="w-full flex items-center justify-between p-[16px] border-b border-[#f0f0f0]">
              <div className="flex items-center gap-[12px]">
                <div className="w-[40px] h-[40px] rounded-[10px] bg-[#f5f5f5] flex items-center justify-center text-black">
                  <HiBell className="w-[20px] h-[20px]" />
                </div>
                <span className="font-medium text-[14px] text-black">Kirim Notifikasi</span>
              </div>
              {/* Toggle Switch */}
              <button 
                onClick={() => setPushNotif(!pushNotif)}
                className={`w-[44px] h-[24px] rounded-full relative transition-colors ${pushNotif ? 'bg-[#2D936C]' : 'bg-[#e5e5e5]'}`}
              >
                <div className={`w-[20px] h-[20px] bg-white rounded-full absolute top-[2px] transition-transform ${pushNotif ? 'translate-x-[22px]' : 'translate-x-[2px]'}`} />
              </button>
            </div>
            <div className="w-full flex items-center justify-between p-[16px]">
              <div className="flex items-center gap-[12px]">
                <div className="w-[40px] h-[40px] rounded-[10px] bg-[#f5f5f5] flex items-center justify-center text-black">
                  <HiMail className="w-[20px] h-[20px]" />
                </div>
                <span className="font-medium text-[14px] text-black">Kirim Email</span>
              </div>
              {/* Toggle Switch */}
              <button 
                onClick={() => setEmailNotif(!emailNotif)}
                className={`w-[44px] h-[24px] rounded-full relative transition-colors ${emailNotif ? 'bg-[#2D936C]' : 'bg-[#e5e5e5]'}`}
              >
                <div className={`w-[20px] h-[20px] bg-white rounded-full absolute top-[2px] transition-transform ${emailNotif ? 'translate-x-[22px]' : 'translate-x-[2px]'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Tampilan Section */}
        <div>
          <h2 className="font-poppins text-[16px] font-bold text-black mb-[16px]">Tampilan</h2>
          <div className="bg-white rounded-[16px] border border-[#f0f0f0] overflow-hidden">
            <div className="w-full flex items-center justify-between p-[16px]">
              <div className="flex items-center gap-[12px]">
                <div className="w-[40px] h-[40px] rounded-[10px] bg-[#f5f5f5] flex items-center justify-center text-black">
                  <HiMoon className="w-[20px] h-[20px]" />
                </div>
                <span className="font-medium text-[14px] text-black">Mode Gelap</span>
              </div>
              {/* Toggle Switch */}
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`w-[44px] h-[24px] rounded-full relative transition-colors ${darkMode ? 'bg-[#2D936C]' : 'bg-[#e5e5e5]'}`}
              >
                <div className={`w-[20px] h-[20px] bg-white rounded-full absolute top-[2px] transition-transform ${darkMode ? 'translate-x-[22px]' : 'translate-x-[2px]'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="pt-[16px]">
          <button className="w-full h-[48px] border border-[#e5e5e5] rounded-[10px] text-red-500 font-bold text-[14px] hover:bg-red-50 transition-colors">
            Keluar
          </button>
        </div>

      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
