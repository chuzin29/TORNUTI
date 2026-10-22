import * as React from "react"
import { cn } from "@/lib/utils"

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "aura"
type Size = "sm" | "md" | "lg" | "icon"

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: Variant
  size?: Size
  className?: string
} = {}) {
  return cn(
    "focus-ring inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold transition-[background-color,color,border-color,transform] duration-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
    {
      primary:
        "bg-primary text-primary-foreground hover:bg-primary/90",
      secondary:
        "bg-foreground text-background hover:bg-foreground/88",
      outline:
        "border border-line bg-transparent text-foreground hover:border-foreground/45 hover:bg-muted/50",
      ghost: "text-foreground hover:bg-muted/70",
      danger: "bg-danger text-danger-foreground hover:bg-danger/90",
      aura: "bg-aura text-aura-foreground hover:bg-aura/90",
    }[variant],
    {
      sm: "h-9 px-3.5 text-[0.8125rem]",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-[0.9375rem]",
      icon: "h-10 w-10 p-0",
    }[size],
    className,
  )
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading = false, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      className={buttonStyles({ variant, size, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <svg
          className="h-4 w-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
          <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ) : null}
      {children}
    </button>
  ),
)
Button.displayName = "Button"
