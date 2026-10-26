import Link from "next/link"
import { AuraMark, CategoryIcon } from "@/components/brand"
import { StatusBadge } from "@/components/status-badge"
import { TournamentCover } from "@/components/tournament-cover"
import { Progress } from "@/components/ui/progress"
import { formatDay, formatTime, splitDay } from "@/lib/format"
import { CATEGORY_LABEL, spotsLeft } from "@/lib/tournament"
import type { Tournament } from "@/lib/types"
import { formatNumber } from "@/lib/utils"

export function TournamentCard({ tournament }: { tournament: Tournament }) {
  const left = spotsLeft(tournament)
  const registrationOpen =
    tournament.status === "abierto" || tournament.status === "ultimos-cupos"
  return (
    <Link
      href={`/torneos/${tournament.slug}`}
      className="glass-card focus-ring group flex h-full flex-col overflow-hidden"
    >
      <div className="relative">
        <TournamentCover
          pattern={tournament.cover}
          category={tournament.category}
          photo={tournament.cover_url}
          sizes="(min-width: 768px) 33vw, 100vw"
          className="aspect-[16/9] w-full"
          label={tournament.sport}
        />
        <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-2">
          <StatusBadge status={tournament.status} />
          <span className="inline-flex items-center gap-1 rounded bg-background px-2 py-1 text-2xs font-bold tabular text-foreground">
            <AuraMark className="h-3 w-3 text-aura" />
            {formatNumber(tournament.auraPrize)}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="flex items-center gap-1.5 text-2xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          <CategoryIcon category={tournament.category} className="h-3.5 w-3.5" />
          {CATEGORY_LABEL[tournament.category]}
        </p>
        <h3 className="mt-2 text-[1.0625rem] font-bold leading-snug tracking-[-0.01em]">
          {tournament.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {tournament.summary}
        </p>

        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
                <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                <path d="M2 6.5h12M5.5 2v3M10.5 2v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              {formatDay(tournament.startsAt)} · {formatTime(tournament.startsAt)}
            </span>
            <span className="truncate">{tournament.city}</span>
          </div>

          <div className="mt-3">
            <div className="mb-1.5 flex items-center justify-between text-2xs font-medium">
              <span className="text-muted-foreground">
                {registrationOpen
                  ? `${tournament.entrants.length} de ${tournament.maxParticipants} cupos`
                  : tournament.status === "en-curso"
                    ? "Torneo en juego"
                    : "Torneo finalizado"}
              </span>
              <span
                className={
                  registrationOpen
                    ? left === 0
                      ? "text-danger"
                      : left <= 3
                        ? "text-aura"
                        : "text-muted-foreground"
                    : "text-muted-foreground"
                }
              >
                {registrationOpen
                  ? left === 0
                    ? "Completo"
                    : `${left} libres`
                  : tournament.status === "en-curso"
                    ? "En curso"
                    : "Acta cerrada"}
              </span>
            </div>
            <Progress
              value={tournament.entrants.length}
              max={tournament.maxParticipants}
              tone={tournament.status === "en-curso" ? "success" : "primary"}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}

export function TournamentRow({ tournament }: { tournament: Tournament }) {
  const { day, month } = splitDay(tournament.startsAt)
  const left = spotsLeft(tournament)
  const registrationOpen =
    tournament.status === "abierto" || tournament.status === "ultimos-cupos"

  return (
    <Link
      href={`/torneos/${tournament.slug}`}
      className="focus-ring group grid grid-cols-[3.5rem_1fr] items-start gap-4 border-t border-line py-5 transition-colors hover:bg-muted/40 sm:grid-cols-[4.5rem_1fr_10rem_2.5rem] sm:items-center sm:gap-6 sm:px-3"
    >
      <div className="flex flex-col items-center justify-center rounded border border-line bg-surface py-2">
        <span className="text-xl font-extrabold leading-none tracking-tight tabular">{day}</span>
        <span className="mt-1 text-2xs font-bold uppercase tracking-[0.12em] text-muted-foreground">{month}</span>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={tournament.status} />
          <span className="text-2xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            {CATEGORY_LABEL[tournament.category]} · {tournament.sport}
          </span>
        </div>
        <h3 className="mt-1.5 text-base font-bold leading-snug tracking-[-0.01em] group-hover:text-primary sm:text-lg">
          {tournament.name}
        </h3>
        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{tournament.summary}</p>
        <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>{formatTime(tournament.startsAt)}</span>
          <span>{tournament.location}</span>
          <span className="inline-flex items-center gap-1 font-semibold text-aura">
            <AuraMark className="h-3 w-3" />
            {formatNumber(tournament.auraPrize)} Aura
          </span>
        </p>
      </div>

      <div className="col-span-2 sm:col-span-1">
        <div className="flex items-center justify-between text-2xs font-medium sm:justify-end sm:gap-2">
          <span className="text-muted-foreground sm:hidden">
            {registrationOpen ? "Cupos" : "Estado"}
          </span>
          <span
            className={
              registrationOpen
                ? left === 0
                  ? "text-danger"
                  : left <= 3
                    ? "text-aura"
                    : "text-foreground"
                : "text-muted-foreground"
            }
          >
            {registrationOpen
              ? left === 0
                ? "Completo"
                : `${left} de ${tournament.maxParticipants} libres`
              : tournament.status === "en-curso"
                ? "En curso"
                : "Finalizado"}
          </span>
        </div>
        <Progress
          value={tournament.entrants.length}
          max={tournament.maxParticipants}
          className="mt-2"
          tone={tournament.status === "en-curso" ? "success" : "primary"}
        />
      </div>

      <span
        className="hidden h-10 w-10 items-center justify-center rounded-full border border-line text-foreground transition-colors group-hover:border-foreground group-hover:bg-foreground group-hover:text-background sm:inline-flex"
        aria-hidden="true"
      >
        <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none">
          <path d="M3 13 13 3M6 3h7v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </Link>
  )
}
