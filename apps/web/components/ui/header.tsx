"use client"

import { Menu, LogOut, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { DarkModeToggle } from "./dark-mode-toggle"

export const Header = () => {
  return (
    <header className="border-b border-border backdrop-blur-sm bg-card/80">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar size="lg" fallback="T" className="border-2 border-primary" />
          <h1 className="text-2xl font-semibold text-foreground">Tornuti</h1>
        </div>
        <div className="flex items-center gap-4">
          <DarkModeToggle />
          <Button variant="ghost" size="sm">
            <LogOut className="h-4 w-4" /> Cerrar sesión
          </Button>
        </div>
      </div>
    </header>
  )
}