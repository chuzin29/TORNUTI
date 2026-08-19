"use client"

import { cn } from "@/lib/utils"
import { Moon, Sun, Users, Menu, X } from "lucide-react"

interface NavMenuProps {
  isMobile?: boolean
  onMenuToggle?: () => void
}

export const NavMenu = ({ isMobile = false, onMenuToggle }: NavMenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  return (
    <nav className="border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar size="xl" fallback="T" className="border-2 border-primary" />
          <h1 className="text-xl font-semibold text-foreground">Tornuti</h1>
        </div>
        
        {/* Desktop nav */}
        {!isMobile && (
          <div className="hidden md:flex items-center gap-8">
            <a href="#explore" className="text-muted-foreground hover:text-primary transition-colores">Explorar</a>
            <a href="#create" className="text-muted-foreground hover:text-primary transition-colores">Crear</a>
            <a href="#community" className="text-muted-foreground hover:text-primary transition-colores">Comunidad</a>
          </div>
        )}

        {/* Mobile menu button */}
        {isMobile && (
          <button
            onClick={onMenuToggle}
            aria-label="Abrir menú"
            className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        {/* Mobile menu */}
        {isMobile && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm left top-20 left-1/2 -translate-x-1/2 flex flex-col gap-6 px-8 py-12">
            <button
              onClick={onMenuToggle}
              aria-label="Cerrar menú"
              className="absolute right-6 top-6 p-2 rounded-md hover:bg-white hover:bg-opacity-5 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <a href="#explore" className="text-2xl text-foreground hover:text-primary transition-colores">Explorar</a>
            <a href="#create" className="text-2xl text-foreground hover:text-primary transition-colores">Crear</a>
            <a href="#community" className="text-2xl text-foreground hover:text-primary transition-colores">Comunidad</a>
            <a href="/auth/login" className="text-2xl text-primary mt-6 block">Login</a>
          </div>
        )}
      </div>
    </nav>
  )
}

NavMenu.displayName = "NavMenu"