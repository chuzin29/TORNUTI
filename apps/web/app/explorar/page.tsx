import type { Metadata } from "next"
import { Suspense } from "react"
import { ExploreBrowser } from "@/components/explore-browser"

export const metadata: Metadata = {
  title: "Explorar torneos",
  description:
    "Encuentra torneos abiertos de deportes, gaming, cultura, comunidad y empresas. Filtra por categoría, formato y cupos.",
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="shell py-20">
          <div className="h-10 w-64 animate-pulse rounded bg-muted" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-80 animate-pulse rounded-card border border-line bg-muted/50" />
            ))}
          </div>
        </div>
      }
    >
      <ExploreBrowser />
    </Suspense>
  )
}
