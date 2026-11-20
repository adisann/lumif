"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import ScreenHeader from "@/components/ScreenHeader";
import { createClient } from "@/lib/supabase/client";
import { clearAllUserCaches } from "@/lib/userCache";
import {
  DEFAULT_ONBOARDING,
  loadOnboardingData,
  loadUserRecoveryProfile,
  METHOD_LABELS,
  REASON_LABELS,
  ROUTINE_LABELS,
  syncOnboardingToSupabase,
  TRIGGER_LABELS,
  type OnboardingData,
} from "@/lib/onboarding";
import {
  applyLumifTheme,
  getSavedLumifTheme,
} from "@/components/ThemeInitializer";
import PetSelector from "@/components/PetSelector";
import {
  DEFAULT_PET_STATE,
  getPetProgress,
  getPetSpecies,
  loadPetState,
  savePetState,
  subscribePetState,
  unlockPetSpecies,
  type PetSpeciesId,
  type PetState,
} from "@/lib/pets";
import {
  User,
  Lock,
  Bell,
  Mail,
  Moon,
  ChevronRight,
  LogOut,
  ShieldCheck,
  X,
  HeartHandshake,
} from "lucide-react";

export default function ProfileScreen() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [userEmail, setUserEmail] = useState("demo@lumif.local");
  const [displayName, setDisplayName] = useState("Sobat Lumif");
  const [isDemoMode, setIsDemoMode] = useState(false);

  const [pushNotif, setPushNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const [petState, setPetState] = useState<PetState>(DEFAULT_PET_STATE);
  const [isPetModalOpen, setIsPetModalOpen] = useState(false);
  const [draftPetSpecies, setDraftPetSpecies] = useState<PetSpeciesId>(
    DEFAULT_PET_STATE.speciesId
  );
  const [draftPetNickname, setDraftPetNickname] = useState(
    DEFAULT_PET_STATE.nickname
  );
  const [petUnlockNotice, setPetUnlockNotice] = useState("");
  const [recoveryPlan, setRecoveryPlan] = useState<OnboardingData | null>(null);

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => {
      setDarkMode(getSavedLumifTheme());
      setPetState(loadPetState());
    });
    const unsubPet = subscribePetState(() => {
      setPetState(loadPetState());
    });

    const fetchUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user?.email) {
          setIsDemoMode(false);
          setUserEmail(user.email);
          const metaName = user.user_metadata?.display_name as string | undefined;
          setDisplayName(metaName || user.email.split("@")[0] || "Sobat Lumif");
          const loadedPlan = await loadUserRecoveryProfile(supabase);
          setRecoveryPlan(loadedPlan);
          return;
        }
      } catch {
        // Offline fallback handled below
      }

      if (typeof window !== "undefined") {
        setRecoveryPlan(loadOnboardingData() ?? DEFAULT_ONBOARDING);
        const demoUser = window.localStorage.getItem("lumif_demo_user");
        if (demoUser) {
          try {
            const parsed = JSON.parse(demoUser);
            setIsDemoMode(true);
            if (parsed.email) setUserEmail(parsed.email);
            if (parsed.name) setDisplayName(parsed.name);
          } catch {}
        }
      }
    };

    fetchUser();
    return () => {
      window.cancelAnimationFrame(raf);
      unsubPet();
    };
  }, [supabase]);

  useEffect(() => {
    if (!isEditProfileOpen && !isPasswordModalOpen && !isPetModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsEditProfileOpen(false);
        setIsPasswordModalOpen(false);
        setIsPetModalOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isEditProfileOpen, isPasswordModalOpen, isPetModalOpen]);

  const handleToggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    applyLumifTheme(next);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = draftName.trim();
    if (!cleaned) return;

    setIsSavingProfile(true);
    setErrorMessage("");
    setStatusMessage("");

    try {
      if (!isDemoMode) {
        const { error } = await supabase.auth.updateUser({
          data: { display_name: cleaned },
        });
        if (error) {
          setErrorMessage(error.message || "Gagal memperbarui profil.");
          setIsSavingProfile(false);
          return;
        }
        await syncOnboardingToSupabase(supabase, { displayName: cleaned });
      } else if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "lumif_demo_user",
          JSON.stringify({ email: userEmail, name: cleaned })
        );
      }

      setDisplayName(cleaned);
      setStatusMessage("Nama tampilan berhasil diperbarui.");
      setIsEditProfileOpen(false);
    } catch {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "lumif_demo_user",
          JSON.stringify({ email: userEmail, name: cleaned })
        );
      }
      setDisplayName(cleaned);
      setStatusMessage("Nama tampilan diperbarui di perangkat ini.");
      setIsEditProfileOpen(false);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setErrorMessage("Kata sandi minimal 6 karakter.");
      return;
    }

    setIsSavingPassword(true);
    setErrorMessage("");
    setStatusMessage("");

    if (isDemoMode) {
      setIsSavingPassword(false);
      setIsPasswordModalOpen(false);
      setNewPassword("");
      setStatusMessage(
        "Ubah kata sandi memerlukan akun Supabase aktif. Saat ini kamu berada di Mode Demo."
      );
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setErrorMessage(error.message || "Gagal mengubah kata sandi.");
      } else {
        setStatusMessage("Kata sandi berhasil diperbarui.");
        setIsPasswordModalOpen(false);
        setNewPassword("");
      }
    } catch {
      setErrorMessage("Tidak dapat terhubung ke Supabase untuk mengubah kata sandi.");
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleUnlockPet = (speciesId: PetSpeciesId) => {
    const res = unlockPetSpecies(speciesId);
    setPetUnlockNotice(res.message);
    if (res.ok) {
      setDraftPetSpecies(res.state.speciesId);
      setDraftPetNickname(res.state.nickname);
      setPetState(res.state);
    }
  };

  const handleSavePet = async (e: React.FormEvent) => {
    e.preventDefault();
    const species = getPetSpecies(draftPetSpecies);
    const cleanedNickname = draftPetNickname.trim() || species.defaultNickname;

    savePetState({
      ...petState,
      speciesId: species.id,
      nickname: cleanedNickname,
    });

    if (!isDemoMode) {
      try {
        await supabase.auth.updateUser({
          data: {
            pet_species: species.id,
            pet_name: cleanedNickname,
          },
        });
      } catch {
        // Offline keep local state
      }
    }

    setStatusMessage(
      `Pet pendamping diperbarui: ${cleanedNickname} (${species.name}).`
    );
    setIsPetModalOpen(false);
  };

  const handleLogout = async () => {
    setErrorMessage("");
    setIsLoggingOut(true);

    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore network signOut failure in offline mode
    }

    if (typeof window !== "undefined") {
      window.localStorage.removeItem("lumif_demo_user");
    }
    clearAllUserCaches();

    setIsLoggingOut(false);
    router.replace("/auth/login");
  };

  return (
    <div className="lumif-with-nav relative flex min-h-dvh flex-col bg-surface-soft font-sans text-foreground">
      <ScreenHeader
        title="Pengaturan Akun"
        subtitle="Kelola profil & preferensi"
      />

      <main className="flex-1 px-4 pb-[calc(110px+env(safe-area-inset-bottom))] pt-5 md:px-8 md:pb-10">
        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Profile Summary & Logout */}
          <div className="flex flex-col gap-4 lg:col-span-4">
            <div className="rounded-2xl bg-[#257B5A] p-5 text-white shadow-sm">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 font-heading text-lg font-bold text-white">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-heading text-base font-bold">
                    {displayName}
                  </p>
                  <p className="truncate text-xs text-white/90">{userEmail}</p>
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-white/90">
                    <ShieldCheck
                      className="h-3.5 w-3.5 text-[#EDBF45]"
                      aria-hidden="true"
                    />
                    <span>{isDemoMode ? "Mode Demo Offline" : "Akun Terhubung"}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#D82C1C] font-heading text-sm font-bold text-white shadow-xs transition hover:bg-[#B92214] active:scale-99 disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              <span>{isLoggingOut ? "Keluar..." : "Keluar dari Akun"}</span>
            </button>

            {recoveryPlan && (
              <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-heading text-sm font-bold text-card-foreground">
                    Rencana Pemulihan Awal
                  </h2>
                  <Link
                    href="/onboarding"
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Ubah
                  </Link>
                </div>

                <dl className="mt-3.5 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-muted-foreground">Alasan utama</dt>
                    <dd className="font-semibold text-foreground">
                      {REASON_LABELS[recoveryPlan.reason]}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-muted-foreground">Pemicu utama</dt>
                    <dd className="font-semibold text-foreground">
                      {TRIGGER_LABELS[recoveryPlan.trigger]}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-muted-foreground">Metode</dt>
                    <dd className="font-semibold text-foreground">
                      {METHOD_LABELS[recoveryPlan.method]}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-muted-foreground">Misi pengganti</dt>
                    <dd className="font-semibold text-foreground">
                      {ROUTINE_LABELS[recoveryPlan.routine]}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-muted-foreground">Frekuensi awal</dt>
                    <dd className="font-semibold text-foreground">
                      {recoveryPlan.frequency}x/minggu
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </div>

          {/* Account & Preferences */}
          <div className="space-y-6 lg:col-span-8">
            {statusMessage && (
              <div
                role="status"
                className="rounded-xl border border-primary/30 bg-primary-light px-4 py-3 text-xs font-semibold text-foreground"
              >
                {statusMessage}
              </div>
            )}

            {errorMessage && (
              <div
                role="alert"
                className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs font-semibold text-destructive"
              >
                {errorMessage}
              </div>
            )}

            <section>
              <h2 className="mb-2.5 font-heading text-xs font-bold tracking-wide text-muted-foreground">
                Akun
              </h2>

              <div className="divide-y divide-border/60 overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
                <button
                  type="button"
                  onClick={() => {
                    setDraftName(displayName);
                    setIsEditProfileOpen(true);
                  }}
                  className="flex min-h-[64px] w-full items-center justify-between p-4 text-left transition hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
                      <User className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-heading text-sm font-semibold text-card-foreground">
                        Ubah Profil
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Atur nama panggilan ({displayName})
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDraftPetSpecies(petState.speciesId);
                    setDraftPetNickname(petState.nickname);
                    setPetUnlockNotice("");
                    setIsPetModalOpen(true);
                  }}
                  className="flex min-h-[64px] w-full items-center justify-between p-4 text-left transition hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
                      <HeartHandshake className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-heading text-sm font-semibold text-card-foreground">
                        Koleksi & Toko Pet
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {petState.nickname} ({getPetSpecies(petState.speciesId).name}) · Lv.{" "}
                        {getPetProgress(petState.xp, getPetSpecies(petState.speciesId)).level} · {petState.coins} Koin
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setNewPassword("");
                    setErrorMessage("");
                    setIsPasswordModalOpen(true);
                  }}
                  className="flex min-h-[64px] w-full items-center justify-between p-4 text-left transition hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                      <Lock className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-heading text-sm font-semibold text-card-foreground">
                        Ubah Kata Sandi
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Perbarui keamanan akunmu
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </button>
              </div>
            </section>

            <section>
              <h2 className="mb-2.5 font-heading text-xs font-bold tracking-wide text-muted-foreground">
                Preferensi & Notifikasi
              </h2>

              <div className="divide-y divide-border/60 overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
                <SettingRow
                  icon={<Bell className="h-4 w-4" aria-hidden="true" />}
                  iconClass="bg-primary-light text-primary"
                  title="Pengingat Harian"
                  description="Pengingat misi dan evaluasi rutin"
                  active={pushNotif}
                  onToggle={() => setPushNotif((p) => !p)}
                />
                <SettingRow
                  icon={<Mail className="h-4 w-4" aria-hidden="true" />}
                  iconClass="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  title="Laporan Mingguan"
                  description="Kirim ringkasan progres lewat email"
                  active={emailNotif}
                  onToggle={() => setEmailNotif((p) => !p)}
                />
                <SettingRow
                  icon={<Moon className="h-4 w-4" aria-hidden="true" />}
                  iconClass="bg-muted text-foreground"
                  title="Mode Gelap"
                  description="Ubah tema tampilan ke malam hari"
                  active={darkMode}
                  onToggle={handleToggleDarkMode}
                />
              </div>
            </section>
          </div>
        </div>
      </main>

      {isEditProfileOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-profile-title"
        >
          <form
            onSubmit={handleSaveProfile}
            className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 id="edit-profile-title" className="font-heading text-lg font-bold">
                Ubah Nama Panggilan
              </h3>
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(false)}
                aria-label="Tutup dialog"
                className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-muted"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                Nama panggilan
              </span>
              <input
                type="text"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground"
                placeholder="Nama kamu"
                required
              />
            </label>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(false)}
                className="min-h-[44px] rounded-xl border border-border px-4 text-sm font-semibold hover:bg-muted"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSavingProfile}
                className="min-h-[44px] rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground hover:bg-primary-dark disabled:opacity-50"
              >
                {isSavingProfile ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      )}

      {isPetModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-pet-title"
        >
          <form
            onSubmit={handleSavePet}
            className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 id="edit-pet-title" className="font-heading text-lg font-bold">
                Atur Pet Pendamping
              </h3>
              <button
                type="button"
                onClick={() => setIsPetModalOpen(false)}
                aria-label="Tutup dialog"
                className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-muted"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <PetSelector
              selectedId={draftPetSpecies}
              nickname={draftPetNickname}
              unlockedSpecies={petState.unlockedSpecies}
              coins={petState.coins}
              allowUnlock={true}
              unlockNotice={petUnlockNotice}
              onSelectSpecies={(id, defaultName) => {
                setDraftPetSpecies(id);
                setDraftPetNickname(defaultName);
                setPetUnlockNotice("");
              }}
              onUnlockSpecies={handleUnlockPet}
              onChangeNickname={setDraftPetNickname}
            />

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsPetModalOpen(false)}
                className="min-h-[44px] rounded-xl border border-border px-4 text-sm font-semibold hover:bg-muted"
              >
                Batal
              </button>
              <button
                type="submit"
                className="min-h-[44px] rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground hover:bg-primary-dark"
              >
                Simpan Pet
              </button>
            </div>
          </form>
        </div>
      )}

      {isPasswordModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-password-title"
        >
          <form
            onSubmit={handleSavePassword}
            className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 id="edit-password-title" className="font-heading text-lg font-bold">
                Ubah Kata Sandi
              </h3>
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                aria-label="Tutup dialog"
                className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-muted"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                Kata sandi baru (minimal 6 karakter)
              </span>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground"
                placeholder="Masukkan kata sandi baru"
                required
              />
            </label>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                className="min-h-[44px] rounded-xl border border-border px-4 text-sm font-semibold hover:bg-muted"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSavingPassword}
                className="min-h-[44px] rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground hover:bg-primary-dark disabled:opacity-50"
              >
                {isSavingPassword ? "Menyimpan..." : "Perbarui"}
              </button>
            </div>
          </form>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

function SettingRow({
  icon,
  iconClass,
  title,
  description,
  active,
  onToggle,
}: {
  icon: React.ReactNode;
  iconClass: string;
  title: string;
  description: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex min-h-[68px] items-center justify-between gap-4 p-4">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
        <div>
          <p className="font-heading text-sm font-semibold text-card-foreground">
            {title}
          </p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={active}
        aria-label={title}
        onClick={onToggle}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
          active ? "bg-primary" : "bg-muted-foreground/40"
        }`}
      >
        <span
          className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow-xs transition-transform ${
            active ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
