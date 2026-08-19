"use client"

import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface BadgeProps {
  variant?: "default" | "outline" | "pill" | "gradient" | "aura"
  size?: "sm" | "md" | "lg"
  className?: string
  pillIcon?: boolean
}

export const Badge = ({ 
  variant = "default", 
  size = "md", 
  className, 
  children,
  pillIcon = false
}: BadgeProps) => {
  const sizeMap = {
    sm: "h-6 w-6 text-xs px-2 py-0.5",
    md: "h-8 w-8 text-sm px-3 py-1",
    lg: "h-10 w-10 text-base px-4 py-2",
  }

  const getVariantStyles = () => {
    switch (variant) {
      case "default":
        return `bg-primary text-primary-foreground`
      case "outline":
        return `border border-primary text-primary`
      case "pill":
        return `rounded-full bg-primary/10 text-primary px-2 py-1 text-xs inline-flex items-center gap-2`
      case "gradient":
        return `bg-gradient-to-r from-morado-500 to-salvadoreño-claro-500 text-white`
      case "aura":
        return `bg-gradient-to-r from-amber-500 to-orange-500 text-white`
      default:
        return `bg-primary text-primary-foreground`
    }
  }

  const getSizeClass = sizeMap[size] || sizeMap.md

  // Aura pulse animation for aura variant
  const auraClass = variant === "aura" ? "animate-pulse-slow" : ""

  return (
    <span className={cn(
      "inline-flex items-center rounded-md",
      getVariantStyles(),
      getSizeClass,
      auraClass,
      className
    )}>
      {children}
      {pillIcon && (
        <X className="h-2 w-2 text-xs opacity-80" />
      )}
    </span>
  )
}

Badge.displayName = "Badge"