import Link from "next/link"
import { AuraMark, CategoryIcon } from "@/components/brand"
import { ControlDesk } from "@/components/control-desk"
import { TournamentRow } from "@/components/tournament-card"
import { buttonStyles } from "@/components/ui/button"
import { AURA_FEED, CATEGORIES, PLAYERS, TOURNAMENTS } from "@/lib/data"
import { formatDay } from "@/lib/format"
import { sortedByDate } from "@/lib/tournament"
import { TONE_CLASS } from "@/lib/tone"
import { formatNumber } from "@/lib/utils"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tornuti — torneos de cualquier cosa, con la cuenta clara",
  description:
    "Publica torneos de deportes, gaming, cultura o comunidad y lleva inscripciones, cuadros, resultados y Aura en un solo lugar. Gratis.",
}

const steps = [
  {
    number: "01",
    title: "Publica la ficha",
    copy:
      "Nombre, formato, fecha, sede y cupos. Tornuti arma la página del torneo y el formulario de inscripción con esos datos.",
  },
  {
    number: "02",
    title: "Abre la inscripción",
    copy:
      "Comparte un enlace. Los equipos se inscriben, la lista se ordena sola y el cupo se cierra cuando llega al límite.",
  },
  {
    number: "03",
    title: "Juega y anota",
    copy:
      "Genera el cuadro, programa los partidos y registra resultados. Cada resultado deja Aura en el historial de quienes jugaron.",
  },
]

