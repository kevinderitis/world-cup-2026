export function CardSkeleton() {
  return (
    <div className="card-premium animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 skeleton rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 skeleton rounded" />
          <div className="h-3 w-20 skeleton rounded" />
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3">
          <div className="w-6 h-6 skeleton rounded-full" />
          <div className="w-8 h-8 skeleton rounded" />
          <div className="flex-1 h-4 skeleton rounded" />
          <div className="w-6 h-4 skeleton rounded" />
          <div className="w-6 h-4 skeleton rounded" />
          <div className="w-6 h-4 skeleton rounded" />
          <div className="w-6 h-4 skeleton rounded" />
          <div className="w-6 h-4 skeleton rounded" />
          <div className="w-8 h-4 skeleton rounded" />
        </div>
      ))}
    </div>
  );
}

export function MatchSkeleton() {
  return (
    <div className="card-premium animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-8 h-8 skeleton rounded" />
          <div className="h-4 w-24 skeleton rounded" />
        </div>
        <div className="h-6 w-12 skeleton rounded" />
        <div className="flex items-center gap-3 flex-1 justify-end">
          <div className="h-4 w-24 skeleton rounded" />
          <div className="w-8 h-8 skeleton rounded" />
        </div>
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="page-container space-y-4">
      <div className="h-8 w-48 skeleton rounded" />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}
