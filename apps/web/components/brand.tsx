import type * as React from "react"
import Link from "next/link"
import type { Category } from "@/lib/types"
import { cn } from "@/lib/utils"

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      className={cn("h-8 w-8", className)}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6.5 6.5v7.2a3.6 3.6 0 0 0 3.6 3.6h7.1"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M6.5 29.5v-7.2a3.6 3.6 0 0 1 3.6-3.6h7.1"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path d="m25.4 10.6 6 7.4-6 7.4-6-7.4 6-7.4Z" fill="currentColor" />
      <circle cx="25.4" cy="18" r="2.1" fill="var(--mark-cut, hsl(var(--background)))" />
    </svg>
  )
}

export function Brand({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("focus-ring group inline-flex items-center gap-2.5 rounded-sm", className)}
      aria-label="Tornuti, ir al inicio"
    >
      <BrandMark className="h-8 w-8 text-primary transition-transform duration-300 group-hover:-rotate-6" />
      <span className="display text-[1.3rem] uppercase leading-none tracking-[-0.03em]">
        Tornuti
      </span>
    </Link>
  )
}

export function AuraMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={cn("h-4 w-4", className)} fill="none" aria-hidden="true">
      <path d="M8 1.5 9.6 6.4 14.5 8 9.6 9.6 8 14.5 6.4 9.6 1.5 8l4.9-1.6L8 1.5Z" fill="currentColor" />
    </svg>
  )
}

const categoryIcons: Record<Category, React.ReactNode> = {
  deportes: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.4 9.2h17.2M3.4 14.8h17.2M12 3v18" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5.2 5.4c2.3 2.1 3.5 4.3 3.5 6.6s-1.2 4.5-3.5 6.6M18.8 5.4c-2.3 2.1-3.5 4.3-3.5 6.6s1.2 4.5 3.5 6.6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  gaming: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7.5 7.5h9a5.5 5.5 0 0 1 5 8l-.7 1.3a2 2 0 0 1-3.4.4l-1.9-2.2h-5l-1.9 2.2a2 2 0 0 1-3.4-.4l-.7-1.3a5.5 5.5 0 0 1 5-8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8 10.5v4M6 12.5h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="16" cy="12.5" r="1" fill="currentColor" />
      <circle cx="18" cy="10.5" r="1" fill="currentColor" />
    </svg>
  ),
  comunidad: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="3.1" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 19c.4-3.2 2.6-5 5.5-5s5.1 1.8 5.5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M15.5 5.5a3 3 0 0 1 0 5.7M17 14.5c2.1.4 3.3 2 3.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  cultura: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 6.5c-1.8-1.4-4-2-7-2v13c3 0 5.2.6 7 2 1.8-1.4 4-2 7-2v-13c-3 0-5.2.6-7 2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 6.5v13" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  empresas: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 20V6.5A2.5 2.5 0 0 1 6.5 4h6A2.5 2.5 0 0 1 15 6.5V20M15 10h3.5A1.5 1.5 0 0 1 20 11.5V20M2.5 20h19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 8h4M7.5 11.5h4M7.5 15h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
}

export function CategoryIcon({ category, className }: { category: Category; className?: string }) {
  return <span className={cn("inline-block h-5 w-5", className)}>{categoryIcons[category]}</span>
}

export function FlagSV(): React.ReactNode {
  return (
    <svg viewBox="0 0 24 16" className="h-3.5 w-5 rounded-[2px]" aria-hidden="true">
      <rect width="24" height="16" fill="#1B3FC4" />
      <rect y="4.6" width="24" height="6.8" fill="#F7F4ED" />
    </svg>
  )
}
