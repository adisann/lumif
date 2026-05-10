import { HiOutlineArrowLeft } from "react-icons/hi2";
import Link from "next/link";

export default function TopNav({
  onSkip,
  onBack,
  skipText = "Lewati",
}: {
  onSkip?: () => void;
  onBack?: () => void;
  skipText?: string;
}) {
  return (
    <div className="flex items-center justify-between px-[24px] pt-[8px] w-full relative z-10">
      <button
        onClick={onBack}
        className="flex h-[48px] w-[48px] items-center justify-center rounded-[10px] border border-[#e5e5e5] bg-white transition-colors hover:bg-neutral-50 active:bg-neutral-100"
      >
        <HiOutlineArrowLeft className="h-[20px] w-[20px] text-neutral-800" />
      </button>
      
      {onSkip && (
        <button
          onClick={onSkip}
          className="text-[14px] font-bold text-[#666] tracking-[-0.28px]"
        >
          {skipText}
        </button>
      )}
    </div>
  );
}
