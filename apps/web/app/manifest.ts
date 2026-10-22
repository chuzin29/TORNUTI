import type { MetadataRoute } from "next"
import { SITE } from "@/lib/data"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tornuti",
    short_name: "Tornuti",
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#F7F4ED",
    theme_color: "#1B3FD8",
    lang: "es",
    categories: ["sports", "productivity"],
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  }
}
