"use client"

import { createBrowserClient } from "@supabase/ssr"
import { useState, useEffect } from "react"

let supabaseClient: any = null

export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cnizavwjsztosgqwtzas.supabase.co",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbG...y59s"
    )
  }
  return supabaseClient
}

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase, setSupabase] = useState<any>(null)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const client = getSupabaseClient()
    setSupabase(client)

    if (! (window as any).__SUPABASE_CLIENT__) {
       (window as any).__SUPABASE_CLIENT__ = client
    }

    const { data: authListener } = client.auth.onAuthStateChange(async (event: any, session: any) => {
      if (event === "SIGNED_IN" && session) {
        // User signed in via Google - redirect to dashboard if needed
      }
    })

    setInitialized(true)

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  if (!initialized) return <span className="sr-only">Cargando...</span>

  return <>{children}</>
}
