"use client"

<<<<<<< HEAD
import { ThemeProvider } from "@/components/providers/theme-provider"
import { ToastProvider } from "@/components/providers/toast-provider"
import { TornutiProvider } from "@/components/providers/tornuti-provider"
import { SupabaseProvider } from "@/components/providers/supabase-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseProvider>
      <ThemeProvider>
        <TornutiProvider>
          <ToastProvider>{children}</ToastProvider>
        </TornutiProvider>
      </ThemeProvider>
    </SupabaseProvider>
=======
import type * as React from "react"
import { ThemeProvider } from "./theme-provider"
import { ToastProvider } from "./toast-provider"
import { TornutiProvider } from "./tornuti-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <TornutiProvider>
        <ToastProvider>{children}</ToastProvider>
      </TornutiProvider>
    </ThemeProvider>
>>>>>>> origin/main
  )
}
