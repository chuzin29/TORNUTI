"use client"

import * as React from "react"
import type { Tournament } from "@/lib/types"
import { slugify } from "@/lib/utils"

export interface SessionUser {
  id: string
  name: string
  email: string
  handle: string
  aura: number
  role: "player" | "organizer" | "admin"
  token?: string
}

export interface Registration {
  id: string
  tournamentSlug: string
  tournamentName: string
  name: string
  email: string
  team?: string
  createdAt: string
}

interface PersistedState {
  session: SessionUser | null
  registrations: Registration[]
  created: Tournament[]
  joinedTeams: string[]
}

interface StoreContextValue extends PersistedState {
  ready: boolean
  isDemo: boolean
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  registerAccount: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ ok: boolean; error?: string }>
  logout: () => void
  registerForTournament: (
    tournament: Tournament,
    input: { name: string; email: string; team?: string },
  ) => { ok: boolean; error?: string }
  isRegistered: (slug: string) => boolean
  createTournament: (tournament: Tournament) => void
  joinTeam: (slug: string) => void
  hasJoinedTeam: (slug: string) => boolean
}

const STORAGE_KEY = "tornuti:store:v1"
const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "")

const initialState: PersistedState = {
  session: null,
  registrations: [],
  created: [],
  joinedTeams: [],
}

const StoreContext = React.createContext<StoreContextValue | null>(null)

function readState(): PersistedState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialState
    const parsed = JSON.parse(raw) as Partial<PersistedState>
    return {
      session: parsed.session ?? null,
      registrations: Array.isArray(parsed.registrations) ? parsed.registrations : [],
      created: Array.isArray(parsed.created) ? parsed.created : [],
      joinedTeams: Array.isArray(parsed.joinedTeams) ? parsed.joinedTeams : [],
    }
  } catch {
    return initialState
  }
}

function demoUser(name: string, email: string): SessionUser {
  const local = email.split("@")[0] ?? "jugador"
  return {
    id: `demo-${slugify(email)}`,
    name,
    email,
    handle: slugify(local),
    aura: 1240,
    role: "player",
  }
}

export function TornutiProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<PersistedState>(initialState)
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    setState(readState())
    setReady(true)
  }, [])

  const persist = React.useCallback((next: PersistedState) => {
    setState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // Storage can be unavailable in private mode; the session stays in memory.
    }
  }, [])

  const login = React.useCallback(
    async (email: string, password: string) => {
      const normalized = email.trim().toLowerCase()
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
        return { ok: false, error: "Escribe un correo válido." }
      }
      if (password.length < 6) {
        return { ok: false, error: "La contraseña debe tener al menos 6 caracteres." }
      }

      if (API_URL) {
        try {
          const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: normalized, password }),
          })
          if (!response.ok) {
            return { ok: false, error: "Correo o contraseña incorrectos." }
          }
          const data = (await response.json()) as {
            token: string
            user: { id: string; name: string | null; email: string; handle?: string; aura: number; role: SessionUser["role"] }
          }
          const session: SessionUser = {
            id: data.user.id,
            name: data.user.name ?? normalized.split("@")[0],
            email: data.user.email,
            handle: data.user.handle ?? slugify(normalized.split("@")[0]),
            aura: data.user.aura,
            role: data.user.role.toLowerCase() as SessionUser["role"],
            token: data.token,
          }
          persist({ ...state, session })
          return { ok: true }
        } catch {
          return { ok: false, error: "No se pudo contactar la API. Intenta de nuevo." }
        }
      }

      const name = normalized
        .split("@")[0]
        .replace(/[._-]+/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
      persist({ ...state, session: demoUser(name, normalized) })
      return { ok: true }
    },
    [persist, state],
  )

  const registerAccount = React.useCallback(
    async (name: string, email: string, password: string) => {
      const normalized = email.trim().toLowerCase()
      if (name.trim().length < 2) return { ok: false, error: "Escribe tu nombre completo." }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
        return { ok: false, error: "Escribe un correo válido." }
      }
      if (password.length < 8) {
        return { ok: false, error: "Usa una contraseña de al menos 8 caracteres." }
      }

      if (API_URL) {
        try {
          const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name.trim(), email: normalized, password }),
          })
          if (!response.ok) {
            return { ok: false, error: "No se pudo crear la cuenta. Revisa los datos." }
          }
          const data = (await response.json()) as {
            token: string
            user: { id: string; name: string | null; email: string; handle?: string; aura: number; role: SessionUser["role"] }
          }
          persist({
            ...state,
            session: {
              id: data.user.id,
              name: data.user.name ?? name.trim(),
              email: data.user.email,
              handle: data.user.handle ?? slugify(name),
              aura: data.user.aura,
              role: data.user.role.toLowerCase() as SessionUser["role"],
              token: data.token,
            },
          })
          return { ok: true }
        } catch {
          return { ok: false, error: "No se pudo contactar la API. Intenta de nuevo." }
        }
      }

      persist({ ...state, session: demoUser(name.trim(), normalized) })
      return { ok: true }
    },
    [persist, state],
  )

  const logout = React.useCallback(() => {
    persist({ ...state, session: null })
  }, [persist, state])

  const registerForTournament = React.useCallback(
    (tournament: Tournament, input: { name: string; email: string; team?: string }) => {
      if (!input.name.trim()) return { ok: false, error: "Escribe el nombre del equipo o jugador." }
      if (state.registrations.some((entry) => entry.tournamentSlug === tournament.slug)) {
        return { ok: false, error: "Ya tienes una inscripción en este torneo." }
      }
      const registration: Registration = {
        id: `reg-${Date.now()}`,
        tournamentSlug: tournament.slug,
        tournamentName: tournament.name,
        name: input.name.trim(),
        email: input.email.trim() || state.session?.email || "",
        team: input.team?.trim() || undefined,
        createdAt: new Date().toISOString(),
      }
      persist({
        ...state,
        registrations: [registration, ...state.registrations],
        session: state.session
          ? { ...state.session, aura: state.session.aura + 40 }
          : state.session,
      })
      return { ok: true }
    },
    [persist, state],
  )

  const isRegistered = React.useCallback(
    (slug: string) => state.registrations.some((entry) => entry.tournamentSlug === slug),
    [state.registrations],
  )

  const createTournament = React.useCallback(
    (tournament: Tournament) => {
      persist({ ...state, created: [tournament, ...state.created] })
    },
    [persist, state],
  )

  const joinTeam = React.useCallback(
    (slug: string) => {
      if (state.joinedTeams.includes(slug)) return
      persist({ ...state, joinedTeams: [...state.joinedTeams, slug] })
    },
    [persist, state],
  )

  const hasJoinedTeam = React.useCallback(
    (slug: string) => state.joinedTeams.includes(slug),
    [state.joinedTeams],
  )

  const value = React.useMemo<StoreContextValue>(
    () => ({
      ...state,
      ready,
      isDemo: !API_URL,
      login,
      registerAccount,
      logout,
      registerForTournament,
      isRegistered,
      createTournament,
      joinTeam,
      hasJoinedTeam,
    }),
    [
      state,
      ready,
      login,
      registerAccount,
      logout,
      registerForTournament,
      isRegistered,
      createTournament,
      joinTeam,
      hasJoinedTeam,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useTornuti() {
  const context = React.useContext(StoreContext)
  if (!context) throw new Error("useTornuti debe usarse dentro de TornutiProvider")
  return context
}

export function useAllTournaments() {
  const { created } = useTornuti()
  return React.useMemo(() => created, [created])
}
