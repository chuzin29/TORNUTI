import type { Tournament, TournamentStatus } from "./types"

export const STATUS_LABEL: Record<TournamentStatus, string> = {
  abierto: "Inscripción abierta",
  "ultimos-cupos": "Últimos cupos",
  "en-curso": "En juego",
  finalizado: "Finalizado",
}

export function spotsLeft(tournament: Tournament) {
  return Math.max(0, tournament.maxParticipants - tournament.entrants.length)
}

export function isFull(tournament: Tournament) {
  return spotsLeft(tournament) === 0
}

export function sortedByDate(tournaments: Tournament[]) {
  return [...tournaments].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  )
}

export const CATEGORY_LABEL = {
  deportes: "Deportes",
  gaming: "Gaming",
  comunidad: "Comunidad",
  cultura: "Cultura",
  empresas: "Empresas",
} as const
