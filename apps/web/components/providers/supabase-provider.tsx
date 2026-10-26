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
