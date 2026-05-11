"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { HiArrowLeft, HiXMark } from "react-icons/hi2";
import { createClient } from "@/lib/supabase/client";

export default function LoginScreen() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("lumif");
  const [remember, setRemember] = useState(false);
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
      setErrorMessage("Kata sandi atau email salah");
      return;
    }

    router.replace("/home");
  };

  return (
    <main className="relative flex h-dvh w-full flex-col overflow-hidden bg-white px-[24px] font-lexend text-black">
      <header className="shrink-0 pt-[60px]">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-[48px] w-[48px] items-center justify-center rounded-[8px] border border-[#E5E5E5] bg-white active:scale-95"
        >
          <HiArrowLeft className="h-[20px] w-[20px]" />
        </button>
      </header>

      {errorMessage && (
        <div className="mt-[12px] flex h-[48px] items-center justify-between rounded-[4px] bg-[#070B1A] px-[14px] text-white">
          <div className="flex items-center gap-[10px]">
            <span className="flex h-[20px] w-[20px] items-center justify-center rounded-full bg-[#B91C1C] text-[12px]">
              ×
            </span>
            <p className="text-[13px]">{errorMessage}</p>
          </div>

          <button type="button" onClick={() => setErrorMessage("")}>
            <HiXMark className="h-[20px] w-[20px]" />
          </button>
        </div>
      )}

      <section className="mt-[34px]">
        <div className="text-center">
          <h1 className="font-poppins text-[24px] font-medium tracking-[-0.5px]">
            Selamat Datang kembali
          </h1>

          <p className="mx-auto mt-[8px] max-w-[290px] text-[14px] leading-[21px]">
            Silakan masukkan alamat email dan kata sandi kamu.
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-[34px]">
          <div className="space-y-[14px]">
            <label className="block">
              <span className="mb-[8px] block text-[14px]">Email</span>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                placeholder="Email"
                className="h-[46px] w-full rounded-[7px] border border-[#DADADA] px-[12px] text-[14px] outline-none focus:border-[#2D936C]"
                required
              />
            </label>

            <label className="block">
              <span className="mb-[8px] block text-[14px]">Kata Sandi</span>
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                placeholder="Kata Sandi"
                className="h-[46px] w-full rounded-[7px] border border-[#DADADA] px-[12px] text-[14px] outline-none focus:border-[#2D936C]"
                required
              />
            </label>

            <div className="flex items-center justify-between pt-[2px]">
              <button
                type="button"
                onClick={() => setRemember((prev) => !prev)}
                className="flex items-center gap-[8px]"
              >
                <span
                  className={`h-[16px] w-[16px] rounded-[3px] border ${remember
                      ? "border-[#2D936C] bg-[#2D936C]"
                      : "border-[#D4D4D4] bg-white"
                    }`}
                />
                <span className="text-[13px]">Tetap masuk</span>
              </button>

              <button
                type="button"
                className="text-[13px] font-medium text-[#2D936C]"
              >
                Lupa kata sandi?
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="mt-[36px] h-[48px] w-full rounded-[7px] bg-[#2D936C] font-poppins text-[16px] font-bold text-white disabled:opacity-60 active:scale-[0.98]"
          >
            {isLoading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="mt-[28px] text-center text-[14px]">
          Belum punya akun?{" "}
          <button
            type="button"
            onClick={() => router.push("/auth/register")}
            className="font-bold text-[#2D936C]"
          >
            Buat akun
          </button>
        </p>
      </section>
    </main>
  );
}