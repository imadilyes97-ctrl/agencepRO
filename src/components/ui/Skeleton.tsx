import { cn } from "@/lib/utils";

// ============================================================
// Skeleton — Loading placeholder with pulse animation
// ============================================================

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-[var(--color-cream-200)]",
        className,
      )}
      aria-hidden="true"
    />
  );
}

/** Dashboard-specific skeleton: KPI cards row. */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="mb-2 h-7 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* KPI cards skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-5"
          >
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-3 h-8 w-32" />
            <Skeleton className="mt-2 h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-5">
        <Skeleton className="mb-4 h-5 w-40" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="mb-2 h-10 w-full" />
        ))}
      </div>

      {/* Timeline skeleton */}
      <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-5">
        <Skeleton className="mb-4 h-5 w-40" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="mb-3 flex items-start gap-3">
            <Skeleton className="mt-0.5 h-3 w-3 shrink-0 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="mt-1 h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
