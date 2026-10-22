"use client"

import * as React from "react"
import Link from "next/link"
import { AuraMark, CategoryIcon } from "@/components/brand"
import { StatusBadge } from "@/components/status-badge"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button, buttonStyles } from "@/components/ui/button"
import { useToast } from "@/components/providers/toast-provider"
import { useTornuti } from "@/components/providers/tornuti-provider"
import { CATEGORIES, PLAYERS, TEAMS } from "@/lib/data"
import type { Category } from "@/lib/types"
import { CATEGORY_LABEL } from "@/lib/tournament"
import { TONE_CLASS } from "@/lib/tone"
import { cn, formatNumber } from "@/lib/utils"

export function TeamsBrowser() {
  const { hasJoinedTeam, joinTeam, session } = useTornuti()
  const { push } = useToast()
  const [query, setQuery] = React.useState("")
  const [category, setCategory] = React.useState<Category | "todas">("todas")

  const teams = React.useMemo(() => {
    const term = query.trim().toLowerCase()
    return [...TEAMS]
      .filter((team) => (category === "todas" ? true : team.category === category))
      .filter((team) =>
        term
          ? [team.name, team.motto, team.city].join(" ").toLowerCase().includes(term)
          : true,
      )
      .sort((a, b) => b.aura - a.aura)
  }, [category, query])

  const join = (slug: string, name: string) => {
    joinTeam(slug)
    push({
      title: `Te uniste a ${name}`,
      description: session
        ? "El equipo aparece en tu panel. La inscripción se guarda en este navegador."
        : "Guardamos la membresía en este navegador. Crea una cuenta para conservarla.",
      tone: "success",
    })
  }

  return (
    <div>
      <div className="border-b border-line bg-surface">
        <div className="shell py-10 lg:py-12">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h1 className="display text-4xl sm:text-5xl">Equipos</h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Plantillas que ya compiten en la temporada. Únete a una o reúne a la
                tuya para el próximo torneo.
              </p>
            </div>
            <p className="text-2xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
              {TEAMS.length} equipos activos
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="w-full sm:max-w-sm">
              <label htmlFor="buscar-equipo" className="field-label">
                Buscar equipo
              </label>
              <input
                id="buscar-equipo"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Nombre, lema o ciudad"
                className="field"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(["todas", ...CATEGORIES.map((item) => item.id)] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setCategory(value as Category | "todas")}
                  aria-pressed={category === value}
                  className={cn(
                    "focus-ring inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                    category === value
                      ? "border-foreground bg-foreground text-background"
                      : "border-line text-muted-foreground hover:border-foreground/40 hover:text-foreground",
                  )}
                >
                  {value === "todas" ? "Todas" : CATEGORY_LABEL[value]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="shell py-10">
        {teams.length === 0 ? (
          <div className="border border-dashed border-line bg-surface px-6 py-16 text-center">
            <p className="text-lg font-bold">No hay equipos con ese filtro</p>
            <p className="mt-1 text-sm text-muted-foreground">Prueba con otra categoría o cambia la búsqueda.</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-5"
              onClick={() => {
                setQuery("")
                setCategory("todas")
              }}
            >
              Limpiar filtros
            </Button>
          </div>
        ) : (
          <ul className="border-t border-line">
            {teams.map((team) => {
              const joined = hasJoinedTeam(team.slug)
              const members = team.members
                .map((memberId) => PLAYERS.find((player) => player.id === memberId))
                .filter(Boolean)

              return (
                <li
                  key={team.id}
                  className={cn(
                    "grid gap-4 border-b border-line py-6 sm:grid-cols-[3.5rem_1fr_auto] sm:items-center sm:gap-6",
                    TONE_CLASS[team.category],
                  )}
                >
                  <div className="flex h-14 w-14 items-center justify-center border border-line bg-tone-soft">
                    <span className="text-lg font-extrabold text-tone">
                      {team.name
                        .split(" ")
                        .slice(0, 2)
                        .map((part) => part[0])
                        .join("")}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-bold tracking-[-0.01em]">{team.name}</h2>
                      <Badge variant="outline">
                        <CategoryIcon category={team.category} className="h-3 w-3" />
                        {CATEGORY_LABEL[team.category]}
                      </Badge>
                      {joined ? <Badge variant="primary">Eres miembro</Badge> : null}
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">{team.motto}</p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <span className="flex -space-x-2">
                          {members.slice(0, 4).map((member) => (
                            <Avatar key={member!.id} name={member!.name} size="xs" className="ring-2 ring-background" />
                          ))}
                        </span>
                        {members.length} {members.length === 1 ? "miembro" : "miembros"}
                      </span>
                      <span>{team.city}</span>
                      <span className="tabular">{team.wins} victorias en {team.played} partidos</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-aura">
                        <AuraMark className="h-3 w-3" />
                        {formatNumber(team.aura)} Aura
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:justify-end">
                    {joined ? (
                      <span className="inline-flex h-9 items-center gap-1.5 border border-success/40 bg-success/10 px-3 text-xs font-bold text-success">
                        <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
                          <path d="m2.5 7 3 3 6-6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Miembro
                      </span>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => join(team.slug, team.name)}>
                        Unirme
                      </Button>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        <div className="mt-12 grid gap-8 border-t border-line pt-8 md:grid-cols-[1fr_1fr] md:gap-14">
          <div>
            <h2 className="text-xl font-bold tracking-[-0.01em]">Un equipo, una identidad</h2>
            <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground">
              El equipo reúne a las personas que juegan juntas y conserva su historial
              entre torneos. Al inscribirte en un torneo puedes competir a título
              individual o representar a tu plantilla.
            </p>
          </div>
          <div className="flex flex-col items-start justify-between gap-4 border-l-0 border-line md:border-l md:pl-8">
            <p className="text-sm font-semibold">¿Todavía no tienes equipo?</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Publica un torneo y usa la ficha para convocar. Los equipos se crean al
              inscribirse, sin papeleo.
            </p>
            <div className="flex gap-2">
              <Link href="/crear" className={buttonStyles({ size: "sm" })}>
                Crear torneo
              </Link>
              <Link href="/explorar" className={buttonStyles({ variant: "outline", size: "sm" })}>
                Buscar torneo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
