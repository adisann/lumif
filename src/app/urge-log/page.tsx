"use client";

import { useEffect, useMemo, useState } from "react";
import BottomNav from "@/components/BottomNav";
import UrgeCheckInModal from "@/components/UrgeCheckInModal";
import { createClient } from "@/lib/supabase/client";
import { readUserCache, writeUserCache } from "@/lib/userCache";
import ScreenHeader from "@/components/ScreenHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Clock, CheckCircle2, Zap } from "lucide-react";

type UrgeRecord = {
  id: string;
  created_at: string;
  urge_score: number;
  mood_score: number;
  energy_score: number;
  triggers: string[];
  context: string;
  status: string;
  user_note: string;
  isSample?: boolean;
};

const SAMPLE_RECORDS: UrgeRecord[] = [
  {
    id: "sample-1",
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    urge_score: 7,
    mood_score: 4,
    energy_score: 5,
    triggers: ["Lelah", "Malam hari", "Sendirian"],
    context: "Kamar tidur",
    status: "surfed",
    user_note:
      "Merasakan dorongan kuat setelah scrolling larut malam. Memilih minum air dan melakukan latihan pernapasan 4-4.",
    isSample: true,
  },
  {
    id: "sample-2",
    created_at: new Date(Date.now() - 3600000 * 28).toISOString(),
    urge_score: 5,
    mood_score: 6,
    energy_score: 6,
    triggers: ["Bosan", "Stres kerja"],
    context: "Meja kerja",
    status: "surfed",
    user_note: "Beralih jalan santai 5 menit ke luar ruangan.",
    isSample: true,
  },
];

