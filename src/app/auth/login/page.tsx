"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Mail, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const LOGO_URL = "/assets/Logo Lumif.png";

export default function LoginScreen() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("lumif");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage("");
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      setErrorMessage("Email atau kata sandi belum cocok");
      return;
    }

    router.replace("/home");
  };

  return (
    <main className="relative flex min-h-dvh w-full flex-col overflow-y-auto bg-[#FAFAFA] px-6 font-lexend text-[#101828]">
      <header className="z-10 flex h-[96px] shrink-0 items-center justify-between pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex size-12 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white shadow-sm transition active:scale-95"
          aria-label="Kembali"
        >
          <ArrowLeft className="size-5" />
        </button>
      </header>

      {errorMessage && (
        <div className="animate-fadeIn mb-3 flex min-h-12 items-center justify-between rounded-lg bg-[#111827] px-4 py-3 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <span className="flex size-6 items-center justify-center rounded-full bg-[#DC2626]">
              <X className="size-4" />
            </span>
            <p className="text-sm">{errorMessage}</p>
          </div>

          <button
            type="button"
            onClick={() => setErrorMessage("")}
            className="rounded-md p-1 transition hover:bg-white/10"
            aria-label="Tutup pesan error"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      <section className="flex flex-1 flex-col justify-center pb-[calc(48px+env(safe-area-inset-bottom))]">
        <div className="animate-fadeInUp">
          <div className="mb-10 flex justify-center">
            <div className="relative h-[92px] w-[164px] animate-pulse-soft">
              <Image
                src={LOGO_URL}
                alt="Lumif Logo"
                fill
                sizes="164px"
                className="object-contain"
                priority
                unoptimized
              />
            </div>
          </div>

          <div className="text-center">
            <p className="mx-auto mb-3 flex w-fit items-center gap-2 rounded-full bg-[#EAF7F1] px-3 py-1 text-xs font-bold text-[#2D936C]">
              <ShieldCheck className="size-4" />
              Ruang amanmu
            </p>
            <h1 className="font-poppins text-[26px] font-bold leading-tight tracking-normal">
              Selamat datang kembali
            </h1>
            <p className="mx-auto mt-4 max-w-[320px] text-sm leading-6 text-[#667085]">
              Masuk untuk menyimpan hasil quiz, memantau progres, dan melanjutkan
              misi hari ini.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-10">
            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold">Email</span>
                <div className="flex h-[50px] items-center gap-3 rounded-lg border border-[#D0D5DD] bg-white px-3 shadow-sm focus-within:border-[#2D936C]">
                  <Mail className="size-5 shrink-0 text-[#667085]" />
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    type="email"
                    placeholder="nama@email.com"
                    className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none"
                    required
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold">Kata sandi</span>
                <div className="flex h-[50px] items-center gap-3 rounded-lg border border-[#D0D5DD] bg-white px-3 shadow-sm focus-within:border-[#2D936C]">
                  <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type={showPassword ? "text" : "password"}
                    placeholder="Kata sandi"
                    className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="rounded-md p-1 text-[#667085] transition hover:bg-[#F2F4F7]"
                    aria-label={
                      showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="size-5" />
                    ) : (
                      <Eye className="size-5" />
                    )}
                  </button>
                </div>
              </label>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setRemember((prev) => !prev)}
                  className="flex items-center gap-2"
                >
                  <span
                    className={cn(
                      "flex size-5 items-center justify-center rounded border transition",
                      remember
                        ? "border-[#2D936C] bg-[#2D936C] text-white"
                        : "border-[#D0D5DD] bg-white",
                    )}
                  >
                    {remember && <ShieldCheck className="size-3.5" />}
                  </span>
                  <span className="text-sm text-[#475467]">Tetap masuk</span>
                </button>

                <button
                  type="button"
                  className="text-sm font-bold text-[#2D936C]"
                >
                  Lupa kata sandi?
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !email || !password}
              className="mt-10 h-[52px] w-full rounded-lg bg-[#2D936C] font-poppins text-base font-bold text-white shadow-[0_12px_28px_rgba(45,147,108,0.2)] hover:bg-[#257A5A]"
            >
              {isLoading ? "Memproses..." : "Masuk"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-[#475467]">
            Belum punya akun?{" "}
            <button
              type="button"
              onClick={() => router.push("/onboarding")}
              className="font-bold text-[#2D936C]"
            >
              Mulai onboarding
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}
