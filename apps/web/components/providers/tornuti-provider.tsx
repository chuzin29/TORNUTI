"use client"

import * as React from "react"
import { getSupabaseClient } from "@/components/providers/supabase-provider"
import { hasSupabaseCreds } from "@/lib/supabase/keys"
import type { Tournament } from "@/lib/types"
import { slugify } from "@/lib/utils"

export interface SessionUser {
  id: string
  name: string
  email: string
  handle: string
  aura: number
  role: "player" | "organizer" | "admin"
  avatar_url?: string
  bio?: string
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
  editProfile: (
    patch: { name?: string; bio?: string; avatar_url?: string | null },
  ) => Promise<{ ok: boolean; error?: string }>
  registerForTournament: (tournament: Tournament, input: { name: string; email: string; team?: string }) => { ok: boolean; error?: string }
  isRegistered: (slug: string) => boolean
  createTournament: (tournament: Tournament) => void
  joinTeam: (slug: string) => void
  hasJoinedTeam: (slug: string) => boolean
}

const STORAGE_KEY = "tornuti_state"
const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "")

/** ¿Hay credenciales públicas de Supabase disponibles para altas y sesiones?
 *  Acepta la llave nueva (publishable) y la heredada (anon). */
const hasSupabase = hasSupabaseCreds

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
  if (/over[_-]?email[_-]?send[_-]?rate[_-]?limit|over\.request\.?rate|too many requests/i.test(message)) {
    return "Supabase está limitando el envío de correos de confirmación por hora (plan gratis). Espera un rato o entra con tu contraseña si ya confirmaste."
  }
  if (/signups? not allowed|user already exists|already registered/i.test(message)) {
    return "Ese correo ya tiene cuenta: entra con tu contraseña, o si nunca la confirmaste pide el enlace de nuevo."
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
    aura: 0,
    role: "player",
    ...(meta?.picture ? { avatar_url: meta.picture } : {}),
  }
}

type ProfileRow = {
  full_name: string | null
  handle: string
  aura: number
  avatar_url: string | null
  bio: string | null
}

/** Fusiona la ficha pública de `profiles` (nombre, handle, aura, foto y
 *  bio) sobre la sesión recién creada. Si la fila no existe aún se queda
 *  con los datos del auth. */
