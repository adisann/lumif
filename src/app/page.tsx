"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const LOGO_URL = "/assets/Logo Lumif.png";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router.push("/onboarding");
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <main
      className="relative flex h-dvh w-full cursor-pointer items-center justify-center overflow-hidden bg-white"
      onClick={() => router.push("/onboarding")}
    >
      <div className="relative h-[108px] w-[191px] animate-pulse-soft">
        <Image
          src={LOGO_URL}
          alt="Lumif Logo"
          fill
          className="object-contain"
          priority
          unoptimized
        />
      </div>
    </main>
  );
}