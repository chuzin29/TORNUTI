"use client"

import { cn } from "@/lib/utils"
import { Sun, Moon, Settings, LogOut, Trophy, Medal, Sparkles, Users, Calendar } from "lucide-react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline" | "danger" | "primary" | "secondary" | "link"
  size?: "default" | "sm" | "lg" | "icon" | "block"
  loading?: boolean
  iconOnly?: boolean
  enableAura?: boolean
  auraGain?: number
  onAuraClick?: () => void
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ 
  className, 
  variant = "default", 
  size = "default", 
  asChild = false,
  loading,
  iconOnly = false,
  enableAura = false,
  auraGain = 0,
  onAuraClick,
  ...props 
}, ref) => {
  const [isDark, setIsDark] = React.useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
    }
    return false
  })

  const getVariantStyles = () => {
    const isDarkMode = isDark
    
    switch (variant) {
      case "default":
        return `bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground`
      case "ghost":
        return `hover:bg-accent hover:text-accent-foreground transition-colors`
      case "outline":
        return `border border-border hover:bg-accent hover:text-accent-foreground transition-colors`
      case "danger":
        return `bg-destructive text-destructive-foreground hover:bg-destructive/90`
      case "primary":
        return `bg-morado-600 text-white hover:bg-morado-700 transition-colors`
      case "secondary":
        return `bg-salvadoreño-claro-500 text-salvadoreño-900 hover:bg-salvadoreño-claro-600 transition-colors`
      case "link":
        return `underline underline-offset-2 hover:text-primary transition-colors flex items-center gap-1`
      default:
        return `bg-primary text-primary-foreground hover:bg-primary/90`
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "h-8 px-3 text-sm rounded"
      case "lg":
        return "h-10 px-8 text-base rounded"
      case "icon":
        return "h-10 w-10 rounded"
      case "block":
        return "w-full justify-center rounded"
      default:
        return "h-10 px-6 text-medium rounded"
    }
  }

  const getAuraStyles = () => {
    if (!enableAura || !onAuraClick) return ""
    return `
      relative after:content-['+'] after:absolute after:right-2 after:top-1/2 after:-translate-y-1/2 after:bg-morado-400 after:text-white afterrounded-full after:w- after:h- after:flex items-center after:justify-center after:text-xs after:shadow-neon
    `
  }

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none 
        disable:focus-visible:outline-none",
        getVariantStyles(),
        getSizeStyles(),
        "relative overflow-hidden",
        loading && "pointer-events-none opacity-50",
        iconOnly && "flex-shrink-0",
        className
      )}
      ref={ref}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
          <circle 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            stroke-width="3" 
            fill="none" 
          />
        </svg>
      ) : iconOnly ? (
        <svg className="h-5 w-5" width="24" height="24" viewBox="0 0 24 24">
          {children}
        </svg>
      ) : children}
      
      {enableAura && !iconOnly && (
        <button
          type="button"
          onClick={onAuraClick}
          className="mt-2 w-full rounded-md bg-primary/10 text-primary/80 text-sm py-2 hover:bg-primary/20 transition-colores"
        >
          Ganar Aura
        </button>
      )}
    </button>
  )
})

Button.displayName = "Button"
Button.defaultProps = {
  loading: false,
  iconOnly: false,
  enableAura: false,
}