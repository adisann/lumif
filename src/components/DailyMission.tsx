"use client";

import { useState } from "react";
import { Check } from "lucide-react";

interface DailyMissionProps {
  mission?: string;
}

export default function DailyMission({ 
  mission = "Sadari kapan urge pertama muncul hari ini." 
}: DailyMissionProps) {
  const [isCompleted, setIsCompleted] = useState(false);

  if (isCompleted) return null;

  return (
    <div className="mb-6 px-6">
      <h2 className="mb-2.5 font-poppins text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Misi Kecil Hari Ini
      </h2>
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-xs">
        <p className="flex-1 text-sm font-medium leading-relaxed text-foreground">
          {mission}
        </p>
        <button
          type="button"
          onClick={() => setIsCompleted(!isCompleted)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all hover:bg-primary hover:text-white active:scale-90"
          aria-label="Tandai misi selesai"
        >
          <Check className="h-5 w-5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}
