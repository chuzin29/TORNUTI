import type { Metadata } from "next"
import { DashboardView } from "@/components/dashboard-view"

export const metadata: Metadata = {
  title: "Mi panel",
  description: "Tus inscripciones, torneos publicados, equipos e historial de Aura.",
}

export default function DashboardPage() {
  return <DashboardView />
}
