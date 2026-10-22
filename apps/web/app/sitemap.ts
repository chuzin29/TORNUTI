import type { MetadataRoute } from "next"
import { SITE, TOURNAMENTS } from "@/lib/data"

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/explorar", "/crear", "/ranking", "/equipos", "/login", "/registro", "/reglas", "/privacidad", "/terminos"]

  return [
    ...staticRoutes.map((route) => ({
      url: `${SITE.url}${route}`,
      lastModified: new Date("2026-10-21T00:00:00Z"),
      changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "" ? 1 : 0.7,
    })),
    ...TOURNAMENTS.map((tournament) => ({
      url: `${SITE.url}/torneos/${tournament.slug}`,
      lastModified: new Date("2026-10-21T00:00:00Z"),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ]
}
