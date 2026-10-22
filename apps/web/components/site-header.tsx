"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Brand, AuraMark, FlagSV } from "@/components/brand"
import { ThemeToggle } from "@/components/providers/theme-provider"
import { Avatar } from "@/components/ui/avatar"
import { buttonStyles } from "@/components/ui/button"
import { useTornuti } from "@/components/providers/tornuti-provider"
import { cn, formatNumber } from "@/lib/utils"

const links = [
  { href: "/explorar", label: "Explorar" },
  { href: "/ranking", label: "Ranking" },
  { href: "/equipos", label: "Equipos" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const { session, ready, logout } = useTornuti()
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    setOpen(false)
  }, [pathname])

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-background/95">
      <div className="border-b border-line/70 bg-foreground text-background">
        <div className="shell flex h-8 items-center justify-between gap-4 text-2xs font-medium tracking-[0.04em]">
          <p className="truncate">
            Temporada 2026 abierta. Publicar un torneo es gratis, siempre.
          </p>
          <Link
            href="/crear"
            className="focus-ring hidden shrink-0 items-center gap-1 rounded-sm underline-offset-4 hover:underline sm:inline-flex"
          >
            Publicar
            <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" aria-hidden="true">
              <path d="M2 10 10 2M4 2h6v6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="shell flex h-16 items-center justify-between gap-4">
        <Brand />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navegación principal">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "focus-ring rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive(link.href)
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
              aria-current={isActive(link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden sm:inline-flex" />
          {!ready ? (
            <span className="h-10 w-24 animate-pulse rounded-md bg-muted" aria-hidden="true" />
          ) : session ? (
            <>
              <Link
                href="/dashboard"
                className="focus-ring hidden items-center gap-2 rounded-md border border-line px-2 py-1.5 transition-colors hover:bg-muted sm:flex"
                aria-label={`Ir a mi panel, ${session.name}`}
              >
                <Avatar name={session.name} size="sm" />
                <span className="max-w-28 truncate text-sm font-semibold">{session.name.split(" ")[0]}</span>
                <span className="flex items-center gap-1 rounded bg-aura/15 px-1.5 py-0.5 text-2xs font-bold tabular text-aura">
                  <AuraMark className="h-3 w-3" />
                  {formatNumber(session.aura)}
                </span>
              </Link>
              <Link href="/crear" className={cn(buttonStyles({ size: "sm" }), "hidden sm:inline-flex")}>
                Crear torneo
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(buttonStyles({ variant: "ghost", size: "sm" }), "hidden sm:inline-flex")}
              >
                Entrar
              </Link>
              <Link href="/crear" className={cn(buttonStyles({ size: "sm" }), "hidden sm:inline-flex")}>
                Crear torneo
              </Link>
            </>
          )}

          <button
            type="button"
            className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-md border border-line md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden="true">
                <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden="true">
                <path d="M3 5.5h14M3 10h14M3 14.5h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-nav" className="border-t border-line bg-surface md:hidden">
          <div className="shell flex flex-col gap-1 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "focus-ring rounded-md px-3 py-2.5 text-base font-semibold",
                  isActive(link.href) ? "bg-muted" : "hover:bg-muted/60",
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/crear" className="focus-ring rounded-md px-3 py-2.5 text-base font-semibold hover:bg-muted/60">
              Crear torneo
            </Link>
            <div className="my-3 h-px bg-line" />
            {session ? (
              <>
                <Link href="/dashboard" className="focus-ring flex items-center gap-3 rounded-md px-3 py-2">
                  <Avatar name={session.name} />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{session.name}</span>
                    <span className="block text-xs text-muted-foreground">
                      {formatNumber(session.aura)} Aura
                    </span>
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="focus-ring rounded-md px-3 py-2.5 text-left text-base font-semibold text-danger hover:bg-muted/60"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 px-1">
                <Link href="/login" className={buttonStyles({ variant: "outline", size: "md", className: "w-full" })}>
                  Entrar
                </Link>
                <Link href="/registro" className={buttonStyles({ size: "md", className: "w-full" })}>
                  Crear cuenta
                </Link>
              </div>
            )}
            <div className="mt-3 flex items-center justify-between px-3 pb-1">
              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                <FlagSV /> San Salvador, El Salvador
              </span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
