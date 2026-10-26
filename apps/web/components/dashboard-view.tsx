"use client"

import * as React from "react"
import Link from "next/link"
import { AuraMark, CategoryIcon } from "@/components/brand"
import { StatusBadge } from "@/components/status-badge"
import { TournamentCover } from "@/components/tournament-cover"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button, buttonStyles } from "@/components/ui/button"
import { useTornuti } from "@/components/providers/tornuti-provider"
import { TOURNAMENTS, TEAMS } from "@/lib/data"
import { formatDate, formatDay } from "@/lib/format"
import { CATEGORY_LABEL } from "@/lib/tournament"
import { cn, formatNumber } from "@/lib/utils"

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="border-t border-line pt-3">
      <p className="text-2xs font-bold uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-extrabold tabular tracking-[-0.02em]">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
    </div>
  )
}

export function DashboardView() {
  const { ready, session, registrations, created, joinedTeams, logout } = useTornuti()

  if (!ready) {
    return (
      <div className="shell py-20">
        <div className="h-10 w-64 animate-pulse rounded bg-muted" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-24 animate-pulse rounded border border-line bg-muted/50" />
          ))}
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="shell py-20">
        <div className="mx-auto max-w-lg border border-foreground bg-surface p-8 text-center">
          <svg viewBox="0 0 48 48" className="mx-auto h-14 w-14 text-muted-foreground" fill="none" aria-hidden="true">
            <rect x="9" y="21" width="30" height="20" rx="2" stroke="currentColor" strokeWidth="1.6" />
            <path d="M16 21v-6a8 8 0 0 1 16 0v6" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="24" cy="31" r="2.5" fill="currentColor" />
          </svg>
          <h1 className="display mt-5 text-3xl">Tu panel te espera</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Entra para ver tus inscripciones, tus torneos publicados y el historial de
            Aura. En modo demostración no se envía ningún dato a un servidor.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
            <Link href="/login" className={buttonStyles({ size: "md" })}>
              Entrar
            </Link>
            <Link href="/registro" className={buttonStyles({ variant: "outline", size: "md" })}>
              Crear cuenta
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const all = [...created, ...TOURNAMENTS]
  const myTournaments = registrations
    .map((registration) => ({
      registration,
      tournament: all.find((item) => item.slug === registration.tournamentSlug),
    }))
    .filter((entry) => entry.tournament)
    .sort((a, b) => new Date(a.registration.createdAt).getTime() - new Date(b.registration.createdAt).getTime())

  const next = myTournaments.find(({ tournament }) => new Date(tournament!.startsAt) > new Date())
  const joined = TEAMS.filter((team) => joinedTeams.includes(team.slug))

  const ledger = [
    { id: "base", label: "Aura inicial de demostración", amount: 1240, date: "2026-10-01T12:00:00Z" },
    ...registrations.map((registration) => ({
      id: registration.id,
      label: `Inscripción a ${registration.tournamentName}`,
      amount: 40,
      date: registration.createdAt,
    })),
    ...joinedTeams.map((slug) => ({
      id: `team-${slug}`,
      label: `Membresía de ${TEAMS.find((team) => team.slug === slug)?.name ?? "equipo"}`,
      amount: 15,
      date: "2026-10-10T12:00:00Z",
    })),
    ...created.map((tournament) => ({
      id: `created-${tournament.id}`,
      label: `Torneo publicado: ${tournament.name}`,
      amount: 120,
      date: "2026-10-15T12:00:00Z",
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8)

  return (
    <div>
      <div className="border-b border-line bg-surface">
        <div className="shell py-8 lg:py-10">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="flex items-center gap-4">
              <Avatar name={session.name} size="lg" />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="display text-3xl leading-none sm:text-4xl">Hola, {session.name.split(" ")[0]}</h1>
                  <Badge variant="outline">
                    {session.role === "player"
                      ? "Jugador"
                      : session.role === "organizer"
                        ? "Organizador"
                        : "Administración"}
                  </Badge>
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  @{session.handle} · {session.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 items-center gap-1.5 border border-line px-3 text-xs font-bold tabular">
                <AuraMark className="h-4 w-4 text-aura" />
                {formatNumber(session.aura)} Aura
              </span>
              <Button variant="outline" size="sm" asChild>
                <Link href="/perfil">Editar ficha</Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={logout}>
                Cerrar sesión
              </Button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-4">
            <Stat label="Inscripciones" value={String(registrations.length)} hint="Torneos en tu historial" />
            <Stat label="Publicados" value={String(created.length)} hint="Torneos que organizas" />
            <Stat label="Equipos" value={String(joinedTeams.length)} hint="Plantillas a las que perteneces" />
            <Stat label="Aura" value={formatNumber(session.aura)} hint="Acumulada en esta cuenta" />
          </div>
        </div>
      </div>

      <div className="shell grid gap-10 py-10 lg:grid-cols-[1.35fr_0.65fr] lg:gap-14">
        <div className="min-w-0">
          <section aria-labelledby="proximo-title">
            <h2 id="proximo-title" className="text-xl font-bold tracking-[-0.01em]">Próximo torneo</h2>
            {next ? (
              <div className="mt-4 overflow-hidden border border-foreground">
                <TournamentCover
                  pattern={next.tournament!.cover}
                  category={next.tournament!.category}
                  photo={next.tournament!.cover_url}
                  sizes="640px"
                  className="h-24"
                  label={next.tournament!.sport}
                />
                <div className="flex flex-wrap items-end justify-between gap-4 p-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={next.tournament!.status} />
                      <span className="inline-flex items-center gap-1.5 text-2xs font-bold uppercase tracking-[0.1em] text-muted-foreground">
                        <CategoryIcon category={next.tournament!.category} className="h-3.5 w-3.5" />
                        {CATEGORY_LABEL[next.tournament!.category]}
                      </span>
                    </div>
                    <h3 className="mt-2 text-xl font-bold">{next.tournament!.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatDate(next.tournament!.startsAt)} · {next.tournament!.location}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Inscripción: <span className="font-semibold text-foreground">{next.registration.name}</span>
                    </p>
                  </div>
                  <Link href={`/torneos/${next.tournament!.slug}`} className={buttonStyles({ size: "sm" })}>
                    Abrir ficha
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-4 border border-dashed border-line bg-surface p-6">
                <p className="text-sm font-semibold">No tienes torneos próximos</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Explora los torneos con cupo o publica el tuyo. Las inscripciones de
                  demostración se guardan solo en este navegador.
                </p>
                <div className="mt-4 flex gap-2">
                  <Link href="/explorar" className={buttonStyles({ variant: "outline", size: "sm" })}>
                    Explorar torneos
                  </Link>
                  <Link href="/crear" className={buttonStyles({ size: "sm" })}>
                    Crear torneo
                  </Link>
                </div>
              </div>
            )}
          </section>

          <section className="mt-10" aria-labelledby="inscripciones-title">
            <div className="flex items-end justify-between gap-3">
              <h2 id="inscripciones-title" className="text-xl font-bold tracking-[-0.01em]">Mis inscripciones</h2>
              <span className="text-xs tabular text-muted-foreground">{registrations.length} registros</span>
            </div>
            {myTournaments.length > 0 ? (
              <ul className="mt-4 border-t border-line">
                {myTournaments.map(({ registration, tournament }) => (
                  <li key={registration.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-line py-3.5">
                    <div className="min-w-0">
                      <Link href={`/torneos/${tournament!.slug}`} className="focus-ring rounded-sm text-sm font-semibold hover:underline">
                        {tournament!.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {registration.name} · {formatDay(tournament!.startsAt)} · {tournament!.city}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={tournament!.status} />
                      <span className="text-xs font-bold tabular text-aura">+40 Aura</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 border border-dashed border-line px-4 py-6 text-sm text-muted-foreground">
                Todavía no hay inscripciones. Cuando te anotes en un torneo aparecerá aquí.
              </p>
            )}
          </section>

          <section className="mt-10" aria-labelledby="mios-title">
            <div className="flex items-end justify-between gap-3">
              <h2 id="mios-title" className="text-xl font-bold tracking-[-0.01em]">Torneos que organizo</h2>
              <Link href="/crear" className="focus-ring rounded-sm text-xs font-semibold underline decoration-line underline-offset-4 hover:decoration-foreground">
                Publicar otro
              </Link>
            </div>
            {created.length > 0 ? (
              <ul className="mt-4 grid gap-px overflow-hidden rounded border border-line bg-line sm:grid-cols-2">
                {created.map((tournament) => (
                  <li key={tournament.id} className="bg-surface p-4">
                    <div className="flex items-center justify-between gap-2">
                      <StatusBadge status={tournament.status} />
                      <span className="text-2xs tabular text-muted-foreground">
                        {tournament.entrants.length}/{tournament.maxParticipants}
                      </span>
                    </div>
                    <Link href={`/torneos/${tournament.slug}`} className="focus-ring mt-2 block rounded-sm text-sm font-bold hover:underline">
                      {tournament.name}
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDate(tournament.startsAt)} · {tournament.location}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 border border-dashed border-line px-4 py-6 text-sm text-muted-foreground">
                Aún no has publicado un torneo. La ficha se llena en una pantalla y
                queda lista para compartir.
              </p>
            )}
          </section>

          <section className="mt-10" aria-labelledby="equipos-title">
            <h2 id="equipos-title" className="text-xl font-bold tracking-[-0.01em]">Mis equipos</h2>
            {joined.length > 0 ? (
              <ul className="mt-4 border-t border-line">
                {joined.map((team) => (
                  <li key={team.id} className="flex items-center justify-between gap-3 border-b border-line py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={team.name} size="sm" />
                      <div>
                        <p className="text-sm font-semibold">{team.name}</p>
                        <p className="text-xs text-muted-foreground">{team.motto}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold tabular text-aura">{formatNumber(team.aura)} Aura</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 border border-dashed border-line px-4 py-6 text-sm text-muted-foreground">
                No perteneces a ningún equipo todavía.{" "}
                <Link href="/equipos" className="font-semibold text-foreground underline underline-offset-4">
                  Ver equipos
                </Link>
                .
              </p>
            )}
          </section>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="border border-foreground bg-surface">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <p className="text-2xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Historial de Aura</p>
              <AuraMark className="h-4 w-4 text-aura" />
            </div>
            <ul>
              {ledger.map((entry) => (
                <li key={entry.id} className="flex items-start justify-between gap-3 border-b border-line px-4 py-3 last:border-b-0">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold leading-snug">{entry.label}</p>
                    <p className="mt-0.5 text-2xs text-muted-foreground">{formatDate(entry.date)}</p>
                  </div>
                  <span className="shrink-0 text-xs font-bold tabular text-aura">+{entry.amount}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between gap-2 border-t border-line bg-elevated/60 px-4 py-3">
              <span className="text-2xs font-semibold text-muted-foreground">Total</span>
              <span className="text-sm font-extrabold tabular">{formatNumber(session.aura)} Aura</span>
            </div>
          </div>
          <p className="mt-4 px-1 text-2xs leading-relaxed text-muted-foreground">
            El historial es local y de demostración. En producción, cada transacción
            queda registrada por la API.
          </p>

          <div className="mt-6 border-t border-line pt-5">
            <p className="text-xs font-bold">Sesión</p>
            <p className="mt-1 text-2xs leading-relaxed text-muted-foreground">
              {session.email}
              <br />
              Cuenta de demostración guardada en este navegador.
            </p>
            <button
              type="button"
              onClick={logout}
              className="focus-ring mt-3 inline-flex items-center gap-1.5 rounded-sm text-xs font-semibold text-danger hover:underline"
            >
              <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
                <path d="M5 2H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2M9 4l3 3-3 3M12 7H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Cerrar sesión
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
