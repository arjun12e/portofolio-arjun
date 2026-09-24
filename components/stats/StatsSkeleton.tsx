import { Skeleton } from "@/components/ui/skeleton";

export function StatsSkeleton() {
  return (
    <div role="status" aria-label="Memuat statistik GitHub" className="grid gap-5 lg:grid-cols-5">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:col-span-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="glass space-y-3 rounded-xl p-5">
            <Skeleton className="size-5" />
            <Skeleton className="h-9 w-16" />
            <Skeleton className="h-3.5 w-24" />
          </div>
        ))}
      </div>
      <div className="glass space-y-5 rounded-xl p-6 lg:col-span-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-2.5 w-full rounded-full" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
