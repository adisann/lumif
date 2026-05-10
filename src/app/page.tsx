"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import StatusBar from "@/components/StatusBar";

const LOGO_URL = "/assets/Logo Lumif.png";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to onboarding after 2.5 seconds
    const timer = setTimeout(() => {
      router.push("/onboarding");
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div 
      className="bg-white relative h-full w-full flex flex-col cursor-pointer"
      onClick={() => router.push("/onboarding")} // Allow tapping to skip
    >
      
      {/* Centered Logo */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-[191px] h-[108px] animate-pulse-soft">
          <Image
            src={LOGO_URL}
            alt="Lumif Logo"
            fill
            className="object-contain"
            priority
            unoptimized // Since we use localhost assets
          />
        </div>
      </div>
    </div>
  );
}
