"use client";

import { useRouter } from "next/navigation";
import StatusBar from "@/components/StatusBar";
import { HiArrowLeft, HiPlayCircle, HiLockClosed } from "react-icons/hi2";

const MODULES = [
  {
    id: 1,
    title: "Pengenalan modul terapi CBT & ACT",
    lessons: 5,
    duration: "15 Menit",
    locked: false,
  },
  {
    id: 2,
    title: "Mengenal Pemicu Utama",
    lessons: 5,
    duration: "15 Menit",
    locked: true,
  },
  {
    id: 3,
    title: "Rekonstruksi Kebiasaan",
    lessons: 5,
    duration: "15 Menit",
    locked: true,
  },
  {
    id: 4,
    title: "Intervensi Dini",
    lessons: 5,
    duration: "15 Menit",
    locked: true,
  },
  {
    id: 5,
    title: "Teknik Grounding",
    lessons: 5,
    duration: "15 Menit",
    locked: true,
  },
];

export default function ModulesListScreen() {
  const router = useRouter();

  return (
    <div className="bg-[#FAFAFA] relative h-full w-full flex flex-col font-lexend overflow-hidden">

      {/* Top Nav */}
      <div className="flex items-center px-[24px] pt-[20px] pb-[16px] shrink-0 bg-[#FAFAFA]">
        <button
          onClick={() => router.back()}
          className="flex h-[32px] w-[32px] items-center justify-center rounded-[8px] bg-white border border-[#e5e5e5]"
        >
          <HiArrowLeft className="h-[16px] w-[16px] text-black" />
        </button>
        <h1 className="flex-1 text-center font-poppins text-[18px] font-bold text-black tracking-[-0.36px] mr-[32px]">
          Progres Modul
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-[24px] pb-[120px]">
        
        {/* Hero Section */}
        <div className="bg-[#2D936C] rounded-[24px] p-[24px] relative overflow-hidden mb-[24px]">
          <div className="relative z-10 w-[60%]">
            <h2 className="font-poppins text-[20px] font-bold text-white leading-[1.3] mb-[16px]">
              Pembaruan Sistem untuk Membantu Mengontrol Diri
            </h2>
            <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-[12px] py-[4px]">
              <span className="text-[12px] text-white font-medium">1/5 Bab Selesai</span>
            </div>
          </div>
          {/* Decorative graphic would go here */}
          <div className="absolute right-[-20px] bottom-[-20px] w-[150px] h-[150px] bg-white/10 rounded-full blur-[20px]"></div>
          <div className="absolute right-[20px] top-[20px] w-[80px] h-[80px] bg-white/10 rounded-full blur-[10px]"></div>
        </div>

        {/* Timeline / List */}
        <div className="relative ml-[24px]">
          {/* Vertical Line */}
          <div className="absolute left-[16px] top-[24px] bottom-[24px] w-[2px] bg-[#e5e5e5]"></div>

          {/* Module Items */}
          <div className="flex flex-col gap-[32px] relative z-10">
            {MODULES.map((mod, index) => (
              <div 
                key={mod.id} 
                className="flex items-start gap-[16px] cursor-pointer"
                onClick={() => !mod.locked && router.push(`/modules/${mod.id}`)}
              >
                {/* Timeline Dot */}
                <div className={`mt-[12px] w-[34px] h-[34px] rounded-full flex items-center justify-center border-[3px] border-[#FAFAFA] shadow-sm shrink-0 ${mod.locked ? "bg-[#e5e5e5] text-[#999]" : "bg-[#2D936C] text-white"}`}>
                  {mod.locked ? <HiLockClosed className="w-[16px] h-[16px]" /> : <span className="font-bold text-[14px]">{index + 1}</span>}
                </div>

                {/* Card */}
                <div className={`flex-1 rounded-[16px] border p-[16px] transition-all ${mod.locked ? "bg-white/50 border-transparent" : "bg-white border-[#f0f0f0] shadow-sm hover:border-[#2D936C]"}`}>
                  <h3 className={`font-poppins font-bold text-[14px] leading-[1.4] mb-[8px] ${mod.locked ? "text-[#999]" : "text-black"}`}>
                    {mod.title}
                  </h3>
                  <div className="flex items-center gap-[8px] text-[12px] text-[#666]">
                    <span>{mod.lessons} Pelajaran</span>
                    <span>•</span>
                    <div className="flex items-center gap-[4px]">
                      <HiPlayCircle className="w-[14px] h-[14px]" />
                      <span>{mod.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button / CTA */}
      <div className="absolute bottom-[40px] left-0 w-full px-[24px] z-20">
        <button 
          onClick={() => router.push('/modules/1')}
          className="w-full bg-black text-white h-[56px] rounded-[16px] font-poppins font-bold text-[16px] shadow-lg hover:bg-gray-800 transition-colors"
        >
          Pelajari modul sekarang →
        </button>
      </div>
    </div>
  );
}