export default function UrgeLogPage() {
  const supabase = useMemo(() => createClient(), []);

  const [records, setRecords] = useState<UrgeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchRecords = async (withLoading = true, bypassCache = false) => {
    if (withLoading) {
      setIsLoading(true);
    }
    setFetchError("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsAuthenticated(false);
        setRecords(SAMPLE_RECORDS);
        setIsLoading(false);
        return;
      }

      setIsAuthenticated(true);

      if (!bypassCache) {
        const cached = readUserCache<UrgeRecord[]>(user.id, "urge_log");
        if (cached) {
          setRecords(cached.data);
          setIsLoading(false);
          if (cached.isFresh) {
            return;
          }
        }
      }

      const { data, error } = await supabase
        .from("checkins")
        .select("id, created_at, urge_score, mood_score, energy_score, note")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        console.error("Gagal memuat catatan hasrat:", error);
        setFetchError("Gagal memuat riwayat catatan dari server.");
        setIsLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        setRecords([]);
        writeUserCache(user.id, "urge_log", []);
        setIsLoading(false);
        return;
      }

      const parsed: UrgeRecord[] = data.map((item) => {
        let triggers: string[] = [];
        let context = "Umum";
        let status = "active";
        let userNote = "";

        if (item.note) {
          try {
            const parsedNote = JSON.parse(item.note);
            triggers = parsedNote.triggers || parsedNote.feelings || [];
            context = parsedNote.context || "Umum";
            status = parsedNote.status || "active";
            userNote = parsedNote.user_note || "";
          } catch {
            userNote = item.note;
          }
        }

        return {
          id: item.id,
          created_at: item.created_at,
          urge_score: item.urge_score,
          mood_score: item.mood_score,
          energy_score: item.energy_score,
          triggers,
          context,
          status,
          user_note: userNote,
        };
      });

      setRecords(parsed);
      writeUserCache(user.id, "urge_log", parsed);
      setIsLoading(false);
    } catch {
      if (!isAuthenticated) {
        setRecords(SAMPLE_RECORDS);
      } else {
        setFetchError("Koneksi bermasalah saat memuat catatan.");
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadInitial = async () => {
      if (!isMounted) return;
      await fetchRecords(false);
    };

    const handleDataUpdated = () => {
      if (!isMounted) return;
      void fetchRecords(false, true);
    };

    loadInitial();
    window.addEventListener("lumif:data-updated", handleDataUpdated);

    return () => {
      isMounted = false;
      window.removeEventListener("lumif:data-updated", handleDataUpdated);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showingSample = !isAuthenticated && records.some((r) => r.isSample);

  return (
    <div className="lumif-with-nav relative flex min-h-dvh flex-col bg-surface-soft font-sans text-foreground">
      <ScreenHeader
        title="Catatan Hasrat & Trigger"
        subtitle="Pantau pola pemicu impuls"
        rightAction={
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs transition hover:bg-primary-dark"
            aria-label="Catat Hasrat Baru"
          >
            <Plus className="h-5 w-5" aria-hidden="true" />
          </button>
        }
      />

      <main className="flex-1 px-4 pb-[calc(110px+env(safe-area-inset-bottom))] pt-5 md:px-8 md:pb-10">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="rounded-3xl bg-[#257B5A] p-6 text-white shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white/90">
                    Sadari & Rangkul
                  </p>
                  <h2 className="mt-1 font-heading text-lg font-bold">
                    Merasa ada dorongan?
                  </h2>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-[#EDBF45]">
                  <Zap className="h-6 w-6" aria-hidden="true" />
                </div>
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-white/90">
                Mencatat dorongan saat muncul membantu memindahkan kendali dari
                impuls otomatis ke kesadaran penuh.
              </p>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="mt-5 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-white py-2.5 font-heading text-xs font-bold text-[#257B5A] shadow-xs transition hover:bg-white/90"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Catat Hasrat Sekarang
              </button>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-heading text-sm font-bold text-foreground md:text-base">
                Riwayat Catatan
              </h2>
              <div className="flex items-center gap-2">
                {isLoading ? (
                  <Skeleton className="h-5 w-28 rounded-md" />
                ) : (
                  <>
                    {showingSample && (
                      <span className="text-xs font-medium text-muted-foreground">
                        Contoh Offline ·
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {records.length} tercatat
                    </span>
                  </>
                )}
              </div>
            </div>

            {fetchError && (
              <div className="mb-3 rounded-xl border border-danger/30 bg-danger/10 px-4 py-2.5 text-xs font-medium text-danger">
                {fetchError}
              </div>
            )}

            {isLoading ? (
              <div className="flex flex-col gap-3" aria-busy="true" aria-label="Memuat riwayat catatan hasrat">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="space-y-3 rounded-2xl border border-border bg-card p-4 shadow-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-7 w-7 rounded-lg" />
                        <Skeleton className="h-4 w-28" />
                      </div>
                      <Skeleton className="h-3.5 w-20" />
                    </div>
                    <div className="flex gap-1.5">
                      <Skeleton className="h-5 w-16 rounded-md" />
                      <Skeleton className="h-5 w-20 rounded-md" />
                    </div>
                    <Skeleton className="h-10 w-full rounded-xl" />
                  </div>
                ))}
              </div>
            ) : records.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-xs">
                <CheckCircle2 className="mx-auto h-9 w-9 text-primary" aria-hidden="true" />
                <h3 className="mt-2 font-heading text-sm font-bold text-card-foreground">
                  Belum Ada Catatan
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Catat dorongan saat muncul agar kamu bisa mengenali pola waktu
                  dan pemicunya.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {records.map((record) => {
                  const dateObj = new Date(record.created_at);
                  const formattedDate = dateObj.toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <article
                      key={record.id}
                      className="rounded-2xl border border-border bg-card p-4 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
                              record.urge_score >= 7
                                ? "bg-destructive/15 text-destructive"
                                : record.urge_score >= 4
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                                : "bg-primary-light text-primary"
                            }`}
                          >
                            {record.urge_score}
                          </span>
                          <span className="font-heading text-xs font-bold text-card-foreground">
                            Intensitas {record.urge_score}/10
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{formattedDate}</span>
                        </div>
                      </div>

                      {record.triggers.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {record.triggers.map((trigger) => (
                            <span
                              key={trigger}
                              className="rounded-md bg-surface-soft px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                            >
                              {trigger}
                            </span>
                          ))}
                        </div>
                      )}

                      {record.user_note && (
                        <p className="mt-2.5 rounded-xl bg-surface-soft p-2.5 text-xs text-muted-foreground">
                          &ldquo;{record.user_note}&rdquo;
                        </p>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <UrgeCheckInModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          fetchRecords(false, true);
        }}
      />
      <BottomNav />
    </div>
  );
}
