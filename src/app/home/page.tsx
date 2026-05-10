"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  MessageCircle,
  Puzzle,
  Heart,
  Grid,
  ChevronRight,
  Check,
  AlertCircle,
  BookOpen,
  ClipboardList
} from "lucide-react";
import Image from "next/image";
import BottomNav from "@/components/BottomNav";
import EmergencyFlow from "@/components/EmergencyFlow";
import UpdateKondisiModal from "@/components/UpdateKondisiModal";
import RelapseResetFlow from "@/components/RelapseResetFlow";
import { Button } from "@/components/ui/button";

export default function DashboardScreen() {
  const router = useRouter();
  const [isUpdateKondisiOpen, setIsUpdateKondisiOpen] = useState(false);
  const [isEmergencyFlowOpen, setIsEmergencyFlowOpen] = useState(false);
  const [isRelapseResetOpen, setIsRelapseResetOpen] = useState(false);

  const [missions, setMissions] = useState([
    { id: 1, text: "Minum air 2 gelas", completed: false },
    { id: 2, text: "Latihan pernafasan", completed: true },
    { id: 3, text: "Evaluasi harian", completed: false },
  ]);

  const toggleMission = (id: number) => {
    setMissions(missions.map(m => m.id === id ? { ...m, completed: !m.completed } : m));
  };

  return (
    <div className="bg-[#FAFAFA] relative h-full w-full flex flex-col font-lexend overflow-hidden">

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto pb-[100px]">
        {/* Top Header Section */}
        <div className="bg-[#2D936C] rounded-b-[40px] pt-[16px] pb-[60px] relative px-[24px]">

          {/* User & Notification */}
          <div className="flex justify-between items-center mb-[32px]">
            <div className="flex items-center gap-[12px]">
              <div className="h-[40px] w-[40px] rounded-full overflow-hidden bg-white/20 border-2 border-white/30">
                <Image
                  src="/assets/bear 2.png"
                  alt="Avatar"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <div className="text-white">
                <p className="font-poppins text-[12px] leading-[1.2] opacity-80">Selamat pagi,</p>
                <p className="font-poppins font-bold text-[16px] leading-[1.2]">John</p>
              </div>
            </div>
            <button className="relative p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors" onClick={() => { }}>
              <Bell className="h-[24px] w-[24px] text-white" />
              <div className="absolute top-[10px] right-[10px] h-[8px] w-[8px] bg-red-500 rounded-full border border-[#2D936C]" />
            </button>
          </div>

          {/* Main Stats */}
          <div className="flex flex-col items-center text-center mb-[32px] animate-fadeInUp">
            <h1 className="font-poppins text-[36px] font-bold text-white tracking-[-0.64px] mb-[8px]">
              3 Hari Bersih
            </h1>
            <p className="text-white/80 text-[13px] leading-[1.5] max-w-[280px]">
              4 hari lagi menuju pemulihan fokus dan energi yang lebih baik.
            </p>
          </div>

          {/* Metrics Row */}
          <div className="flex justify-between gap-[12px]">
            <div className="flex-1 bg-[#257B5A] rounded-[20px] p-[12px] text-center border border-white/10">
              <div className="font-poppins text-[20px] font-bold text-white leading-none mb-[4px]">9</div>
              <div className="text-[11px] text-white/70">Urge lewat</div>
            </div>
            <div className="flex-1 bg-[#257B5A] rounded-[20px] p-[12px] text-center border border-white/10">
              <div className="font-poppins text-[20px] font-bold text-white leading-none mb-[4px]">5</div>
              <div className="text-[11px] text-white/70">Jam</div>
            </div>
            <div className="flex-1 bg-[#257B5A] rounded-[20px] p-[12px] text-center border border-white/10">
              <div className="font-poppins text-[20px] font-bold text-white leading-none mb-[4px]">6/10</div>
              <div className="text-[11px] text-white/70">Energi Pulih</div>
            </div>
          </div>
        </div>

        {/* Evaluation Card */}
        <div className="px-[24px] -mt-[35px] relative z-10 mb-[24px]">
          <div className="bg-white rounded-[24px] shadow-[0px_8px_30px_rgba(0,0,0,0.08)] p-[20px] flex justify-between items-center border border-[#F1F5F9]">
            <div>
              <h3 className="font-poppins font-bold text-[15px] text-[#0F172A]">Evaluasi Harian</h3>
              <p className="text-[12px] text-[#64748B]">Bagaimana perasaan Anda hari ini?</p>
            </div>
            <Button
              onClick={() => setIsUpdateKondisiOpen(true)}
              className="bg-[#2D936C] hover:bg-[#257B5A] rounded-[14px] px-[16px] py-[8px] h-auto font-bold flex gap-2"
            >
              Evaluasi
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="px-[24px] flex flex-col gap-[24px]">

          {/* Emergency Help Banner */}
          <button
            onClick={() => setIsEmergencyFlowOpen(true)}
            className="w-full bg-[#D82C1C] rounded-[24px] p-[20px] flex items-center gap-[16px] text-left hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-red-200"
          >
            <div className="bg-white/20 p-3 rounded-2xl">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-poppins font-bold text-[18px] text-white leading-tight uppercase tracking-wide">BUTUH BANTUAN</h3>
              <p className="text-white/80 text-[13px]">Butuh bantuan sekarang? Klik di sini</p>
            </div>
          </button>

          {/* Daily Missions Section */}
          <section>
            <h2 className="font-poppins text-[14px] font-bold text-[#0F172A] mb-[12px]">Misi Kecil Hari Ini</h2>
            <div className="flex flex-col gap-[12px]">
              {missions.map((mission) => (
                <button
                  key={mission.id}
                  onClick={() => toggleMission(mission.id)}
                  className="bg-white rounded-[20px] p-[16px] flex justify-between items-center border border-[#F1F5F9] shadow-sm hover:border-[#2D936C]/30 transition-all text-left group"
                >
                  <div className="flex items-center gap-[12px]">
                    <div className={`p-2 rounded-lg transition-colors ${mission.completed ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400 group-hover:bg-green-50'}`}>
                      <Check className="w-5 h-5" />
                    </div>
                    <span className={`text-[14px] font-medium transition-all ${mission.completed ? 'text-[#94A3B8] line-through' : 'text-[#334155]'}`}>
                      {mission.text}
                    </span>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${mission.completed ? 'bg-[#2D936C] border-[#2D936C]' : 'border-[#CBD5E1] bg-white group-hover:border-[#2D936C]'
                      }`}
                  >
                    {mission.completed && <Check className="w-4 h-4 text-white" />}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Reset Button Section */}
          <button
            onClick={() => setIsRelapseResetOpen(true)}
            className="w-full bg-white rounded-[20px] border border-[#F1F5F9] p-[16px] flex flex-col gap-1 text-left hover:bg-gray-50 transition-colors shadow-sm"
          >
            <h3 className="font-poppins font-bold text-[15px] text-[#2D936C]">Aku butuh reset</h3>
            <p className="text-[12px] text-[#64748B]">Lapor relaps dan mulai kembali</p>
          </button>

          {/* Quick Access Menus */}
          <section>
            <h2 className="font-poppins text-[14px] font-bold text-[#0F172A] mb-[16px]">Menu Lainnya</h2>
            <div className="grid grid-cols-4 gap-[16px]">
              {[
                { name: 'Komunitas', icon: MessageCircle, color: 'bg-emerald-100 text-emerald-600', href: '/community' },
                { name: 'Permainan', icon: Puzzle, color: 'bg-amber-100 text-amber-600', href: '/home' },
                { name: 'Pernapasan', icon: Heart, color: 'bg-rose-100 text-rose-600', href: '/exercises/breathing' },
                { name: 'Lainnya', icon: Grid, color: 'bg-indigo-100 text-indigo-600', href: '/more' },
              ].map((menu, i) => (
                <button
                  key={i}
                  onClick={() => router.push(menu.href)}
                  className="flex flex-col items-center gap-[8px]"
                >
                  <div className={`w-[60px] h-[60px] ${menu.color} rounded-[18px] flex items-center justify-center hover:scale-110 transition-transform active:scale-95 shadow-sm`}>
                    <menu.icon className="w-7 h-7" />
                  </div>
                  <span className="text-[11px] font-medium text-[#475569]">{menu.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Self-Growth Section */}
          <section className="mb-[12px]">
            <h2 className="font-poppins text-[14px] font-bold text-[#0F172A] mb-[16px]">Menumbuhkan Kepercayaan Diri</h2>
            <div className="grid grid-cols-2 gap-[16px]">
              <button
                onClick={() => router.push('/modules')}
                className="bg-[#E7F3EF] rounded-[24px] p-[20px] flex flex-col gap-[12px] text-left hover:scale-[1.02] transition-all border border-[#C6E1D7]"
              >
                <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm">
                  <BookOpen className="w-6 h-6 text-[#2D936C]" />
                </div>
                <div>
                  <h3 className="font-poppins font-bold text-[16px] text-[#1E293B]">Modul</h3>
                  <p className="text-[12px] text-[#64748B]">Edukasi & Belajar</p>
                </div>
              </button>
              <button
                onClick={() => router.push('/routines')}
                className="bg-[#FFF8E7] rounded-[24px] p-[20px] flex flex-col gap-[12px] text-left hover:scale-[1.02] transition-all border border-[#FBEAC3]"
              >
                <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm">
                  <ClipboardList className="w-6 h-6 text-[#EAB308]" />
                </div>
                <div>
                  <h3 className="font-poppins font-bold text-[16px] text-[#1E293B]">Rutinitas</h3>
                  <p className="text-[12px] text-[#64748B]">Checklist Harian</p>
                </div>
              </button>
            </div>
          </section>

        </div>
      </div>

      {/* Modals */}
      <UpdateKondisiModal isOpen={isUpdateKondisiOpen} onClose={() => setIsUpdateKondisiOpen(false)} />
      <EmergencyFlow isOpen={isEmergencyFlowOpen} onClose={() => setIsEmergencyFlowOpen(false)} />
      <RelapseResetFlow isOpen={isRelapseResetOpen} onClose={() => setIsRelapseResetOpen(false)} />

      {/* Bottom Navigation */}
      <BottomNav />

    </div>
  );
}
