import type { Metadata } from "next"
import Link from "next/link"
import { AuraMark } from "@/components/brand"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { PLAYERS } from "@/lib/data"
import { formatNumber } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Ranking Aura",
  description:
    "Consulta el ranking de la temporada 2026: Aura acumulada, partidos jugados y porcentaje de victoria de cada jugador.",
}

export default function RankingPage() {
  const ranked = [...PLAYERS].sort((a, b) => b.aura - a.aura)
  const leader = ranked[0]
  const max = leader.aura

  return (
    <div>
      <div className="border-b border-line bg-surface">
        <div className="shell py-10 lg:py-12">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h1 className="display text-4xl sm:text-5xl">Ranking Aura</h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                La tabla de la temporada 2026. El Aura se acumula por inscripciones,
                partidos jugados y podios. No se compra ni se transfiere.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="aura">
                <AuraMark className="h-3 w-3" />
                Temporada 2026
              </Badge>
              <Badge variant="outline">Actualizado al 21 de octubre</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="shell py-10">
        <section aria-labelledby="lider" className="grid gap-px overflow-hidden rounded-card border border-line bg-line lg:grid-cols-[1.1fr_0.9fr_0.9fr]">
          <div className="bg-foreground p-6 text-background lg:p-8">
            <p id="lider" className="text-2xs font-bold uppercase tracking-[0.14em] text-background/55">
              Lidera la temporada
            </p>
            <div className="mt-4 flex items-center gap-4">
              <Avatar name={leader.name} size="lg" className="ring-2 ring-accent ring-offset-2 ring-offset-foreground" />
              <div>
                <p className="text-2xl font-extrabold tracking-[-0.02em]">{leader.name}</p>
                <p className="mt-0.5 text-xs text-background/60">@{leader.handle} · {leader.team}</p>
              </div>
            </div>
            <p className="mt-6 flex items-center gap-2 text-3xl font-extrabold tabular text-accent">
              <AuraMark className="h-6 w-6" />
              {formatNumber(leader.aura)}
            </p>
            <p className="mt-1 text-2xs uppercase tracking-[0.12em] text-background/50">Aura acumulada</p>
          </div>

          <div className="bg-surface p-6 lg:p-8">
            <p className="text-2xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Rendimiento</p>
            <p className="mt-4 text-4xl font-extrabold tabular">
              {Math.round((leader.wins / leader.played) * 100)}%
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Victorias en {leader.played} partidos</p>
            <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-4">
              <div>
                <dt className="text-2xs text-muted-foreground">Ganados</dt>
                <dd className="mt-0.5 text-lg font-bold tabular">{leader.wins}</dd>
              </div>
              <div>
                <dt className="text-2xs text-muted-foreground">Jugados</dt>
                <dd className="mt-0.5 text-lg font-bold tabular">{leader.played}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-surface p-6 lg:p-8">
            <p className="text-2xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Cómo se suma</p>
            <ul className="mt-4 space-y-3 text-xs leading-relaxed text-muted-foreground">
              <li className="flex justify-between gap-3 border-b border-line pb-2.5">
                <span>Inscripción confirmada</span>
                <span className="font-bold tabular text-foreground">+40</span>
              </li>
              <li className="flex justify-between gap-3 border-b border-line pb-2.5">
                <span>Partido jugado</span>
                <span className="font-bold tabular text-foreground">+20</span>
              </li>
              <li className="flex justify-between gap-3 border-b border-line pb-2.5">
                <span>Partido ganado</span>
                <span className="font-bold tabular text-foreground">+60</span>
              </li>
              <li className="flex justify-between gap-3">
                <span>Podio de torneo</span>
                <span className="font-bold tabular text-foreground">Bono</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="tabla-title">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 id="tabla-title" className="text-xl font-bold tracking-[-0.01em]">
              Tabla completa
            </h2>
            <p className="text-xs text-muted-foreground">20 jugadores · datos de demostración</p>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-sm">
              <caption className="sr-only">
                Ranking de jugadores por Aura acumulada en la temporada 2026
              </caption>
              <thead>
                <tr className="border-y border-foreground text-left">
                  <th scope="col" className="w-14 px-2 py-2.5 text-2xs font-bold uppercase tracking-[0.1em]">Pos.</th>
                  <th scope="col" className="px-2 py-2.5 text-2xs font-bold uppercase tracking-[0.1em]">Jugador</th>
                  <th scope="col" className="px-2 py-2.5 text-2xs font-bold uppercase tracking-[0.1em]">Equipo</th>
                  <th scope="col" className="px-2 py-2.5 text-right text-2xs font-bold uppercase tracking-[0.1em]">PJ</th>
                  <th scope="col" className="px-2 py-2.5 text-right text-2xs font-bold uppercase tracking-[0.1em]">PG</th>
                  <th scope="col" className="px-2 py-2.5 text-right text-2xs font-bold uppercase tracking-[0.1em]">%</th>
                  <th scope="col" className="w-1/4 px-2 py-2.5 text-right text-2xs font-bold uppercase tracking-[0.1em]">Aura</th>
                </tr>
              </thead>
              <tbody>
                {ranked.map((player, index) => (
                  <tr key={player.id} className="border-b border-line transition-colors hover:bg-muted/40">
                    <td className="px-2 py-3">
                      <span
                        className={
                          index < 3
                            ? "inline-flex h-6 w-6 items-center justify-center rounded bg-foreground text-2xs font-bold tabular text-background"
                            : "inline-flex h-6 w-6 items-center justify-center text-2xs font-bold tabular text-muted-foreground"
                        }
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={player.name} size="sm" />
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{player.name}</p>
                          <p className="truncate text-2xs text-muted-foreground">@{player.handle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-xs text-muted-foreground">{player.team}</td>
                    <td className="px-2 py-3 text-right tabular text-xs">{player.played}</td>
                    <td className="px-2 py-3 text-right tabular text-xs">{player.wins}</td>
                    <td className="px-2 py-3 text-right tabular text-xs">{Math.round((player.wins / player.played) * 100)}</td>
                    <td className="px-2 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <span className="hidden h-1.5 w-full max-w-24 overflow-hidden rounded-full bg-muted sm:block">
                          <span className="block h-full rounded-full bg-aura" style={{ width: `${Math.round((player.aura / max) * 100)}%` }} />
                        </span>
                        <span className="min-w-14 text-right font-bold tabular">{formatNumber(player.aura)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
            <p className="max-w-lg text-2xs leading-relaxed text-muted-foreground">
              El ranking se calcula con las transacciones de Aura registradas. Las
              cuentas de demostración viven en este navegador y no afectan la tabla.
            </p>
            <Link href="/equipos" className="focus-ring inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold underline decoration-line underline-offset-4 hover:decoration-foreground">
              Ver equipos
              <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
