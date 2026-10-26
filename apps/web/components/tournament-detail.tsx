"use client"

import * as React from "react"
import Link from "next/link"
import { AuraMark, CategoryIcon } from "@/components/brand"
import { StatusBadge } from "@/components/status-badge"
import { TournamentCover } from "@/components/tournament-cover"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button, buttonStyles } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/providers/toast-provider"
import { useTornuti } from "@/components/providers/tornuti-provider"
import { FORMATS, TOURNAMENTS } from "@/lib/data"
import { buildBracket } from "@/lib/bracket"
import { formatDate, formatDateTime, formatTime } from "@/lib/format"
import { CATEGORY_LABEL, spotsLeft } from "@/lib/tournament"
import { TONE_CLASS } from "@/lib/tone"
import type { Match, Tournament } from "@/lib/types"
import { cn, formatNumber } from "@/lib/utils"

type Tab = "resumen" | "participantes" | "cuadro" | "calendario"

const tabs: { id: Tab; label: string }[] = [
  { id: "resumen", label: "Resumen" },
  { id: "participantes", label: "Participantes" },
  { id: "cuadro", label: "Cuadro" },
  { id: "calendario", label: "Calendario" },
]

function MetaItem({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="border-t border-line pt-3">
      <dt className="text-2xs font-bold uppercase tracking-[0.12em] text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm font-semibold leading-snug">{value}</dd>
      {hint ? <dd className="mt-0.5 text-xs text-muted-foreground">{hint}</dd> : null}
    </div>
  )
}

