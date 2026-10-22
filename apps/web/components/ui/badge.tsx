import * as React from "react"
import { cn } from "@/lib/utils"

type BadgeVariant = "neutral" | "outline" | "primary" | "live" | "aura" | "tone" | "soft"

export function Badge({
  children,
  variant = "neutral",
  className,
  dot = false,
}: {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
  dot?: boolean
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-2xs font-semibold uppercase tracking-[0.08em]",
        {
          neutral: "bg-muted text-muted-foreground",
          outline: "border border-line text-muted-foreground",
          primary: "bg-primary/10 text-primary",
          soft: "bg-elevated text-foreground",
          live: "bg-success text-success-foreground",
          aura: "bg-aura/15 text-aura",
          tone: "bg-tone text-tone-foreground",
        }[variant],
        className,
      )}
    >
      {dot ? (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            variant === "live" ? "bg-success-foreground" : "bg-current",
          )}
          aria-hidden="true"
        />
      ) : null}
      {children}
    </span>
  )
}
