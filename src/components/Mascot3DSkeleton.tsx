import { Skeleton } from "@/components/ui/skeleton";

type Mascot3DSkeletonProps = {
  heightClass?: string;
  className?: string;
};

export default function Mascot3DSkeleton({
  heightClass = "h-[220px]",
  className = "",
}: Mascot3DSkeletonProps) {
  return (
    <div
      className={`relative flex w-full flex-col items-center ${className}`}
      aria-busy="true"
      aria-label="Memuat pendamping 3D"
    >
      <div
        className={`relative flex w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-b from-primary-light/85 to-card p-6 ${heightClass}`}
      >
        <Skeleton className="h-24 w-24 rounded-full bg-primary/15" />
        <Skeleton className="h-3.5 w-32 rounded-full bg-primary/10" />
      </div>

      <div className="mt-2.5 flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-8 w-16 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
        <Skeleton className="h-3.5 w-24 rounded-md" />
      </div>
    </div>
  );
}
