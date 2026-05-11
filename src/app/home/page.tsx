"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
  ClipboardList,
} from "lucide-react";
import Image from "next/image";
import BottomNav from "@/components/BottomNav";
import EmergencyFlow from "@/components/EmergencyFlow";
import UpdateKondisiModal from "@/components/UpdateKondisiModal";
import RelapseResetFlow from "@/components/RelapseResetFlow";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

type Mission = {
  id: string;
  text: string;
  completed: boolean;
};

function getTodayLocalDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function DashboardScreen() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [isUpdateKondisiOpen, setIsUpdateKondisiOpen] = useState(false);
  const [isEmergencyFlowOpen, setIsEmergencyFlowOpen] = useState(false);
  const [isRelapseResetOpen, setIsRelapseResetOpen] = useState(false);

  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoadingMissions, setIsLoadingMissions] = useState(true);
  const [missionError, setMissionError] = useState("");
  const [userName, setUserName] = useState("John");

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoadingMissions(true);
      setMissionError("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace("/auth/login");
        return;
      }

      const emailName = user.email?.split("@")[0] ?? "John";
      setUserName(emailName);

      const today = getTodayLocalDate();

      const { data: existingMissions, error: missionErrorResponse } =
        await supabase
          .from("daily_missions")
          .select("id, text, completed")
          .eq("user_id", user.id)
          .eq("mission_date", today)
          .order("created_at", { ascending: true });

      if (missionErrorResponse) {
        console.error("Gagal mengambil daily_missions:", missionErrorResponse);
        setMissionError("Gagal memuat misi harian.");
        setIsLoadingMissions(false);
        return;
      }

      if (existingMissions && existingMissions.length > 0) {
        setMissions(existingMissions);
        setIsLoadingMissions(false);
        return;
      }

      const defaultMissions = [
        {
          user_id: user.id,
          mission_date: today,
          text: "Minum air 2 gelas",
          completed: false,
        },
        {
          user_id: user.id,
          mission_date: today,
          text: "Latihan pernafasan",
          completed: false,
        },
        {
          user_id: user.id,
          mission_date: today,
          text: "Evaluasi harian",
          completed: false,
        },
      ];

      const { data: insertedMissions, error: insertError } = await supabase
        .from("daily_missions")
        .insert(defaultMissions)
        .select("id, text, completed");

      if (insertError) {
        console.error("Gagal membuat daily_missions:", insertError);
        setMissionError("Gagal membuat misi harian.");
        setIsLoadingMissions(false);
        return;
      }

      setMissions(insertedMissions ?? []);
      setIsLoadingMissions(false);
    };

    loadDashboardData();
  }, [router, supabase]);

  const toggleMission = async (id: string) => {
    const targetMission = missions.find((mission) => mission.id === id);
    if (!targetMission) return;

    const nextCompleted = !targetMission.completed;

    setMissions((prev) =>
      prev.map((mission) =>
        mission.id === id ? { ...mission, completed: nextCompleted } : mission
      )
    );

    const { error } = await supabase
      .from("daily_missions")
      .update({ completed: nextCompleted })
      .eq("id", id);

    if (error) {
      console.error("Gagal update mission:", error);

      setMissions((prev) =>
        prev.map((mission) =>
          mission.id === id
            ? { ...mission, completed: targetMission.completed }
            : mission
        )
      );

      setMissionError("Gagal menyimpan perubahan misi.");
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#FAFAFA] font-lexend">
      <div className="flex-1 overflow-y-auto pb-[100px]">
        <div className="relative rounded-b-[40px] bg-[#2D936C] px-[24px] pb-[60px] pt-[16px]">
          <div className="mb-[32px] flex items-center justify-between">
            <div className="flex items-center gap-[12px]">
              <div className="h-[40px] w-[40px] overflow-hidden rounded-full border-2 border-white/30 bg-white/20">
                <Image
                  src="/assets/bear 2.png"
                  alt="Avatar"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>

              <div className="text-white">
                <p className="font-poppins text-[12px] leading-[1.2] opacity-80">
                  Selamat pagi,
                </p>
                <p className="font-poppins text-[16px] font-bold leading-[1.2]">
                  {userName}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="relative rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
              onClick={() => { }}
            >
              <Bell className="h-[24px] w-[24px] text-white" />
              <div className="absolute right-[10px] top-[10px] h-[8px] w-[8px] rounded-full border border-[#2D936C] bg-red-500" />
            </button>
          </div>

          <div className="mb-[32px] flex animate-fadeInUp flex-col items-center text-center">
            <h1 className="mb-[8px] font-poppins text-[36px] font-bold tracking-[-0.64px] text-white">
              3 Hari Bersih
            </h1>

            <p className="max-w-[280px] text-[13px] leading-[1.5] text-white/80">
              4 hari lagi menuju pemulihan fokus dan energi yang lebih baik.
            </p>
          </div>

          <div className="flex justify-between gap-[12px]">
            <div className="flex-1 rounded-[20px] border border-white/10 bg-[#257B5A] p-[12px] text-center">
              <div className="mb-[4px] font-poppins text-[20px] font-bold leading-none text-white">
                9
              </div>
              <div className="text-[11px] text-white/70">Urge lewat</div>
            </div>

            <div className="flex-1 rounded-[20px] border border-white/10 bg-[#257B5A] p-[12px] text-center">
              <div className="mb-[4px] font-poppins text-[20px] font-bold leading-none text-white">
                5
              </div>
              <div className="text-[11px] text-white/70">Jam</div>
            </div>

            <div className="flex-1 rounded-[20px] border border-white/10 bg-[#257B5A] p-[12px] text-center">
              <div className="mb-[4px] font-poppins text-[20px] font-bold leading-none text-white">
                6/10
              </div>
              <div className="text-[11px] text-white/70">Energi Pulih</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 -mt-[35px] mb-[24px] px-[24px]">
          <div className="flex items-center justify-between rounded-[24px] border border-[#F1F5F9] bg-white p-[20px] shadow-[0px_8px_30px_rgba(0,0,0,0.08)]">
            <div>
              <h3 className="font-poppins text-[15px] font-bold text-[#0F172A]">
                Evaluasi Harian
              </h3>
              <p className="text-[12px] text-[#64748B]">
                Bagaimana perasaan Anda hari ini?
              </p>
            </div>

            <Button
              onClick={() => setIsUpdateKondisiOpen(true)}
              className="flex h-auto gap-2 rounded-[14px] bg-[#2D936C] px-[16px] py-[8px] font-bold hover:bg-[#257B5A]"
            >
              Evaluasi
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-[24px] px-[24px]">
          <button
            type="button"
            onClick={() => setIsEmergencyFlowOpen(true)}
            className="flex w-full items-center gap-[16px] rounded-[24px] bg-[#D82C1C] p-[20px] text-left shadow-lg shadow-red-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="rounded-2xl bg-white/20 p-3">
              <AlertCircle className="h-8 w-8 text-white" />
            </div>

            <div>
              <h3 className="font-poppins text-[18px] font-bold uppercase leading-tight tracking-wide text-white">
                BUTUH BANTUAN
              </h3>
              <p className="text-[13px] text-white/80">
                Butuh bantuan sekarang? Klik di sini
              </p>
            </div>
          </button>

          <section>
            <h2 className="mb-[12px] font-poppins text-[14px] font-bold text-[#0F172A]">
              Misi Kecil Hari Ini
            </h2>

            <div className="flex flex-col gap-[12px]">
              {isLoadingMissions && (
                <div className="rounded-[20px] border border-[#F1F5F9] bg-white p-[16px] text-[13px] text-[#64748B] shadow-sm">
                  Memuat misi hari ini...
                </div>
              )}

              {!isLoadingMissions && missionError && (
                <div className="rounded-[20px] border border-red-100 bg-red-50 p-[16px] text-[13px] text-red-600 shadow-sm">
                  {missionError}
                </div>
              )}

              {!isLoadingMissions &&
                !missionError &&
                missions.map((mission) => (
                  <button
                    key={mission.id}
                    type="button"
                    onClick={() => toggleMission(mission.id)}
                    className="group flex items-center justify-between rounded-[20px] border border-[#F1F5F9] bg-white p-[16px] text-left shadow-sm transition-all hover:border-[#2D936C]/30"
                  >
                    <div className="flex items-center gap-[12px]">
                      <div
                        className={`rounded-lg p-2 transition-colors ${mission.completed
                            ? "bg-green-50 text-green-600"
                            : "bg-gray-50 text-gray-400 group-hover:bg-green-50"
                          }`}
                      >
                        <Check className="h-5 w-5" />
                      </div>

                      <span
                        className={`text-[14px] font-medium transition-all ${mission.completed
                            ? "text-[#94A3B8] line-through"
                            : "text-[#334155]"
                          }`}
                      >
                        {mission.text}
                      </span>
                    </div>

                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all ${mission.completed
                          ? "border-[#2D936C] bg-[#2D936C]"
                          : "border-[#CBD5E1] bg-white group-hover:border-[#2D936C]"
                        }`}
                    >
                      {mission.completed && (
                        <Check className="h-4 w-4 text-white" />
                      )}
                    </div>
                  </button>
                ))}
            </div>
          </section>

          <button
            type="button"
            onClick={() => setIsRelapseResetOpen(true)}
            className="flex w-full flex-col gap-1 rounded-[20px] border border-[#F1F5F9] bg-white p-[16px] text-left shadow-sm transition-colors hover:bg-gray-50"
          >
            <h3 className="font-poppins text-[15px] font-bold text-[#2D936C]">
              Aku butuh reset
            </h3>
            <p className="text-[12px] text-[#64748B]">
              Lapor relaps dan mulai kembali
            </p>
          </button>

          <section>
            <h2 className="mb-[16px] font-poppins text-[14px] font-bold text-[#0F172A]">
              Menu Lainnya
            </h2>

            <div className="grid grid-cols-4 gap-[16px]">
              {[
                {
                  name: "Komunitas",
                  icon: MessageCircle,
                  color: "bg-emerald-100 text-emerald-600",
                  href: "/community",
                },
                {
                  name: "Permainan",
                  icon: Puzzle,
                  color: "bg-amber-100 text-amber-600",
                  href: "/home",
                },
                {
                  name: "Pernapasan",
                  icon: Heart,
                  color: "bg-rose-100 text-rose-600",
                  href: "/exercises/breathing",
                },
                {
                  name: "Lainnya",
                  icon: Grid,
                  color: "bg-indigo-100 text-indigo-600",
                  href: "/more",
                },
              ].map((menu, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => router.push(menu.href)}
                  className="flex flex-col items-center gap-[8px]"
                >
                  <div
                    className={`flex h-[60px] w-[60px] items-center justify-center rounded-[18px] shadow-sm transition-transform hover:scale-110 active:scale-95 ${menu.color}`}
                  >
                    <menu.icon className="h-7 w-7" />
                  </div>

                  <span className="text-[11px] font-medium text-[#475569]">
                    {menu.name}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="mb-[12px]">
            <h2 className="mb-[16px] font-poppins text-[14px] font-bold text-[#0F172A]">
              Menumbuhkan Kepercayaan Diri
            </h2>

            <div className="grid grid-cols-2 gap-[16px]">
              <button
                type="button"
                onClick={() => router.push("/modules")}
                className="flex flex-col gap-[12px] rounded-[24px] border border-[#C6E1D7] bg-[#E7F3EF] p-[20px] text-left transition-all hover:scale-[1.02]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <BookOpen className="h-6 w-6 text-[#2D936C]" />
                </div>

                <div>
                  <h3 className="font-poppins text-[16px] font-bold text-[#1E293B]">
                    Modul
                  </h3>
                  <p className="text-[12px] text-[#64748B]">
                    Edukasi & Belajar
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => router.push("/routines")}
                className="flex flex-col gap-[12px] rounded-[24px] border border-[#FBEAC3] bg-[#FFF8E7] p-[20px] text-left transition-all hover:scale-[1.02]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <ClipboardList className="h-6 w-6 text-[#EAB308]" />
                </div>

                <div>
                  <h3 className="font-poppins text-[16px] font-bold text-[#1E293B]">
                    Rutinitas
                  </h3>
                  <p className="text-[12px] text-[#64748B]">
                    Checklist Harian
                  </p>
                </div>
              </button>
            </div>
          </section>
        </div>
      </div>

      <UpdateKondisiModal
        isOpen={isUpdateKondisiOpen}
        onClose={() => setIsUpdateKondisiOpen(false)}
      />
      <EmergencyFlow
        isOpen={isEmergencyFlowOpen}
        onClose={() => setIsEmergencyFlowOpen(false)}
      />
      <RelapseResetFlow
        isOpen={isRelapseResetOpen}
        onClose={() => setIsRelapseResetOpen(false)}
      />

      <BottomNav />
    </div>
  );
}
