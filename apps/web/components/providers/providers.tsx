"use client"

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
  )
}
