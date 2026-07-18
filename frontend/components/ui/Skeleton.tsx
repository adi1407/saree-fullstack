import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-sm bg-background-alt", className)}
      aria-hidden
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-[3/4] w-full" />
      <Skeleton className="mt-3 h-4 w-16" />
      <Skeleton className="mt-2 h-5 w-full" />
      <Skeleton className="mt-2 h-4 w-20" />
    </div>
  );
}

export function GallerySkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-[4/5] w-full" />
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-16 shrink-0" />
        ))}
      </div>
    </div>
  );
}