export default function HomePage() {
  const upcoming = sortedByDate(
    TOURNAMENTS.filter(
      (tournament) =>
        tournament.status === "abierto" || tournament.status === "ultimos-cupos",
    ),
  ).slice(0, 4)

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute inset-0 grid-lines opacity-[0.35]" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-24 top-10 hidden h-72 w-72 rounded-full border border-line lg:block" aria-hidden="true" />
        <div className="shell relative grid items-start gap-12 py-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16 lg:py-20">
          <div className="max-w-2xl">
            <h1 className="display text-[3.25rem] leading-[0.92] sm:text-7xl lg:text-[5.4rem]">
              El torneo
              <br />
              empieza{" "}
              <span className="relative inline-block">
                <span className="absolute inset-x-0 bottom-1 -z-10 h-[0.28em] bg-accent" aria-hidden="true" />
                antes
              </span>
              <br />
              del pitazo.
            </h1>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Tornuti reúne inscripciones, cuadros, horarios, resultados y Aura en una
              sola página. Para cualquier deporte, cualquier comunidad y cualquier
              sábado que se quiera jugar en serio.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/crear" className={buttonStyles({ size: "lg" })}>
                Crear un torneo
                <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link href="/explorar" className={buttonStyles({ variant: "outline", size: "lg" })}>
                Ver torneos abiertos
              </Link>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2.5">
              {["Gratis para organizar", "Cuadros automáticos", "Aura para cada jugador"].map((item) => (
                <li key={item} className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 text-success" fill="none" aria-hidden="true">
                    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
                    <path d="m4 7 2 2 4-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full max-w-md justify-self-end lg:mt-2">
            <ControlDesk />
            <p className="mt-7 flex items-center justify-between gap-4 text-2xs leading-relaxed text-muted-foreground">
              <span>Datos de demostración. La mesa real se llena con tu torneo.</span>
              <Link href="/torneos/copa-cadejos-3x3" className="focus-ring shrink-0 rounded-sm font-semibold text-foreground underline underline-offset-4">
                Abrir ficha
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="shell py-14 lg:py-16" aria-labelledby="agenda-title">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="agenda-title" className="display text-3xl sm:text-4xl">
              Con cupo esta semana
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Cuatro torneos que todavía reciben inscripciones. La fecha y la hora ya
              están fijadas; el resto se resuelve en la cancha.
            </p>
          </div>
          <Link
            href="/explorar"
            className="focus-ring inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold underline decoration-line underline-offset-4 hover:decoration-foreground"
          >
            Ver todos los torneos
            <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
              <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <div className="border-b border-line">
          {upcoming.map((tournament) => (
            <TournamentRow key={tournament.id} tournament={tournament} />
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-foreground text-background" aria-labelledby="aura-title">
        <div className="shell grid gap-12 py-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded border border-background/25 px-2.5 py-1 text-2xs font-bold uppercase tracking-[0.14em] text-accent">
              <AuraMark className="h-3.5 w-3.5" />
              Sistema Aura
            </div>
            <h2 id="aura-title" className="display mt-6 text-4xl leading-[1.02] sm:text-5xl">
              Competir deja rastro.
              <br />
              Nosotros lo anotamos.
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-background/70">
              Aura no es una moneda ni una promesa de premios. Es la memoria de lo que
              has jugado: cada inscripción, cada partido y cada podio suma. Sirve para
              ordenar el ranking, comparar temporadas y saber quién estuvo ahí.
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-background/20 pt-6">
              <div>
                <dt className="text-2xs font-bold uppercase tracking-[0.12em] text-background/55">Por inscribirte</dt>
                <dd className="mt-1 text-lg font-bold text-accent">+40 Aura</dd>
              </div>
              <div>
                <dt className="text-2xs font-bold uppercase tracking-[0.12em] text-background/55">Por ganar un torneo</dt>
                <dd className="mt-1 text-lg font-bold text-accent">Bono completo</dd>
              </div>
            </dl>
            <Link
              href="/ranking"
              className="focus-ring mt-8 inline-flex items-center gap-2 rounded-sm text-sm font-semibold text-background underline decoration-background/40 underline-offset-4 hover:decoration-background"
            >
              Ver el ranking de la temporada
              <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          <div className="border border-background/20">
            <div className="flex items-center justify-between gap-4 border-b border-background/20 px-4 py-3">
              <p className="text-2xs font-bold uppercase tracking-[0.14em] text-background/60">Últimos movimientos</p>
              <p className="text-2xs font-semibold text-accent">Demostración</p>
            </div>
            <ul>
              {AURA_FEED.slice(0, 6).map((entry) => {
                const player = PLAYERS.find((candidate) => candidate.id === entry.playerId)
                if (!player) return null
                return (
                  <li
                    key={entry.id}
                    className="flex items-center justify-between gap-4 border-b border-background/10 px-4 py-3.5 last:border-b-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{player.name}</p>
                      <p className="truncate text-xs text-background/55">{entry.reason}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-extrabold tabular text-accent">+{entry.amount}</p>
                      <p className="text-2xs text-background/45">{formatDay(entry.date)}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </section>

      <section className="shell py-16 lg:py-20" aria-labelledby="como-title">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="como-title" className="display text-3xl sm:text-4xl">
            De la idea al marcador
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            Sin hojas de cálculo ni cadenas de mensajes. Tres pasos y el torneo ya
            tiene una dirección para compartir.
          </p>
        </div>

        <div className="mt-10 grid gap-8 border-t border-line pt-8 md:grid-cols-3 md:gap-10">
          {steps.map((step) => (
            <div key={step.number}>
              <p className="display text-4xl text-muted-foreground/45">{step.number}</p>
              <h3 className="mt-4 text-lg font-bold tracking-[-0.01em]">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-surface" aria-labelledby="categorias-title">
        <div className="shell py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="categorias-title" className="display text-3xl sm:text-4xl">
              Un formato para cada cosa
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              La comunidad decide qué se juega. Si cabe en una cancha, una mesa o una
              pantalla, cabe en Tornuti.
            </p>
          </div>

          <div className="mt-8 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                href={`/explorar?categoria=${category.id}`}
                className={`focus-ring group flex flex-col bg-surface p-5 transition-colors hover:bg-muted/60 ${
                  TONE_CLASS[category.id]
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-tone">
                    <CategoryIcon category={category.id} className="h-6 w-6" />
                  </span>
                  <span className="text-2xs font-bold tabular text-muted-foreground">{category.count} torneos</span>
                </div>
                <h3 className="mt-5 text-base font-bold">{category.label}</h3>
                <p className="mt-1.5 flex-1 text-xs leading-relaxed text-muted-foreground">{category.blurb}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-2xs font-bold uppercase tracking-[0.1em] text-foreground">
                  Explorar
                  <svg viewBox="0 0 12 12" className="h-3 w-3 transition-transform group-hover:translate-x-0.5" fill="none" aria-hidden="true">
                    <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-accent text-accent-foreground">
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 paper-dots opacity-40" aria-hidden="true" />
          <div className="shell relative flex flex-col items-start justify-between gap-8 py-14 sm:flex-row sm:items-center lg:py-16">
            <div className="max-w-2xl">
              <h2 className="display text-4xl leading-[0.96] sm:text-5xl">
                Tu próximo torneo no necesita una planilla.
              </h2>
              <p className="mt-4 max-w-xl text-sm font-medium leading-relaxed text-accent-foreground/80">
                Publica la ficha, comparte el enlace y deja que Tornuti lleve la
                cuenta. Si organizas, no pagas. Si juegas, tampoco.
              </p>
            </div>
            <Link
              href="/crear"
              className={`${buttonStyles({ variant: "secondary", size: "lg" })} shrink-0 border border-accent-foreground`}
            >
              Publicar mi torneo
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
