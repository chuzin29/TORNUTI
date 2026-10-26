"use client"

import * as React from "react"
import { getSupabaseClient } from "@/components/providers/supabase-provider"
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
  registerAccount: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => void
  registerForTournament: (tournament: Tournament, input: { name: string; email: string; team?: string }) => { ok: boolean; error?: string }
  isRegistered: (slug: string) => boolean
  createTournament: (tournament: Tournament) => void
  joinTeam: (slug: string) => void
  hasJoinedTeam: (slug: string) => boolean
}

const STORAGE_KEY = "tornuti_state"
const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "")
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL

/** ¿Hay credenciales públicas de Supabase disponibles para altas y sesiones? */
function hasSupabase(): boolean {
  return Boolean(SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

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

/** Traduce los errores habituales de Supabase a mensajes claros en español. */
function authFriendly(message: string): string {
  if (/invalid login credentials/i.test(message)) {
    return "Correo o contraseña incorrectos."
  }
  if (/email not confirmed/i.test(message)) {
    return "Revisa tu correo: te enviamos un enlace de confirmación. Confírmalo e intenta de nuevo."
  }
  if (/over.request\.?rate|too many requests/i.test(message)) {
    return "Demasiados intentos seguidos. Espera un minuto y vuelve a intentar."
  }
  if (/signups? not allowed|user already exists/i.test(message)) {
    return "Ese correo ya tiene cuenta (falta confirmarla) o las inscripciones están cerradas para ese dominio."
  }
  if (/at least \d+ characters/i.test(message)) {
    return "Usa una contraseña más larga."
  }
  return "No se pudieron validar tus datos con el servicio de cuentas. Intenta de nuevo."
}

/** Mapea un usuario de Supabase a la sesión del proveedor. */
function sessionFromSupabase(user: { id: string; email?: string | null }): SessionUser {
  const email = user.email ?? ""
  const local = email.split("@")[0] ?? "jugador"
  const meta = (user as unknown as { user_metadata?: Record<string, string | undefined> })
    .user_metadata
  const pretty =
    meta?.full_name ||
    meta?.name ||
    local
      .replace(/[._-]+/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
  return {
    id: user.id,
    name: pretty,
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
    /* Si Supabase ya tiene sesión (p. ej. por Google OAuth puede haber
       regresado por /auth/callback), se detecta al montar. */
    if (!hasSupabase()) return
    getSupabaseClient()
      .auth.getSession()
      .then(({ data }) => {
        const user = data.session?.user
        if (!user) return
        setState((prev) =>
          prev.session ? prev : { ...prev, session: sessionFromSupabase(user) },
        )
      })
      .catch(() => {
        // Sin conexión a Supabase se continúa con el estado local.
      })
  }, [])

  const persist = React.useCallback((next: PersistedState) => {
    setState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // Storage can be unavailable in private mode
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

      /* Supabase: autenticación real por correo y contraseña. */
      if (hasSupabase()) {
        try {
          const client = getSupabaseClient()
          const { data, error } = await client.auth.signInWithPassword({
            email: normalized,
            password,
          })
          if (error || !data.user) {
            return {
              ok: false,
              error: authFriendly(error?.message ?? "Credenciales no válidas."),
            }
          }
          persist({ ...state, session: sessionFromSupabase(data.user) })
          return { ok: true }
        } catch {
          return {
            ok: false,
            error: "No se pudo contactar el servicio de cuentas. Intenta de nuevo.",
          }
        }
      }

      const name = normalized
        .split("@")[0]
        .replace(/[._-]+/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
      persist({ ...state, session: demoUser(name, normalized) })
      return { ok: true }
    },
    [persist, state]
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
              name: data.user.name ?? normalized.split("@")[0],
              email: data.user.email,
              handle: data.user.handle ?? slugify(normalized.split("@")[0]),
              aura: 1240,
              role: "player",
              token: data.token,
            },
          })
          return { ok: true }
        } catch {
          return { ok: false, error: "No se pudo contactar la API." }
        }
      }

      /* Supabase: alta real. El proyecto exige confirmación por correo: si
         el panel de Supabase apaga el autoconfirm, `data.session` llega
         nulo y se pide revisar el correo en lugar de fingir acceso. */
      if (hasSupabase()) {
        try {
          const client = getSupabaseClient()
          const { data, error } = await client.auth.signUp({
            email: normalized,
            password,
            options: { data: { full_name: name.trim() } },
          })
          if (error || !data.user) {
            return {
              ok: false,
              error: authFriendly(error?.message ?? "No se pudo crear la cuenta."),
            }
          }
          if (!data.session) {
            return {
              ok: false,
              error: `Cuenta creada: confirma tu correo en ${normalized} para activar el acceso.`,
            }
          }
          persist({ ...state, session: sessionFromSupabase(data.user) })
          return { ok: true }
        } catch {
          return { ok: false, error: "No se pudo crear la cuenta. Intenta de nuevo." }
        }
      }

      persist({
        ...state,
        session: demoUser(name, normalized),
      })
      return { ok: true }
    },
    [persist, state]
  )

  const logout = React.useCallback(() => {
    persist({ ...initialState, session: null })
    if (hasSupabase()) {
      void getSupabaseClient()
        .auth.signOut()
        .catch(() => {
          // Si el servicio no responde, la session local ya se cerró.
        })
    }
  }, [persist])

  const registerForTournament = React.useCallback(
    (tournament: Tournament, input: { name: string; email: string; team?: string }) => {
      if (!state.session) {
        return { ok: false, error: "Debes iniciar sesión primero." }
      }
      const reg: Registration = {
        id: `reg-${slugify(tournament.slug)}-${Date.now()}`,
        tournamentSlug: tournament.slug,
        tournamentName: tournament.name,
        name: input.name,
        email: input.email,
        team: input.team,
        createdAt: new Date().toISOString(),
      }
      persist({
        ...state,
        registrations: [...state.registrations, reg],
      })
      return { ok: true }
    },
    [persist, state]
  )

  const isRegistered = React.useCallback(
    (slug: string) =>
      state.registrations.some((r) => r.tournamentSlug === slug),
    [state.registrations]
  )

  const createTournament = React.useCallback(
    (tournament: Tournament) => {
      persist({
        ...state,
        created: [...state.created, tournament],
      })
    },
    [persist, state]
  )

  const joinTeam = React.useCallback(
    (slug: string) => {
      if (state.joinedTeams.includes(slug)) return
      persist({
        ...state,
        joinedTeams: [...state.joinedTeams, slug],
      })
    },
    [persist, state]
  )

  const hasJoinedTeam = React.useCallback(
    (slug: string) => state.joinedTeams.includes(slug),
    [state.joinedTeams]
  )

  return (
    <StoreContext.Provider
      value={{
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
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useTornuti(): StoreContextValue {
  const context = React.useContext(StoreContext)
  if (!context) throw new Error("useTornuti debe usarse dentro de TornutiProvider")
  return context
}
