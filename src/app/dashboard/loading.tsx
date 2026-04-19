// Generic dashboard loading skeleton — used whenever a sub-route doesn't
// provide its own loading.tsx. Kept minimal so it doesn't flash visible
// layout shifts on fast server responses.
export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-56 animate-pulse rounded-lg bg-muted" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-xl border border-border/30 bg-card/60"
          />
        ))}
      </div>
    </div>
  );
}
