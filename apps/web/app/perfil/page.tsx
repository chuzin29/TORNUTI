import type { Metadata } from "next"
import { ProfilePanel } from "@/components/profile-panel"

export const metadata: Metadata = {
  title: "Mi ficha · Tornuti",
  description: "Tu foto, tu nombre y tu bio para rankings, equipos e inscripciones.",
}

export default function PerfilPage() {
  return <ProfilePanel />
}
