"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CategoryIcon } from "@/components/brand"
import { TournamentCard } from "@/components/tournament-card"
import { buttonStyles } from "@/components/ui/button"
import { useTornuti } from "@/components/providers/tornuti-provider"
import { CATEGORIES, FORMATS, TOURNAMENTS } from "@/lib/data"
import { CATEGORY_LABEL, spotsLeft } from "@/lib/tournament"
import type { Category, TournamentFormat, TournamentStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

type Sort = "fecha" | "aura" | "cupos"

const statusOptions: { value: TournamentStatus | "todos"; label: string }[] = [
  { value: "todos", label: "Todos los estados" },
  { value: "abierto", label: "Inscripción abierta" },
  { value: "ultimos-cupos", label: "Últimos cupos" },
  { value: "en-curso", label: "En juego" },
  { value: "finalizado", label: "Finalizados" },
]

export function ExploreBrowser() {
  const params = useSearchParams()
  const { created } = useTornuti()
  const initialCategory = (params.get("categoria") as Category | null) ?? "todas"
  const [query, setQuery] = React.useState("")
  const [category, setCategory] = React.useState<Category | "todas">(initialCategory)
  const [format, setFormat] = React.useState<TournamentFormat | "todos">("todos")
  const [status, setStatus] = React.useState<TournamentStatus | "todos">("todos")
  const [sort, setSort] = React.useState<Sort>("fecha")

  const all = React.useMemo(() => [...created, ...TOURNAMENTS], [created])

  const results = React.useMemo(() => {
    const term = query.trim().toLowerCase()
    const filtered = all.filter((tournament) => {
      if (category !== "todas" && tournament.category !== category) return false
      if (format !== "todos" && tournament.format !== format) return false
      if (status !== "todos" && tournament.status !== status) return false
      if (!term) return true
      return [tournament.name, tournament.summary, tournament.sport, tournament.location, tournament.organizer.name]
        .join(" ")
        .toLowerCase()
        .includes(term)
    })

    return filtered.sort((a, b) => {
      if (sort === "aura") return b.auraPrize - a.auraPrize
      if (sort === "cupos") return spotsLeft(b) - spotsLeft(a)
      return new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
    })
  }, [all, category, format, query, sort, status])

  const hasFilters =
    query !== "" || category !== "todas" || format !== "todos" || status !== "todos"

  const reset = () => {
    setQuery("")
    setCategory("todas")
    setFormat("todos")
    setStatus("todos")
    setSort("fecha")
  }

  return (
    <div>
      <div className="border-b border-line bg-surface">
        <div className="shell py-10 lg:py-12">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h1 className="display text-4xl sm:text-5xl">Explorar torneos</h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                La agenda completa de Tornuti: busca por nombre, sede o disciplina y
                filtra por categoría, formato o estado. Los cupos y las fechas son
                los que publica cada organización.
              </p>
            </div>
            <p className="text-2xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
              {all.length} torneos publicados
            </p>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-[1.6fr_1fr_1fr]">
            <div>
              <label htmlFor="buscar" className="field-label">
                Buscar
              </label>
              <div className="relative">
                <svg
                  viewBox="0 0 18 18"
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle cx="8" cy="8" r="5.2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="m12 12 3.2 3.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <input
                  id="buscar"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Copa Cadejos, Valorant, Santa Ana..."
                  className="field pl-9"
                />
              </div>
            </div>

            <div>
              <label htmlFor="categoria" className="field-label">
                Categoría
              </label>
              <select
                id="categoria"
                value={category}
                onChange={(event) => setCategory(event.target.value as Category | "todas")}
                className="field"
              >
                <option value="todas">Todas las categorías</option>
                {CATEGORIES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="formato" className="field-label">
                Formato
              </label>
              <select
                id="formato"
                value={format}
                onChange={(event) => setFormat(event.target.value as TournamentFormat | "todos")}
                className="field"
              >
                <option value="todos">Todos los formatos</option>
                {Object.entries(FORMATS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-1.5">
              {(["todas", ...CATEGORIES.map((item) => item.id)] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setCategory(value as Category | "todas")}
                  className={cn(
                    "focus-ring inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                    category === value
                      ? "border-foreground bg-foreground text-background"
                      : "border-line bg-background text-muted-foreground hover:border-foreground/40 hover:text-foreground",
                  )}
                  aria-pressed={category === value}
                >
                  {value === "todas" ? (
                    "Todas"
                  ) : (
                    <>
                      <CategoryIcon category={value} className="h-3.5 w-3.5" />
                      {CATEGORY_LABEL[value]}
                    </>
                  )}
                </button>
              ))}
            </div>

            <div className="ml-auto flex flex-wrap items-center gap-3">
              <label htmlFor="estado" className="sr-only">
                Estado
              </label>
              <select
                id="estado"
                value={status}
                onChange={(event) => setStatus(event.target.value as TournamentStatus | "todos")}
                className="h-9 rounded-md border border-line bg-background px-2.5 text-xs font-medium"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <label htmlFor="orden" className="sr-only">
                Ordenar
              </label>
              <select
                id="orden"
                value={sort}
                onChange={(event) => setSort(event.target.value as Sort)}
                className="h-9 rounded-md border border-line bg-background px-2.5 text-xs font-medium"
              >
                <option value="fecha">Por fecha</option>
                <option value="aura">Más Aura</option>
                <option value="cupos">Más cupos</option>
              </select>

              {hasFilters ? (
                <button
                  type="button"
                  onClick={reset}
                  className="focus-ring rounded-sm text-xs font-semibold underline decoration-line underline-offset-4 hover:decoration-foreground"
                >
                  Limpiar
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="shell py-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground" role="status" aria-live="polite">
            <span className="font-bold text-foreground">{results.length}</span>{" "}
            {results.length === 1 ? "torneo encontrado" : "torneos encontrados"}
          </p>
          <p className="text-2xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Inscripción gratuita
          </p>
        </div>

        {results.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-line bg-surface px-6 py-16 text-center">
            <svg viewBox="0 0 64 48" className="mx-auto h-16 w-20 text-muted-foreground" fill="none" aria-hidden="true">
              <path d="M6 8h14v8h14v8h10M6 40h14v-8h14v-8h10M34 24h12" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="50" cy="24" r="5" stroke="currentColor" strokeWidth="1.6" />
              <path d="m48 22 2 2 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h2 className="mt-5 text-lg font-bold">Ningún torneo coincide con esos filtros</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              Prueba con otra categoría o quita la búsqueda. Si lo que buscas no
              existe, puedes publicarlo tú.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button type="button" onClick={reset} className={buttonStyles({ variant: "outline", size: "sm" })}>
                Quitar filtros
              </button>
              <Link href="/crear" className={buttonStyles({ size: "sm" })}>
                Crear un torneo
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
