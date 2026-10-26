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
    "focus-ring inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold shadow-bevel transition-[background-color,color,border-color,transform,box-shadow] duration-200 ease-bezier hover:-translate-y-0.5 hover:shadow-bevelLift active:translate-y-0 active:scale-[0.98] active:shadow-bevel disabled:pointer-events-none disabled:opacity-55",
    {
      primary:
        "bg-primary text-primary-foreground hover:bg-primary/92",
      secondary:
        "bg-foreground text-background hover:bg-foreground/92",
      outline:
        "border border-line bg-surface text-foreground shadow-none hover:-translate-y-0.5 hover:border-foreground/45 hover:bg-muted/60 hover:shadow-bevel",
      ghost: "text-foreground shadow-none hover:translate-y-0 hover:bg-muted/70",
      danger:
        "bg-danger text-danger-foreground hover:bg-danger/92",
      aura: "bg-aura text-aura-foreground hover:bg-aura/92",
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
  /** Pasa el estilo al único hijo (p. ej. un <Link>). */
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading = false, disabled, asChild = false, children, ...props }, forwardedRef) => {
    const classes = buttonStyles({ variant, size, className })

    if (asChild) {
      const child = React.Children.only(children) as React.ReactElement<{ className?: string }>
      return React.cloneElement(child, {
        className: cn(classes, child.props.className),
      })
    }

    return (
      <button
        ref={forwardedRef}
        className={classes}
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
    )
  },
)
Button.displayName = "Button"
