"use client"

import { cn } from "@/lib/utils"
import { Trophy, Medal, Users, Calendar, Eye, Share, Heart } from "lucide-react"

interface CardProps {
  header?: string
  subtitle?: string
  className?: string
  footer?: React.ReactNode
  elevation?: "none" | "sm" | "md" | "lg" "xl"
  hover?: boolean
  shadow?: boolean
}

export const Card = ({ 
  header, 
  subtitle, 
  className, 
  footer, 
  elevation = "md",
  hover = true,
  shadow = true,
  children 
}: CardProps) => {
  const elevationStyles = {
    none: "shadow-none",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
  }

  const shadowStyles = {
    true: `transition-shadow hover:shadow-lg hover:-ml-2 hover:-mr-2`,
    false: "shadow-none",
  }

  return (
    <div className={cn(
      `bg-card rounded-xl border border-border ${elevationStyles[elevation]} ${shadowStyles[shadow]} ${hover ? "hover:translate-y-1 hover:-translate-x-1 transition-transform" : ""}`,
      className
    )}>
      {header || subtitle && (
        <div className="p-5 border-b border-border">
          {header && (
            <h3 className="font-medium text-foreground">{header}</h3>
          )}
          {subtitle && (
            <p className="text-muted-foreground text-sm">{subtitle}</p>
          )}
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && (
        <div className="p-6 border-t border-border flex items-center justify-end">
          {typeof footer === "function" ? footer() : footer}
        </div>
      )}
    </div>
  )
}

Card.displayName = "Card"