function enrichSession(session: SessionUser, row: ProfileRow | null): SessionUser {
  if (!row) return session
  return {
    ...session,
    name: row.full_name?.trim() || session.name,
    handle: row.handle || session.handle,
    aura: row.aura,
    ...(row.avatar_url ? { avatar_url: row.avatar_url } : {}),
    ...(row.bio ? { bio: row.bio } : {}),
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
    const client = getSupabaseClient()

    /** Adopta la sesión remota (google/cookies) y la completa con la
     *  ficha real de `profiles` antes de enseñarla en la app. */
    const adoptSession = async (user: { id: string; email?: string | null }) => {
      let summary = sessionFromSupabase(user)
      try {
        const { data } = await client
          .from("profiles")
          .select("full_name, handle, aura, avatar_url, bio")
          .eq("id", user.id)
          .single()
        if (data) summary = enrichSession(summary, data as ProfileRow)
      } catch {
        // Perfil aún sin crear: seguimos con los datos del auth.
      }
      setState((prev) =>
        prev.session?.id === summary.id
          ? { ...prev, session: { ...summary, bio: undefined } }
          : prev.session
            ? prev
            : { ...prev, session: summary },
      )
    }

    getSupabaseClient()
      .auth.getSession()
      .then(({ data }) => {
        const user = data.session?.user
        if (user) void adoptSession(user)
      })
      .catch(() => {
        // Sin conexión a Supabase se continúa con el estado local.
      })

    /* Puente para el OAuth de Google: su sesión vive en cookies httpOnly
       que el servidor colocó en /auth/callback; el navegador la consulta
       para alinear el estado local sin duplicar. También se re-consulta al
       regresar a la pestaña, así una ventana abierta desde antes del
       login se entera de que ya hay sesión firmada. */
    let lastPoll = 0
    const pollBridge = () => {
      const now = Date.now()
      if (now - lastPoll < 15_000) return
      lastPoll = now
      fetch("/api/auth/session")
        .then(async (res) => {
          if (!res.ok) return
          const { user } = (await res.json()) as {
            user: { id: string; email?: string | null } | null
          }
          if (user) void adoptSession(user)
        })
        .catch(() => {
          // Sin endpoint accesible seguimos con el estado local.
        })
    }
    pollBridge()
    window.addEventListener("focus", pollBridge)
    document.addEventListener("visibilitychange", pollBridge)
    return () => {
      window.removeEventListener("focus", pollBridge)
      document.removeEventListener("visibilitychange", pollBridge)
    }
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
          let summary = sessionFromSupabase(data.user)
          try {
            const { data: row } = await client
              .from("profiles")
              .select("full_name, handle, aura, avatar_url, bio")
              .eq("id", data.user.id)
              .single()
            if (row) summary = enrichSession(summary, row as ProfileRow)
          } catch {
            // Ficha pendiente de crear: seguimos con los datos del auth.
          }
          persist({ ...state, session: summary })
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
            options: {
              data: { full_name: name.trim() },
              /* Al confirmar el correo, el enlace aterriza aquí mismo y
                 el callback coloca la sesión en lugar de la portada. */
              emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
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
              error: `Cuenta creada: confirma tu correo en ${normalized} para activar el acceso. Abre el enlace con el mismo navegador donde te registraste.`,
            }
          }
          let summary = sessionFromSupabase(data.user)
          try {
            const { data: row } = await client
              .from("profiles")
              .select("full_name, handle, aura, avatar_url, bio")
              .eq("id", data.user.id)
              .single()
            if (row) summary = enrichSession(summary, row as ProfileRow)
          } catch {
            // Ficha pendiente de crear: seguimos con los datos del auth.
          }
          persist({ ...state, session: summary })
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

  /* Edita la ficha del usuario firmado: nombre, bio y foto en `profiles`
     (RLS: solo su propio id) + metadatos del auth para futuras sesiones. */
  const editProfile = React.useCallback(
    async (patch: { name?: string; bio?: string; avatar_url?: string | null }) => {
      const session = state.session
      if (!session) return { ok: false, error: "Entra a tu cuenta para editar tu ficha." }
      if (!hasSupabase() || session.id.startsWith("demo-")) {
        return { ok: false, error: "Crea tu cuenta con Supabase para tener ficha editable." }
      }
      const cleanName = patch.name?.trim()
      if (cleanName !== undefined && cleanName.length < 2) {
        return { ok: false, error: "Escribe tu nombre completo (mínimo 2 letras)." }
      }
      if (patch.bio !== undefined && patch.bio.length > 240) {
        return { ok: false, error: "La bio no puede pasar de 240 caracteres." }
      }

      const client = getSupabaseClient()
      try {
        const row: Record<string, string | null> = {}
        if (cleanName !== undefined) row.full_name = cleanName
        if (patch.bio !== undefined) row.bio = patch.bio
        if (patch.avatar_url !== undefined) row.avatar_url = patch.avatar_url

        const { error } = await client.from("profiles").update(row).eq("id", session.id)
        if (error) return { ok: false, error: authFriendly(error.message) }

        if (cleanName !== undefined) {
          // Los metadatos alimentan futuras pantallas que lean del auth.
          try {
            await client.auth.updateUser({ data: { full_name: cleanName } })
          } catch {
            // Los metadatos son un extra: la ficha ya quedó actualizada.
          }
        }

        persist({
          ...state,
          session: {
            ...session,
            ...(cleanName !== undefined ? { name: cleanName } : {}),
            ...(patch.bio !== undefined ? { bio: patch.bio } : {}),
            ...(patch.avatar_url !== undefined
              ? { avatar_url: patch.avatar_url ?? undefined }
              : {}),
          },
        })
        return { ok: true }
      } catch {
        return { ok: false, error: "No se pudo guardar tu ficha. Intenta de nuevo." }
      }
    },
    [persist, state]
  )

  return (
    <StoreContext.Provider
      value={{
        ...state,
        ready,
        isDemo: !API_URL && !hasSupabase(),
        login,
        registerAccount,
        logout,
        editProfile,
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
