export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Tabs skeleton */}
      <div className="flex gap-2">
        <div className="h-9 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="h-9 w-48 animate-pulse rounded-lg bg-muted" />
      </div>

      {/* Content skeleton */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Map skeleton */}
        <div className="lg:col-span-3">
          <div className="h-[500px] animate-pulse rounded-xl border border-border/50 bg-card" />
        </div>

        {/* List skeleton */}
        <div className="space-y-3 lg:col-span-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-xl border border-border/30 bg-card"
              style={{ animationDelay: `${i * 75}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
