export type Category = "deportes" | "gaming" | "comunidad" | "cultura" | "empresas"

export type TournamentFormat = "eliminacion" | "grupos" | "liga" | "suizo"

export type TournamentStatus = "abierto" | "ultimos-cupos" | "en-curso" | "finalizado"

export type CoverPattern = "court" | "grid" | "arc" | "score" | "flag" | "bracket"

export interface Organizer {
  name: string
  handle: string
}

export interface Player {
  id: string
  name: string
  handle: string
  aura: number
  team: string
  position: string
  wins: number
  played: number
}

export interface Team {
  id: string
  slug: string
  name: string
  motto: string
  category: Category
  members: string[]
  aura: number
  played: number
  wins: number
  city: string
}

export interface Match {
  id: string
  round: number
  stage: string
  team1: string
  team2: string
  score1: number | null
  score2: number | null
  status: "programado" | "en-vivo" | "finalizado"
  startsAt: string
}

export interface Tournament {
  id: string
  slug: string
  name: string
  summary: string
  description: string
  category: Category
  format: TournamentFormat
  status: TournamentStatus
  sport: string
  location: string
  city: string
  startsAt: string
  registrationEndsAt: string
  maxParticipants: number
  auraPrize: number
  organizer: Organizer
  entrants: string[]
  rules: string[]
  cover: CoverPattern
  matches: Match[]
  featured?: boolean
}

export interface AuraEntry {
  id: string
  playerId: string
  amount: number
  reason: string
  date: string
  category: Category
}

export interface CategoryInfo {
  id: Category
  label: string
  blurb: string
  count: number
}

export interface SessionUser {
  id: string
  email: string
  name: string
  avatar_url?: string
  role: "admin" | "organizer" | "player"
  created_at: string
}

export interface Registration {
  id: string
  tournament_id: string
  player_id: string
  team_id: string
  role: "admin" | "player"
  status: "pendiente" | "confirmado" | "cancelado"
  currency: string
  amount: number
  aura_unlocked: number
  total_paid: number
  instrument_type: string
  instrument_model: string
  payment_status: "pendiente" | "pagado"
  created_at: string
}
