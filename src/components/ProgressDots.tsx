"use client";

type ProgressDotsProps = {
  total?: number;
  current?: number;
  labels?: string[];
  onChange?: (index: number) => void;
};

export default function ProgressDots({
  total = 6,
  current = 2,
  labels = [],
  onChange,
}: ProgressDotsProps) {
  return (
    <div className="mt-[12px] mb-[24px] flex items-center justify-center gap-[8px]">
      {Array.from({ length: total }).map((_, i) => {
        const step = i + 1;
        const isActive = step === current;
        const isPassed = step < current;
        const label = labels[i] ?? `Step ${step}`;

        return (
          <button
            key={i}
            type="button"
            title={label}
            onClick={() => onChange?.(step)}
            className={`h-[7px] rounded-full transition-all duration-300 active:scale-95 ${isActive
                ? "w-[30px] bg-[#1B8E5A]"
                : isPassed
                  ? "w-[18px] bg-[#FF9F1C]"
                  : "w-[8px] bg-neutral-300"
              }`}
          />
        );
      })}
    </div>
  );
}