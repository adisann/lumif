"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Mail,
  ShieldCheck,
  X,
  UserPlus,
  LogIn,
  CheckCircle2,
  Compass,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import LumifLogo from "@/components/LumifLogo";
import {
  PET_SPECIES,
  hasChosenStarterPet,
  markStarterChoicePending,
  selectStarterEgg,
  type PetSpeciesId,
} from "@/lib/pets";
import {
  loadOnboardingData,
  syncOnboardingToSupabase,
} from "@/lib/onboarding";

export type AuthMode = "login" | "signup" | "recovery";

type AuthScreenProps = {
  initialMode?: AuthMode;
};

export default function AuthScreen({ initialMode = "login" }: AuthScreenProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newRecoveryPassword, setNewRecoveryPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigateAfterAuth = async () => {
    if (hasChosenStarterPet()) {
      router.replace("/home");
      return;
    }

    // Hydrate pet companion from Supabase account when logging in on a fresh device/browser
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        let petSpecies = user.user_metadata?.pet_species as string | undefined;
        let petName = user.user_metadata?.pet_name as string | undefined;

        if (!petSpecies) {
          const { data: profile } = await supabase
            .from("user_profiles")
            .select("pet_species, pet_name")
            .eq("user_id", user.id)
            .maybeSingle();

          petSpecies = profile?.pet_species ?? undefined;
          petName = profile?.pet_name ?? petName;
        }

        if (
          petSpecies &&
          PET_SPECIES.some((species) => species.id === petSpecies)
        ) {
          selectStarterEgg(petSpecies as PetSpeciesId, petName);
          router.replace("/home");
          return;
        }
      }
    } catch {
      // Fallback to starter egg picker below
    }

    router.replace("/choose-pet");
  };

  useEffect(() => {
    let active = true;

    const handleAuthRedirectParams = async () => {
      if (typeof window === "undefined") return;
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const errorDesc =
        url.searchParams.get("error_description") || url.searchParams.get("error");
      const isRecoveryHash = window.location.hash.includes("type=recovery");

      if (errorDesc && active) {
        setErrorMessage("Tautan autentikasi tidak valid atau sudah kedaluwarsa.");
      }

      if (isRecoveryHash && active) {
        setMode("recovery");
        setSuccessMessage("Silakan buat kata sandi baru untuk akunmu.");
      }

      if (code) {
        try {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (!active) return;

          url.searchParams.delete("code");
          window.history.replaceState({}, "", url.pathname + url.search);

          if (error) {
            setErrorMessage("Gagal memverifikasi tautan email. Coba masuk atau minta tautan ulang.");
          } else if (isRecoveryHash) {
            setMode("recovery");
            setSuccessMessage("Verifikasi berhasil. Buat kata sandi barumu di bawah.");
          } else {
            if (typeof window !== "undefined") {
              window.localStorage.removeItem("lumif_demo_user");
            }
            await syncOnboardingToSupabase(supabase);
            await navigateAfterAuth();
          }
        } catch {
          if (active) {
            setErrorMessage("Gagal memverifikasi tautan email saat ini.");
          }
        }
      }
    };

    void handleAuthRedirectParams();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (!active) return;
      if (event === "PASSWORD_RECOVERY") {
        setMode("recovery");
        setErrorMessage("");
        setSuccessMessage("Silakan masukkan kata sandi barumu di bawah.");
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  const handleDemoLogin = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "lumif_demo_user",
        JSON.stringify({ email: "demo@lumif.local", name: "Sobat Lumif" })
      );
    }
    router.replace(hasChosenStarterPet() ? "/home" : "/choose-pet");
  };

  const handleForgotPassword = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!email.trim()) {
      setErrorMessage("Masukkan emailmu dulu untuk mengirim tautan reset kata sandi.");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/login`,
      });
      if (error) {
        setErrorMessage(error.message || "Gagal mengirim tautan reset.");
      } else {
        setSuccessMessage("Jika email terdaftar, tautan reset kata sandi telah dikirim.");
      }
    } catch {
      setErrorMessage(
        "Server Supabase belum terjangkau. Gunakan tombol Masuk Mode Demo (Offline) untuk mencoba aplikasi."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRecoveryPassword = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (newRecoveryPassword.length < 6) {
      setErrorMessage("Kata sandi baru minimal 6 karakter.");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newRecoveryPassword,
      });
      if (error) {
        setErrorMessage(error.message || "Gagal memperbarui kata sandi.");
        return;
      }
      setNewRecoveryPassword("");
      setSuccessMessage("Kata sandi berhasil diperbarui. Mengarahkan ke aplikasi...");
      await navigateAfterAuth();
    } catch {
      setErrorMessage("Gagal terhubung ke server untuk memperbarui kata sandi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    const isFetchError = (err: unknown) => {
      if (!err || typeof err !== "object") return false;
      const e = err as { name?: string; message?: string; status?: number };
      return (
        e.name === "AuthRetryableFetchError" ||
        e.status === 0 ||
        e.status === 503 ||
        Boolean(
          e.message &&
            /failed to fetch|network|fetch|supabase_unreachable|555|tidak dapat dijangkau/i.test(
              e.message
            )
        )
      );
    };

    try {
      if (mode === "signup") {
        markStarterChoicePending();
        const onboardingDraft = loadOnboardingData();
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/login`,
            ...(onboardingDraft
              ? {
                  data: {
                    onboarding: onboardingDraft,
                  },
                }
              : {}),
          },
        });

        if (error) {
          if (isFetchError(error)) {
            setErrorMessage(
              "Server Supabase sedang tidak terjangkau, sehingga akun belum tersimpan ke database. Gunakan Mode Demo (Offline) di bawah jika perlu."
            );
            return;
          }
          if (/rate limit/i.test(error.message)) {
            setErrorMessage(
              "Batas kirim email verifikasi Supabase tercapai. Tunggu beberapa saat atau gunakan Mode Demo (Offline) di bawah."
            );
            return;
          }
          if (/already registered/i.test(error.message)) {
            setErrorMessage(
              "Email ini sudah terdaftar. Silakan pindah ke tab Masuk di atas untuk login."
            );
            return;
          }
          setErrorMessage(error.message || "Gagal membuat akun. Silakan coba lagi.");
          return;
        }

        if (data.session) {
          if (typeof window !== "undefined") {
            window.localStorage.removeItem("lumif_demo_user");
          }
          await syncOnboardingToSupabase(supabase, onboardingDraft ?? undefined);
          router.replace("/choose-pet");
        } else {
          setSuccessMessage(
            "Akun berhasil dibuat. Rencana onboardingmu sudah ikut dilampirkan ke pendaftaran. Silakan konfirmasi email lalu masuk."
          );
          setMode("login");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          if (isFetchError(error)) {
            setErrorMessage(
              "Server Supabase tidak dapat dijangkau. Cek koneksi atau gunakan tombol 'Masuk Mode Demo (Offline)'."
            );
            return;
          }
          if (/invalid login credentials/i.test(error.message)) {
            setErrorMessage("Email atau kata sandi belum cocok.");
            return;
          }
          if (/email not confirmed/i.test(error.message)) {
            setErrorMessage(
              "Email belum dikonfirmasi. Cek kotak masuk atau folder spam terlebih dahulu."
            );
            return;
          }
          setErrorMessage(error.message || "Email atau kata sandi belum cocok.");
          return;
        }

        if (typeof window !== "undefined") {
          window.localStorage.removeItem("lumif_demo_user");
        }
        await syncOnboardingToSupabase(supabase);
        await navigateAfterAuth();
      }
    } catch {
      setErrorMessage(
        "Gagal terhubung ke Supabase. Cek koneksi atau gunakan tombol 'Masuk Mode Demo (Offline)' di bawah."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-dvh w-full flex-col bg-surface-soft font-sans text-foreground">
      <header className="mx-auto flex h-20 w-full max-w-5xl shrink-0 items-center justify-between px-6 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-xs transition hover:bg-muted active:scale-95"
          aria-label="Kembali"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={handleDemoLogin}
          className="min-h-[44px] rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold text-primary shadow-xs transition hover:bg-muted active:scale-95"
        >
          Coba Mode Demo
        </button>
      </header>

      <section className="mx-auto flex w-full max-w-5xl flex-1 items-center justify-center px-6 pb-12 pt-4">
        <div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-12">
          {/* Desktop Context Panel */}
          <div className="hidden flex-col gap-5 rounded-3xl bg-[#257B5A] p-8 text-white lg:col-span-6 lg:flex">
            <h2 className="font-heading text-2xl font-bold leading-snug">
              Ruang tenang untuk membangun kendali diri setiap hari
            </h2>
            <p className="text-sm leading-relaxed text-white/90">
              Catat intensitas dorongan, latih pernapasan terpandu saat gelombang datang, dan pelajari materi CBT serta ACT tanpa rasa dihakimi.
            </p>
            <ul className="space-y-2 text-xs text-white/90">
              <li>1. Check-in harian dan evaluasi pemicu pribadi</li>
              <li>2. Akses darurat 4-4 saat dorongan memuncak</li>
              <li>3. Mode Demo tersedia penuh ketika server offline</li>
            </ul>
          </div>

          {/* Auth Card */}
          <div className="mx-auto w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8 lg:col-span-6">
            {errorMessage && (
              <div
                role="alert"
                className="mb-4 flex items-center justify-between gap-3 rounded-xl bg-[#111827] px-4 py-3 text-white shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#D82C1C]">
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <p className="text-xs leading-relaxed">{errorMessage}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setErrorMessage("")}
                  className="rounded-md p-1.5 transition hover:bg-white/10"
                  aria-label="Tutup pesan error"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            )}

            {successMessage && (
              <div
                role="status"
                className="mb-4 flex items-center justify-between gap-3 rounded-xl bg-[#257B5A] px-4 py-3 text-white shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <p className="text-xs leading-relaxed">{successMessage}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setSuccessMessage("")}
                  className="rounded-md p-1.5 transition hover:bg-white/10"
                  aria-label="Tutup pesan sukses"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            )}

            <div className="mb-5 flex justify-center">
              <LumifLogo size="md" priority />
            </div>

            {mode === "recovery" ? (
              <form onSubmit={handleUpdateRecoveryPassword} className="space-y-4">
                <div className="text-center">
                  <h1 className="font-heading text-2xl font-bold leading-tight text-card-foreground">
                    Atur Kata Sandi Baru
                  </h1>
                  <p className="mx-auto mt-1.5 max-w-xs text-xs leading-5 text-muted-foreground">
                    Masukkan kata sandi baru minimal 6 karakter untuk akun Lumif kamu.
                  </p>
                </div>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-card-foreground">
                    Kata Sandi Baru
                  </span>
                  <div className="flex h-12 items-center gap-3 overflow-hidden rounded-xl border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
                    <KeyRound
                      className="h-4 w-4 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <input
                      value={newRecoveryPassword}
                      onChange={(event) => setNewRecoveryPassword(event.target.value)}
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimal 6 karakter"
                      className="h-full min-w-0 flex-1 bg-transparent text-sm text-foreground focus:outline-none"
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted"
                      aria-label={
                        showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </label>

                <Button
                  type="submit"
                  disabled={isLoading || newRecoveryPassword.length < 6}
                  className="h-12 w-full rounded-xl bg-primary font-heading text-sm font-bold text-primary-foreground hover:bg-primary-dark"
                >
                  {isLoading ? "Menyimpan..." : "Simpan Kata Sandi Baru"}
                </Button>

                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="w-full py-2 text-xs font-bold text-primary hover:underline"
                >
                  Kembali ke halaman masuk
                </button>
              </form>
            ) : (
              <>
                <div className="text-center">
                  <h1 className="font-heading text-2xl font-bold leading-tight text-card-foreground">
                    {mode === "login" ? "Selamat Datang Kembali" : "Daftar Akun Lumif"}
                  </h1>
                  <p className="mx-auto mt-1.5 max-w-xs text-xs leading-5 text-muted-foreground">
                    {mode === "login"
                      ? "Masuk untuk melanjutkan misi, riwayat hasrat, dan progres pemulihanmu."
                      : "Buat akun untuk menyimpan hasil refleksi dan melacak kebiasaan barumu."}
                  </p>
                </div>

                <div className="mt-5 flex rounded-xl bg-muted p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setErrorMessage("");
                    }}
                    className={`flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg font-heading text-xs font-bold transition-colors ${
                      mode === "login"
                        ? "bg-card text-primary shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <LogIn className="h-4 w-4" aria-hidden="true" />
                    Masuk
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signup");
                      setErrorMessage("");
                    }}
                    className={`flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg font-heading text-xs font-bold transition-colors ${
                      mode === "signup"
                        ? "bg-card text-primary shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <UserPlus className="h-4 w-4" aria-hidden="true" />
                    Daftar Baru
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-5">
                  <div className="space-y-4">
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-semibold text-card-foreground">
                        Email
                      </span>
                      <div className="flex h-12 items-center gap-3 overflow-hidden rounded-xl border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
                        <Mail
                          className="h-4 w-4 shrink-0 text-muted-foreground"
                          aria-hidden="true"
                        />
                        <input
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          type="email"
                          placeholder="nama@email.com"
                          className="h-full min-w-0 flex-1 bg-transparent text-sm text-foreground focus:outline-none"
                          required
                        />
                      </div>
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-xs font-semibold text-card-foreground">
                        Kata Sandi
                      </span>
                      <div className="flex h-12 items-center gap-3 overflow-hidden rounded-xl border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
                        <input
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          type={showPassword ? "text" : "password"}
                          placeholder="Minimal 6 karakter"
                          className="h-full min-w-0 flex-1 bg-transparent text-sm text-foreground focus:outline-none"
                          minLength={6}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((value) => !value)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted"
                          aria-label={
                            showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <Eye className="h-4 w-4" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </label>

                    {mode === "login" && (
                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          onClick={() => setRemember((prev) => !prev)}
                          aria-pressed={remember}
                          className="flex min-h-[44px] items-center gap-2"
                        >
                          <span
                            className={cn(
                              "flex h-4 w-4 items-center justify-center rounded border transition",
                              remember
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-input bg-background"
                            )}
                          >
                            {remember && <ShieldCheck className="h-3 w-3" aria-hidden="true" />}
                          </span>
                          <span className="text-xs text-muted-foreground">Tetap masuk</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleForgotPassword}
                          className="min-h-[44px] text-xs font-bold text-primary hover:underline"
                        >
                          Lupa kata sandi?
                        </button>
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || !email || !password}
                    className="mt-5 h-12 w-full rounded-xl bg-primary font-heading text-sm font-bold text-primary-foreground hover:bg-primary-dark"
                  >
                    {isLoading
                      ? "Memproses..."
                      : mode === "login"
                      ? "Masuk ke Akun"
                      : "Daftar Akun Baru"}
                  </Button>

                  <button
                    type="button"
                    onClick={handleDemoLogin}
                    className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-primary bg-primary-light/60 font-heading text-xs font-bold text-primary transition hover:bg-primary-light"
                  >
                    <Compass className="h-4 w-4" aria-hidden="true" />
                    Masuk Mode Demo (Offline)
                  </button>
                </form>

                <p className="mt-5 text-center text-xs text-muted-foreground">
                  {mode === "login" ? (
                    <>
                      Belum punya akun?{" "}
                      <button
                        type="button"
                        onClick={() => setMode("signup")}
                        className="font-bold text-primary hover:underline"
                      >
                        Daftar sekarang
                      </button>
                    </>
                  ) : (
                    <>
                      Sudah punya akun?{" "}
                      <button
                        type="button"
                        onClick={() => setMode("login")}
                        className="font-bold text-primary hover:underline"
                      >
                        Masuk di sini
                      </button>
                    </>
                  )}
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
