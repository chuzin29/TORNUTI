export default function Loading() {
  return (
    <div className="shell py-20">
      <div className="h-6 w-40 animate-pulse rounded bg-muted" />
      <div className="mt-5 h-14 w-3/4 animate-pulse rounded bg-muted" />
      <div className="mt-4 h-4 w-1/2 animate-pulse rounded bg-muted" />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-72 animate-pulse rounded-card border border-line bg-muted/40" />
        ))}
      </div>
    </div>
  )
}
