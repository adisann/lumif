"use client";

// import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail } from "lucide-react";
// import { FaGoogle, FaApple } from "react-icons/fa";
// import { createClient } from "@/lib/supabase/client";
import LumifLogo from "@/components/LumifLogo";

export default function AuthOptionsScreen() {
  const router = useRouter();
  // OAuth providers (Google & Apple) paused until configured
  // const supabase = useMemo(() => createClient(), []);
  // const [oauthNotice, setOauthNotice] = useState("");
  // const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  //
  // const handleOAuth = async (provider: "google" | "apple") => {
  //   setOauthNotice("");
  //   setLoadingProvider(provider);
  //   try {
  //     const { error } = await supabase.auth.signInWithOAuth({
  //       provider,
  //       options: {
  //         redirectTo: `${window.location.origin}/home`,
  //       },
  //     });
  //     if (error) {
  //       setOauthNotice(
  //         `Login ${provider === "google" ? "Google" : "Apple"} belum tersedia (${error.message}). Gunakan Email.`
  //       );
  //     }
  //   } catch {
  //     setOauthNotice(
  //       `Tidak dapat terhubung ke layanan login ${provider === "google" ? "Google" : "Apple"}. Gunakan Email.`
  //     );
  //   } finally {
  //     setLoadingProvider(null);
  //   }
  // };

  return (
    <main className="relative flex min-h-dvh w-full flex-col bg-surface-soft font-sans text-foreground">
      <header className="mx-auto flex w-full max-w-5xl items-center px-6 pt-5">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-xs transition hover:bg-muted active:scale-95"
          aria-label="Kembali"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </button>
      </header>

      <section className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4">
              <LumifLogo size="lg" priority />
            </div>
            <h1 className="font-heading text-xl font-bold text-card-foreground">
              Masuk ke Ruang Lumif
            </h1>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Gunakan email untuk melanjutkan perjalanan pemulihanmu.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3">
            {/*
            <button
              type="button"
              disabled={loadingProvider !== null}
              onClick={() => handleOAuth("google")}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-border bg-card text-card-foreground shadow-xs transition hover:bg-muted active:scale-[0.99] disabled:opacity-60"
            >
              <FaGoogle className="h-4 w-4 text-[#4285F4]" aria-hidden="true" />
              <span className="font-heading text-sm font-semibold">
                {loadingProvider === "google" ? "Menghubungkan..." : "Lanjutkan dengan Google"}
              </span>
            </button>

            <button
              type="button"
              disabled={loadingProvider !== null}
              onClick={() => handleOAuth("apple")}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl bg-foreground text-background shadow-xs transition hover:opacity-90 active:scale-[0.99] disabled:opacity-60"
            >
              <FaApple className="h-4 w-4" aria-hidden="true" />
              <span className="font-heading text-sm font-semibold">
                {loadingProvider === "apple" ? "Menghubungkan..." : "Lanjutkan dengan Apple"}
              </span>
            </button>
            */}

            <button
              type="button"
              onClick={() => router.push("/auth/login")}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl bg-primary text-primary-foreground shadow-xs transition hover:bg-primary-dark active:scale-[0.99]"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              <span className="font-heading text-sm font-semibold">
                Lanjutkan dengan Email
              </span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
