import type { Metadata } from "next"
import { CreateTournamentForm } from "./create-tournament-form"

export const metadata: Metadata = {
  title: "Crear un torneo",
  description:
    "Publica un torneo de cualquier disciplina en minutos. Ficha, inscripciones, cupos y cuadro automático, gratis.",
}

export default function CreatePage() {
  return <CreateTournamentForm />
}
