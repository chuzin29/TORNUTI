"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Brand, AuraMark } from "@/components/brand"
import { ThemeToggle } from "@/components/providers/theme-provider"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useTornuti } from "@/components/providers/tornuti-provider"
import { cn, formatNumber } from "@/lib/utils"
import { Menu, X, LogOut } from "lucide-react"

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
    <header className="sticky top-0 z-50 border-b border-line bg-background/72 backdrop-blur-xl backdrop-saturate-150">
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
                className={cn(
                  "focus-ring hidden items-center gap-2 rounded-md border border-line px-2 py-1.5 transition-colors hover:bg-muted sm:flex",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                )}
                aria-label={`Ir a mi panel, ${session.name}`}
              >
                <Avatar name={session.name} size="sm" />
                <span className="max-w-28 truncate text-sm font-semibold">{session.name.split(" ")[0]}</span>
                <span className="flex items-center gap-1 rounded bg-aura/15 px-1.5 py-0.5 text-2xs font-bold tabular text-aura">
                  <AuraMark className="h-3 w-3" />
                  {formatNumber(session.aura)}
                </span>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { logout(); setOpen(false) }}
                className="hidden sm:inline-flex"
              >
                <LogOut className="h-4 w-4" /> Cerrar sesión
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Entrar</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/registro">Crear cuenta</Link>
              </Button>
            </>
          )}

          <button
            type="button"
            className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-md border border-line md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-nav" className="border-t border-line bg-background md:hidden">
          <div className="shell flex flex-col gap-2 px-6 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "px-3 py-2 text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="mt-2 flex items-center gap-2 text-sm font-semibold"
                  onClick={() => setOpen(false)}
                >
                  <Avatar name={session.name} size="sm" />
                  Panel ({formatNumber(session.aura)})
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { logout(); setOpen(false) }}
                  className="mt-2 w-full"
                >
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="mt-2" onClick={() => setOpen(false)}>
                  Entrar
                </Link>
                <Link href="/registro" className="mt-2" onClick={() => setOpen(false)}>
                  Crear cuenta
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