function BracketView({ tournament }: { tournament: Tournament }) {
  if (tournament.matches.length > 0) {
    const rounds = new Map<number, Match[]>()
    for (const match of tournament.matches) {
      rounds.set(match.round, [...(rounds.get(match.round) ?? []), match])
    }

    return (
      <div>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            Partidos y resultados publicados por la organización.
          </p>
          <Badge variant="outline">{tournament.matches.length} partidos</Badge>
        </div>
        <div className="space-y-8">
          {[...rounds.entries()]
            .sort(([a], [b]) => a - b)
            .map(([round, matches]) => (
              <section key={round} aria-label={`Ronda ${round}`}>
                <div className="mb-3 flex items-center gap-3">
                  <h3 className="text-2xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                    Ronda {round}
                  </h3>
                  <span className="h-px flex-1 bg-line" aria-hidden="true" />
                </div>
                <ul className="grid gap-2.5 sm:grid-cols-2">
                  {matches.map((match) => {
                    const finished = match.status === "finalizado"
                    const team1Won = finished && match.score1 !== null && match.score2 !== null && match.score1 > match.score2
                    const team2Won = finished && match.score1 !== null && match.score2 !== null && match.score2 > match.score1
                    return (
                      <li key={match.id} className="border border-line bg-surface">
                        <div className="flex items-center justify-between gap-2 border-b border-line bg-elevated/50 px-3 py-1.5">
                          <span className="truncate text-2xs font-bold uppercase tracking-[0.1em] text-muted-foreground">
                            {match.stage}
                          </span>
                          <span className="shrink-0 text-2xs font-semibold text-muted-foreground">
                            {match.status === "en-vivo"
                              ? "En juego"
                              : finished
                                ? "Finalizado"
                                : "Programado"}
                          </span>
                        </div>
                        <div className="px-3 py-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className={cn("truncate text-xs", team1Won ? "font-bold" : "font-medium")}>
                              {match.team1}
                            </span>
                            <span className={cn("tabular text-xs", team1Won ? "font-extrabold" : "text-muted-foreground")}>
                              {match.score1 ?? "—"}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center justify-between gap-2">
                            <span className={cn("truncate text-xs", team2Won ? "font-bold" : "font-medium")}>
                              {match.team2}
                            </span>
                            <span className={cn("tabular text-xs", team2Won ? "font-extrabold" : "text-muted-foreground")}>
                              {match.score2 ?? "—"}
                            </span>
                          </div>
                        </div>
                        <p className="border-t border-line px-3 py-1.5 text-2xs text-muted-foreground">
                          {formatDateTime(match.startsAt)}
                        </p>
                      </li>
                    )
                  })}
                </ul>
              </section>
            ))}
        </div>
      </div>
    )
  }

  if (tournament.format === "liga" || tournament.format === "suizo") {
    return (
      <div className="border border-dashed border-line px-6 py-12 text-center">
        <p className="text-sm font-semibold">
          Este torneo se juega en formato {FORMATS[tournament.format].toLowerCase()}
        </p>
        <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-muted-foreground">
          El calendario y la tabla se publican al cerrar la inscripción. La
          organización confirma cada jornada desde su panel.
        </p>
      </div>
    )
  }

  const rounds = buildBracket(tournament.entrants)
  if (rounds.length === 0) {
    return (
      <div className="border border-dashed border-line px-6 py-12 text-center">
        <p className="text-sm font-semibold">Aún no hay suficientes participantes</p>
        <p className="mt-1 text-sm text-muted-foreground">El cuadro se genera con dos o más inscritos.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Cuadro proyectado de eliminación directa. Se ordena por inscripción y las
          plazas libres se reparten entre las primeras cabezas de serie.
        </p>
        <Badge variant="outline">{rounds[0].matches.length * 2} plazas</Badge>
      </div>
      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-[640px] gap-4">
          {rounds.map((round) => (
            <div key={round.round} className="flex min-w-[180px] flex-1 flex-col">
              <p className="mb-3 text-2xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                {round.label}
              </p>
              <div className="flex flex-1 flex-col justify-around gap-3">
                {round.matches.map((match) => (
                  <div
                    key={match.id}
                    className={cn(
                      "border bg-surface",
                      round.round === rounds.length ? "border-foreground" : "border-line",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2 px-2.5 py-2">
                      <span className={cn("truncate text-xs", match.team1 ? "font-semibold" : "text-muted-foreground/70 italic")}>
                        {match.team1 ?? "Por definir"}
                      </span>
                      <span className="text-2xs tabular text-muted-foreground">—</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 border-t border-line px-2.5 py-2">
                      <span className={cn("truncate text-xs", match.team2 ? "font-semibold" : "text-muted-foreground/70 italic")}>
                        {match.team2 ?? "Por definir"}
                      </span>
                      <span className="text-2xs tabular text-muted-foreground">—</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function TournamentDetail({ slug }: { slug: string }) {
  const { created, registrations, registerForTournament, isRegistered, ready, session } = useTornuti()
  const { push } = useToast()
  const tournament = React.useMemo(
    () => created.find((item) => item.slug === slug) ?? TOURNAMENTS.find((item) => item.slug === slug),
    [created, slug],
  )

  const [tab, setTab] = React.useState<Tab>("resumen")
  const [showForm, setShowForm] = React.useState(false)
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [team, setTeam] = React.useState("")
  const [error, setError] = React.useState("")

  React.useEffect(() => {
    if (session) {
      setEmail(session.email)
      setName((current) => current || session.name)
    }
  }, [session])

  if (!ready) {
    return (
      <div className="shell py-20">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="mt-6 h-14 w-2/3 animate-pulse rounded bg-muted" />
        <div className="mt-8 h-64 animate-pulse rounded-card bg-muted/60" />
      </div>
    )
  }

  if (!tournament) {
    return (
      <div className="shell py-24 text-center">
        <p className="display text-5xl">404</p>
        <h1 className="mt-4 text-2xl font-bold">Este torneo no existe o fue retirado</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Revisa el enlace o explora los torneos que están abiertos ahora mismo.
        </p>
        <Link href="/explorar" className={cn(buttonStyles({ size: "md" }), "mt-6")}>
          Volver a explorar
        </Link>
      </div>
    )
  }

  const left = spotsLeft(tournament)
  const registered = isRegistered(tournament.slug)
  const registrationOpen =
    (tournament.status === "abierto" || tournament.status === "ultimos-cupos") && left > 0
  const myRegistration = registrations.find((entry) => entry.tournamentSlug === tournament.slug)
  const rounds = buildBracket(tournament.entrants)
  const finalMatch = tournament.matches.find(
    (match) => match.stage.trim().toLowerCase() === "final",
  )
  const champion =
    tournament.status === "finalizado" &&
    finalMatch?.status === "finalizado" &&
    finalMatch.score1 !== null &&
    finalMatch.score2 !== null
      ? finalMatch.score1 > finalMatch.score2
        ? finalMatch.team1
        : finalMatch.team2
      : null

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    setError("")
    const result = registerForTournament(tournament, { name, email, team })
    if (!result.ok) {
      setError(result.error ?? "No se pudo completar la inscripción.")
      return
    }
    setShowForm(false)
    push({
      title: "Inscripción registrada",
      description: session
        ? `Quedaste anotado en ${tournament.name}. Ganaste 40 Aura.`
        : `Quedaste anotado en ${tournament.name}. Entra a tu cuenta para sumar Aura.`,
      tone: "success",
    })
  }

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      push({ title: "Enlace copiado", description: "Compártelo con quien vaya a jugar.", tone: "success" })
    } catch {
      push({ title: "No se pudo copiar", description: "Copia la dirección desde la barra del navegador.", tone: "error" })
    }
  }

  return (
    <div>
      <div className={cn("relative", TONE_CLASS[tournament.category])}>
        <TournamentCover
          pattern={tournament.cover}
          category={tournament.category}
          photo={tournament.cover_url}
          priority
          className="h-32 w-full sm:h-40"
          label={tournament.sport}
        />
      </div>

      <div className="border-b border-line bg-surface">
        <div className="shell py-8 lg:py-10">
          <Link
            href="/explorar"
            className="focus-ring inline-flex items-center gap-1.5 rounded-sm text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
              <path d="M11 7H3M6 4 3 7l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Todos los torneos
          </Link>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <StatusBadge status={tournament.status} />
            <span className="inline-flex items-center gap-1.5 text-2xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
              <CategoryIcon category={tournament.category} className="h-3.5 w-3.5" />
              {CATEGORY_LABEL[tournament.category]} · {tournament.sport}
            </span>
            {tournament.featured ? <Badge variant="aura">Destacado</Badge> : null}
          </div>

          <div className="mt-3 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="display text-4xl leading-[1.02] sm:text-5xl lg:text-[3.4rem]">
                {tournament.name}
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
                {tournament.summary}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={share}>
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
                  <circle cx="12" cy="3.5" r="1.8" stroke="currentColor" strokeWidth="1.3" />
                  <circle cx="4" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.3" />
                  <circle cx="12" cy="12.5" r="1.8" stroke="currentColor" strokeWidth="1.3" />
                  <path d="m5.6 7.2 4.8-2.7M5.6 8.8l4.8 2.7" stroke="currentColor" strokeWidth="1.3" />
                </svg>
                Compartir
              </Button>
              <Link
                href="/crear"
                className={buttonStyles({ variant: "ghost", size: "sm" })}
              >
                Organizar uno
              </Link>
            </div>
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-line pt-5 sm:grid-cols-3 lg:grid-cols-6">
            <MetaItem label="Fecha" value={formatDate(tournament.startsAt)} hint={formatTime(tournament.startsAt)} />
            <MetaItem label="Sede" value={tournament.location} hint={tournament.city} />
            <MetaItem label="Formato" value={FORMATS[tournament.format]} hint={`${tournament.maxParticipants} cupos`} />
            <MetaItem label="Cierre" value={formatDate(tournament.registrationEndsAt)} hint="Inscripciones" />
            <MetaItem
              label="Aura"
              value={formatNumber(tournament.auraPrize)}
              hint={tournament.status === "finalizado" ? "Repartida en el podio" : "Para el podio"}
            />
            <MetaItem label="Organiza" value={tournament.organizer.name} hint={`@${tournament.organizer.handle}`} />
          </dl>
        </div>
      </div>

      <div className="shell grid gap-10 py-10 lg:grid-cols-[1fr_22rem] lg:gap-14 lg:py-12">
        <div className="min-w-0">
          {champion ? (
            <div className="mb-7 flex flex-wrap items-center justify-between gap-4 border border-foreground bg-accent px-5 py-4 text-accent-foreground">
              <div>
                <p className="text-2xs font-bold uppercase tracking-[0.14em]">Campeón</p>
                <p className="mt-0.5 text-xl font-extrabold">{champion}</p>
              </div>
              <AuraMark className="h-8 w-8" />
            </div>
          ) : null}

          <div className="border-b border-line">
            <div className="flex gap-1 overflow-x-auto no-scrollbar" role="tablist" aria-label="Detalle del torneo">
              {tabs.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  id={`tab-${item.id}`}
                  aria-selected={tab === item.id}
                  aria-controls={`panel-${item.id}`}
                  onClick={() => setTab(item.id)}
                  className={cn(
                    "focus-ring -mb-px whitespace-nowrap border-b-2 px-2.5 py-2.5 text-xs font-semibold transition-colors sm:px-3.5 sm:text-sm",
                    tab === item.id
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-7">
            {tab === "resumen" ? (
              <div
                role="tabpanel"
                id="panel-resumen"
                aria-labelledby="tab-resumen"
                className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]"
              >
                <div>
                  <h2 className="text-xl font-bold tracking-[-0.01em]">Sobre el torneo</h2>
                  <p className="mt-3 max-w-prose whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                    {tournament.description}
                  </p>

                  <h2 className="mt-8 text-xl font-bold tracking-[-0.01em]">Reglas</h2>
                  <ol className="mt-3 space-y-2.5">
                    {tournament.rules.map((rule, index) => (
                      <li key={rule} className="flex gap-3 text-sm leading-relaxed">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-line text-2xs font-bold tabular text-muted-foreground">
                          {index + 1}
                        </span>
                        <span className="text-muted-foreground">{rule}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <aside className="border-t border-line pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                  <h2 className="text-sm font-bold">Qué obtienes al inscribirte</h2>
                  <ul className="mt-3 space-y-3">
                    {[
                      "Página propia del torneo con horarios y cuadro.",
                      "40 Aura por inscripción confirmada.",
                      "Historial de partidos y resultados en tu perfil.",
                      "Avisos de cambios desde la organización.",
                    ].map((item) => (
                      <li key={item} className="flex gap-2.5 text-sm text-muted-foreground">
                        <svg viewBox="0 0 14 14" className="mt-0.5 h-4 w-4 shrink-0 text-success" fill="none" aria-hidden="true">
                          <path d="m2.5 7 3 3 6-6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 border border-line bg-elevated/50 p-4">
                    <p className="text-2xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Organiza</p>
                    <div className="mt-2 flex items-center gap-2.5">
                      <Avatar name={tournament.organizer.name} size="sm" />
                      <div>
                        <p className="text-sm font-semibold">{tournament.organizer.name}</p>
                        <p className="text-xs text-muted-foreground">@{tournament.organizer.handle}</p>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            ) : null}

            {tab === "participantes" ? (
              <div role="tabpanel" id="panel-participantes" aria-labelledby="tab-participantes">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-bold tracking-[-0.01em]">Lista de inscritos</h2>
                  <p className="text-xs font-semibold tabular text-muted-foreground">
                    {tournament.entrants.length} de {tournament.maxParticipants}
                  </p>
                </div>
                <ul className="mt-5 grid gap-px overflow-hidden rounded border border-line bg-line sm:grid-cols-2">
                  {tournament.entrants.map((entrant, index) => (
                    <li key={`${entrant}-${index}`} className="flex items-center gap-3 bg-surface px-4 py-3">
                      <span className="w-6 text-2xs font-bold tabular text-muted-foreground">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <Avatar name={entrant} size="sm" />
                      <span className="min-w-0 flex-1 truncate text-sm font-semibold">{entrant}</span>
                      <Badge variant="outline">Confirmado</Badge>
                    </li>
                  ))}
                  {registrationOpen
                    ? Array.from({ length: Math.min(left, 6) }).map((_, index) => (
                        <li
                          key={`libre-${index}`}
                          className="flex items-center gap-3 bg-surface px-4 py-3 text-muted-foreground/60"
                        >
                          <span className="w-6 text-2xs font-bold tabular">
                            {String(tournament.entrants.length + index + 1).padStart(2, "0")}
                          </span>
                          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-dashed border-line">
                            <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
                              <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                            </svg>
                          </span>
                          <span className="text-sm">Cupo disponible</span>
                        </li>
                      ))
                    : null}
                </ul>
                {registrationOpen && left > 6 ? (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Y {left - 6} cupos más disponibles.
                  </p>
                ) : null}
                {!registrationOpen ? (
                  <p className="mt-3 text-xs text-muted-foreground">
                    La lista quedó cerrada con {tournament.entrants.length}{" "}
                    {tournament.entrants.length === 1 ? "participante" : "participantes"}.
                  </p>
                ) : null}
              </div>
            ) : null}

            {tab === "cuadro" ? (
              <div role="tabpanel" id="panel-cuadro" aria-labelledby="tab-cuadro">
                <h2 className="mb-5 text-xl font-bold tracking-[-0.01em]">Cuadro del torneo</h2>
                <BracketView tournament={tournament} />
              </div>
            ) : null}

            {tab === "calendario" ? (
              <div role="tabpanel" id="panel-calendario" aria-labelledby="tab-calendario">
                <h2 className="mb-5 text-xl font-bold tracking-[-0.01em]">Partidos</h2>
                {tournament.matches.length > 0 ? (
                  <ul className="border-t border-line">
                    {tournament.matches.map((match) => (
                      <li key={match.id} className="grid gap-3 border-b border-line py-4 sm:grid-cols-[7rem_1fr_auto] sm:items-center">
                        <div>
                          <p className="text-2xs font-bold uppercase tracking-[0.1em] text-muted-foreground">{match.stage}</p>
                          <p className="mt-0.5 text-xs tabular">{formatDateTime(match.startsAt)}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <span className="flex-1 text-right">{match.team1}</span>
                          <span className="rounded bg-elevated px-2 py-1 text-xs tabular">
                            {match.score1 ?? "-"} : {match.score2 ?? "-"}
                          </span>
                          <span className="flex-1">{match.team2}</span>
                        </div>
                        <Badge
                          variant={
                            match.status === "en-vivo"
                              ? "live"
                              : match.status === "finalizado"
                                ? "outline"
                                : "soft"
                          }
                          dot={match.status === "en-vivo"}
                          className="justify-self-start sm:justify-self-end"
                        >
                          {match.status === "en-vivo"
                            ? "En juego"
                            : match.status === "finalizado"
                              ? "Finalizado"
                              : "Programado"}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="border border-dashed border-line px-6 py-12 text-center">
                    <p className="text-sm font-semibold">Todavía no hay partidos programados</p>
                    <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-muted-foreground">
                      La organización publica el calendario cuando cierra la inscripción.
                      Mientras tanto, el cuadro proyectado ya está disponible.
                    </p>
                    <Button variant="outline" size="sm" className="mt-4" onClick={() => setTab("cuadro")}>
                      Ver el cuadro
                    </Button>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="border border-foreground bg-surface">
            <div className="border-b border-line px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-2xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Inscripción</p>
                <StatusBadge status={tournament.status} />
              </div>
              <p className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tabular">{tournament.entrants.length}</span>
                <span className="text-sm text-muted-foreground">de {tournament.maxParticipants} cupos</span>
              </p>
              <Progress
                value={tournament.entrants.length}
                max={tournament.maxParticipants}
                className="mt-3"
                tone={tournament.status === "en-curso" ? "success" : "primary"}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                {registrationOpen
                  ? `${left} ${left === 1 ? "cupo disponible" : "cupos disponibles"}`
                  : tournament.status === "en-curso"
                    ? "Inscripción cerrada: el torneo ya comenzó"
                    : tournament.status === "finalizado"
                      ? "Torneo finalizado"
                      : "Cupo completo"}
              </p>
            </div>

            <div className="px-5 py-4">
              <div className="flex items-center justify-between gap-3 border-b border-line pb-3">
                <span className="flex items-center gap-1.5 text-xs font-semibold">
                  <AuraMark className="h-4 w-4 text-aura" />
                  {tournament.status === "finalizado" ? "Aura repartida" : "Aura en juego"}
                </span>
                <span className="text-sm font-extrabold tabular">{formatNumber(tournament.auraPrize)}</span>
              </div>
              <div className="flex items-center justify-between gap-3 py-3 text-xs">
                <span className="text-muted-foreground">Costo de inscripción</span>
                <span className="font-bold">Gratis</span>
              </div>

              {registered ? (
                <div className="mt-1 border border-success/40 bg-success/10 p-3">
                  <p className="flex items-center gap-1.5 text-sm font-bold text-success">
                    <svg viewBox="0 0 14 14" className="h-4 w-4" fill="none" aria-hidden="true">
                      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
                      <path d="m4 7 2 2 4-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Ya estás inscrito
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {myRegistration?.name} · +40 Aura registrada.
                  </p>
                  {myRegistration?.team ? (
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      Integrantes: {myRegistration.team}
                    </p>
                  ) : null}
                  <Link href="/dashboard" className={cn(buttonStyles({ variant: "outline", size: "sm", className: "mt-3 w-full" }))}>
                    Ver en mi panel
                  </Link>
                </div>
              ) : registrationOpen ? (
                showForm ? (
                  <form onSubmit={submit} className="mt-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold">Completa la inscripción</p>
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="focus-ring rounded-sm text-xs font-semibold text-muted-foreground hover:text-foreground"
                      >
                        Cancelar
                      </button>
                    </div>
                    <Input
                      label="Equipo o jugador"
                      name="equipo"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Las Cadejas"
                      required
                      autoComplete="organization"
                    />
                    <Input
                      label="Correo de contacto"
                      name="correo"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="equipo@correo.com"
                      required
                      autoComplete="email"
                    />
                    <Input
                      label="Integrantes"
                      name="integrantes"
                      value={team}
                      onChange={(event) => setTeam(event.target.value)}
                      placeholder="Nombres separados por coma"
                      optional
                    />
                    {error ? (
                      <p className="text-xs font-medium text-danger" role="alert">
                        {error}
                      </p>
                    ) : null}
                    <Button type="submit" size="md" className="w-full">
                      Confirmar inscripción
                    </Button>
                    <p className="text-2xs leading-relaxed text-muted-foreground">
                      Se guarda en este navegador. No se envía ningún pago ni se pide
                      tarjeta.
                    </p>
                  </form>
                ) : (
                  <>
                    <Button size="md" className="mt-1 w-full" onClick={() => setShowForm(true)}>
                      Inscribirme
                      <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Button>
                    <p className="mt-2.5 text-center text-2xs leading-relaxed text-muted-foreground">
                      Cierra el {formatDate(tournament.registrationEndsAt)}.
                    </p>
                  </>
                )
              ) : (
                <div className="mt-1">
                  <Button size="md" className="w-full" disabled>
                    {tournament.status === "finalizado" ? "Torneo finalizado" : tournament.status === "en-curso" ? "Inscripción cerrada" : "Cupo completo"}
                  </Button>
                  <p className="mt-2.5 text-center text-2xs leading-relaxed text-muted-foreground">
                    {tournament.status === "finalizado" ? (
                      "Consulta los resultados en la pestaña de calendario."
                    ) : (
                      <>
                        Sigue el torneo desde esta página o{" "}
                        <Link
                          href="/explorar"
                          className="font-semibold text-foreground underline decoration-line underline-offset-2 hover:decoration-foreground"
                        >
                          explora otros abiertos
                        </Link>
                        .
                      </>
                    )}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-line bg-elevated/50 px-5 py-3 text-2xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
                  <path d="M7 12.5s4.5-3.4 4.5-7a4.5 4.5 0 1 0-9 0c0 3.6 4.5 7 4.5 7Z" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="7" cy="5.6" r="1.5" stroke="currentColor" strokeWidth="1.2" />
                </svg>
                {tournament.city}
              </span>
              <span className="tabular">{formatTime(tournament.startsAt)}</span>
            </div>
          </div>

          <p className="mt-4 px-1 text-2xs leading-relaxed text-muted-foreground">
            Inscripciones y Aura de demostración local. En un torneo real, la
            organización confirma cada cupo.
          </p>
        </aside>
      </div>

      {rounds.length > 0 ? (
        <div className="border-t border-line bg-surface">
          <div className="shell flex flex-wrap items-center justify-between gap-4 py-8">
            <div>
              <p className="text-sm font-bold">¿Listo para el siguiente?</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Explora otros torneos con cupo o publica el tuyo.</p>
            </div>
            <div className="flex gap-2">
              <Link href="/explorar" className={buttonStyles({ variant: "outline", size: "sm" })}>
                Explorar
              </Link>
              <Link href="/crear" className={buttonStyles({ size: "sm" })}>
                Crear torneo
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
