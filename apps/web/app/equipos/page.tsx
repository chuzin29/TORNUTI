import type { Metadata } from "next"
import { TeamsBrowser } from "@/components/teams-browser"

export const metadata: Metadata = {
  title: "Equipos",
  description:
    "Conoce los equipos que compiten en Tornuti, su historial y su Aura acumulada. Únete a una plantilla.",
}

export default function TeamsPage() {
  return <TeamsBrowser />
}
