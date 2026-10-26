"use client"

import * as React from "react"
import { createBrowserClient } from "@supabase/ssr"

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

/**
 * Cliente de Supabase singleton. Se usa desde el navegador con las claves
 * públicas; si faltan se conservan las de demostración del proyecto.
 */
export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cnizavwjsztosgqwtzas.supabase.co",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbG...y59s",
    )
  }
  return supabaseClient
}

/**
 * ¿Tiene el proyecto el proveedor de Google activado? Consulta los ajustes
 * públicos de autenticación (solo con la clave anon). Devuelve `null` si no
 * se pudo consultar — en ese caso se intenta el flujo normal.
 */
export async function isGoogleEnabled(): Promise<boolean | null> {
  try {
    const url =
      (process.env.NEXT_PUBLIC_SUPABASE_URL ||
        "https://cnizavwjsztosgqwtzas.supabase.co").replace(/\/+$/, "")
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbG...y59s"
    const res = await fetch(`${url}/auth/v1/settings`, {
      headers: { apikey: key },
    })
    if (!res.ok) return null
    const settings = (await res.json()) as { external?: Record<string, boolean> }
    return Boolean(settings.external?.google)
  } catch {
    return null
  }
}

/**
 * Registra el cliente global y escucha cambios de sesión.
 * Importante: siempre renderiza a los hijos. Si antes se bloqueaba el árbol
 * hasta terminar la inicialización, toda la app quedaba sin HTML en el
 * servidor y aparecía de golpe al hidratar.
 */
export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    const client = getSupabaseClient()
    if (!(window as any).__SUPABASE_CLIENT__) {
      ;(window as any).__SUPABASE_CLIENT__ = client
    }

    const { data: authListener } = client.auth.onAuthStateChange(
      (_event: string, _session: unknown) => {
        // Google SSO de Supabase se resuelve en app/auth/callback.
      },
    )

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  return <>{children}</>
}
