"use client"

import type * as React from "react"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { ToastProvider } from "@/components/providers/toast-provider"
import { TornutiProvider } from "@/components/providers/tornuti-provider"
import { SupabaseProvider } from "@/components/providers/supabase-provider"
import { CustomCursor } from "@/components/CustomCursor"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseProvider>
      <ThemeProvider>
        <TornutiProvider>
          <ToastProvider>
            {children}
            <CustomCursor />
          </ToastProvider>
        </TornutiProvider>
      </ThemeProvider>
    </SupabaseProvider>
  )
}