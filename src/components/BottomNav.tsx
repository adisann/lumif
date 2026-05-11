"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { 
  Home, 
  PieChart, 
  Users, 
  Settings, 
  Zap,
  MessageCircle,
  Heart,
  X,
  ChevronRight,
  BookOpen,
  ClipboardList
} from "lucide-react";
import UrgeCheckInModal from "@/components/UrgeCheckInModal";

const QUICK_ACTIONS = [
  {
    title: "Curhat ke Komunitas",
    desc: "Mengobrol sesama pejuang",
    icon: MessageCircle,
    href: "/community",
  },
  {
    title: "Catat Hasrat",
    desc: "Rekam intensitas godaan",
    icon: Zap,
    action: "urge-checkin",
  },
  {
    title: "Latihan Napas",
    desc: "Ambil 2 menit relaksasi",
    icon: Heart,
    href: "/exercises/breathing",
  },
  {
    title: "Modul Edukasi",
    desc: "Belajar tentang pemulihan",
    icon: BookOpen,
    href: "/modules",
  },
  {
    title: "Rutinitas Harian",
    desc: "Checklist pemulihanmu",
    icon: ClipboardList,
    href: "/routines",
  },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);
  const [showUrgeCheckIn, setShowUrgeCheckIn] = useState(false);

  const navItems = [
    { path: "/home", icon: Home, label: "Home" },
    { path: "/insight", icon: PieChart, label: "Insight" },
    { path: "__bolt__", icon: Zap, label: "Aksi", isBolt: true },
    { path: "/community", icon: Users, label: "Komunitas" },
    { path: "/profile", icon: Settings, label: "Setelan" },
  ];

  return (
    <>
      {/* Dark Overlay + Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
            onClick={() => setShowModal(false)}
          />

          {/* Modal Content */}
          <div className="relative z-10 w-full flex flex-col items-center gap-[16px] pb-[40px] px-[20px] animate-slideUp">
            {/* Card */}
            <div className="bg-white rounded-[32px] w-full px-[20px] py-[32px] flex flex-col gap-[20px] shadow-2xl">
              <h3 className="font-poppins font-bold text-[18px] text-[#0F172A] px-2 mb-2">Aksi Cepat</h3>
              {QUICK_ACTIONS.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setShowModal(false);
                    if (action.action === "urge-checkin") {
                      setShowUrgeCheckIn(true);
                      return;
                    }

                    if (action.href) {
                      router.push(action.href);
                    }
                  }}
                  className="flex items-center justify-between w-full group p-2 hover:bg-gray-50 rounded-2xl transition-colors"
                >
                  <div className="flex items-center gap-[16px]">
                    <div className="bg-[#2D936C] w-[48px] h-[48px] rounded-[14px] flex items-center justify-center shrink-0 shadow-sm">
                      <action.icon className="w-[24px] h-[24px] text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-poppins font-bold text-[15px] text-[#0F172A] leading-[1.3]">
                        {action.title}
                      </p>
                      <p className="text-[12px] text-[#64748B] leading-[1.3]">
                        {action.desc}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-[20px] h-[20px] text-[#94A3B8] group-hover:text-[#2D936C] transition-colors shrink-0" />
                </button>
              ))}
            </div>

            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="bg-white w-[56px] h-[56px] rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-transform"
            >
              <X className="w-[28px] h-[28px] text-[#0F172A]" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-lg border-t border-[#F1F5F9] px-[20px] pb-[20px] pt-[12px] z-50">
        <div className="flex justify-between items-center max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;

            if (item.isBolt) {
              return (
                <button
                  key={item.path}
                  onClick={() => setShowModal(true)}
                  className="relative -mt-[40px]"
                >
                  <div className="bg-[#EDBF45] w-[56px] h-[56px] rounded-full flex items-center justify-center shadow-lg shadow-amber-200 hover:scale-110 active:scale-95 transition-all border-4 border-white">
                    <Icon className="w-[28px] h-[28px] text-[#0F172A] fill-current" />
                  </div>
                </button>
              );
            }

            const isActive = pathname.startsWith(item.path);
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`flex flex-col items-center gap-[4px] transition-all min-w-[60px] ${
                  isActive ? "text-[#2D936C] scale-110" : "text-[#94A3B8] hover:text-[#475569]"
                }`}
              >
                <Icon className={`w-[24px] h-[24px] ${isActive ? 'fill-emerald-50' : ''}`} />
                <span
                  className={`text-[10px] font-bold ${
                    isActive ? "text-[#2D936C]" : "text-[#94A3B8]"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <UrgeCheckInModal
        isOpen={showUrgeCheckIn}
        onClose={() => setShowUrgeCheckIn(false)}
      />
    </>
  );
}
