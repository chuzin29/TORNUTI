import Link from "next/link"
import { AuraMark, CategoryIcon } from "@/components/brand"
import { ControlDesk } from "@/components/control-desk"
import { Reveal, Parallax } from "@/components/motion"
import { TournamentCard } from "@/components/tournament-card"
import StretchyButton from "@/components/StretchyButton"
import { CATEGORIES, PLAYERS, TEAMS, TOURNAMENTS } from "@/lib/data"
import { sortedByDate } from "@/lib/tournament"
import { formatNumber, initials } from "@/lib/utils"

/* ────────────────────────────────────────────────────────────────────────────
   Portada. Impreso deportivo: papel cálido, tinta, reglas finas y una sola
   idea por bloque. Todo con los tokens del sistema; ninguna clase decorativa
   fuera de ellos. Las animaciones decorativas solo corren sin reduce-motion.
   ──────────────────────────────────────────────────────────────────────── */

const MARQUEE_ITEMS = [
  "Básquet 3x3",
  "Valorant",
  "Ajedrez",
  "Fútbol",
  "Dominó",
  "Vóleibol playa",
  "Carreras de relevos",
  "Debate",
  "Cartas TCG",
  "Tu disciplina",
]

const FEATURED_RANK = PLAYERS.slice(0, 4)

const openTournaments = sortedByDate(TOURNAMENTS).filter(
  (t) => t.status === "abierto" || t.status === "ultimos-cupos",
)

const agenda = openTournaments.slice(0, 3)

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="shell relative grid items-center gap-12 py-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:py-24">
        <div>
          <Reveal>
            <p className="eyebrow flex items-center gap-2">
              <span className="relative flex h-2 w-2 motion-safe:animate-pulse rounded-full bg-aura" aria-hidden="true" />
              Temporada 2026 · Inscripción abierta
            </p>

            <h1 className="display mt-5 text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">
              El torneo empieza
              <br />
              mucho antes
              <br />
              del pitazo.
            </h1>
          </Reveal>

          <Reveal delay={90}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Publica la ficha, inscribe a tu comunidad y deja que el cuadro se arme solo.
              Cada victoria suma <span className="font-bold text-foreground">Aura</span> para la temporada.
              Sin planes de pago y sin comisiones, del barrio a la oficina.
            </p>
          </Reveal>

          <Reveal delay={170}>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <StretchyButton href="/crear" label="Publica tu torneo gratis" size="lg" radius={160} />
              <StretchyButton href="/explorar" label="Ver la agenda" variant="outline" size="lg" radius={140} />
            </div>
          </Reveal>

          <Reveal delay={240}>
            <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-2xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              <span>Gratis para organizar</span>
              <span className="h-px w-5 bg-line" aria-hidden="true" />
              <span>Ninguna comisión</span>
              <span className="h-px w-5 bg-line" aria-hidden="true" />
              <span>Demostración en tu navegador</span>
            </p>
          </Reveal>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="grid-lines pointer-events-none absolute -inset-6 -z-10 opacity-40" aria-hidden="true" />
          <Reveal delay={140} from="right">
            <Parallax strength={0.05}>
              <div className="motion-safe:animate-fade-up relative -rotate-1 transition-transform duration-500 hover:rotate-0">
                <ControlDesk />
                <div className="absolute -right-5 -top-6 hidden rotate-3 border border-line bg-aura px-3 py-1.5 shadow-lift sm:flex sm:items-center sm:gap-1.5">
                  <AuraMark className="h-3.5 w-3.5 text-aura-foreground" />
                  <span className="text-2xs font-bold uppercase tracking-[0.12em] text-aura-foreground">
                    2,400 Aura en juego
                  </span>
                </div>
              </div>
            </Parallax>
          </Reveal>

          <dl className="glass-card mt-10 grid grid-cols-3 divide-x divide-line py-5 text-center lg:mt-12">
            {[
              { label: "Torneos en agenda", value: TOURNAMENTS.length },
              { label: "Equipos activos", value: TEAMS.length },
              { label: "Jugadores con Aura", value: PLAYERS.length },
            ].map((stat) => (
              <div key={stat.label} className="px-2">
                <dt className="text-2xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                  {stat.label}
                </dt>
                <dd className="display mt-1.5 text-2xl tabular lg:text-3xl">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

function Marquee() {
  const row = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]
  return (
    <div className="relative overflow-hidden border-b border-line bg-surface" aria-hidden="true">
      <div className="flex w-max motion-safe:animate-marquee">
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex shrink-0 items-center gap-6 whitespace-nowrap px-6 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground"
          >
            {item}
            <AuraMark className="h-3 w-3 text-aura" />
          </span>
        ))}
      </div>
    </div>
  )
}

function Agenda() {
  return (
    <section className="shell py-16 lg:py-24">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Agenda próxima</p>
            <h2 className="display mt-2 text-3xl sm:text-4xl">Lo que ya tiene fecha.</h2>
          </div>
          <Link
            href="/explorar"
            className="focus-ring inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            Explorar todos los torneos
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
              <path d="M3 13 13 3M6 3h7v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </Reveal>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {agenda.map((tournament, i) => (
          <Reveal key={tournament.slug} delay={(i % 3) * 80} className="h-full">
            <TournamentCard tournament={tournament} />
          </Reveal>
        ))}
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        {openTournaments.length} torneos con inscripción abierta en la agenda de la temporada.
        Contenido de demostración.
      </p>
    </section>
  )
}

const STEPS = [
  {
    n: "01",
    title: "Publica la ficha",
    body: "Nombre, disciplina, cupo, fecha y reglas claras. La vista previa muestra el impreso antes de confirmar.",
  },
  {
    n: "02",
    title: "Inscribe a tu gente",
    body: "Cada registro ocupa una plaza visible. Al llenarse el cupo, la inscripción se cierra sola.",
  },
  {
    n: "03",
    title: "Deja que el cuadro corra",
    body: "Siembra estándar, byes repartidos y el ganador avanza automáticamente cuando reportan el resultado.",
  },
]

function HowItWorks() {
  return (
    <section className="border-y border-line bg-surface">
      <div className="shell py-16 lg:py-24">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Cómo funciona</p>
              <h2 className="display mt-2 text-3xl sm:text-4xl">Tres pasos y un acta limpia.</h2>
            </div>
          </div>
        </Reveal>

        <ol className="mt-10 grid gap-5 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal key={step.n} as="li" delay={i * 90} className="glass-card h-full p-7 lg:p-8">
              <div className="flex items-baseline justify-between">
                <span className="display text-3xl tabular text-primary">{step.n}</span>
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-line" fill="none" aria-hidden="true">
                  <path d="M4 4h4v4H4V4Zm6 6h4v4h-4v-4Zm6 6h4v4h-4v-4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-bold tracking-[-0.01em]">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

function AuraStrip() {
  return (
    <section className="shell py-16 lg:py-24">
      <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-14">
        <div>
          <Reveal>
            <p className="eyebrow">Aura</p>
            <h2 className="display mt-2 text-3xl sm:text-4xl">
              El progreso que se puede ver.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
              Participar suma, ganar suma más. El Aura acumula victorias, logros y
              torneos completados en una sola cifra por temporada. Nada escondido:
              el historial completo es público.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-5">
              <StretchyButton href="/ranking" label="Ver el ranking completo" variant="aura" size="lg" radius={150} />
            </div>
          </Reveal>
        </div>

        <Reveal delay={120} from="right" className="h-full">
          <aside className="glass-card h-full">
            <p className="border-b border-line/70 px-5 py-3.5 text-2xs font-bold uppercase tracking-[0.14em]">
              Top de la temporada
            </p>
            <ul className="divide-y divide-line/70 px-1">
              {FEATURED_RANK.map((player, i) => (
                <li key={player.id} className="flex items-center gap-3 rounded-2xl px-4 py-3 transition-colors hover:bg-foreground/[0.04]">
                  <span className="display w-6 shrink-0 text-sm tabular text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-background text-2xs font-bold">
                    {initials(player.name)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold">{player.name}</span>
                    <span className="block text-2xs text-muted-foreground">{player.team}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1 text-sm font-extrabold tabular text-aura">
                    <AuraMark className="h-3.5 w-3.5" />
                    {formatNumber(player.aura)}
                  </span>
                </li>
              ))}
            </ul>
          </aside>
        </Reveal>
      </div>
    </section>
  )
}

function Categories() {
  return (
    <section className="border-t border-line bg-surface/60">
      <div className="shell py-16 lg:py-20">
        <Reveal>
          <p className="eyebrow">Categorías</p>
          <h2 className="display mt-2 text-3xl sm:text-4xl">Cualquier tarea se puede poner en juego.</h2>
        </Reveal>
        <ul className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {CATEGORIES.map((category, i) => (
            <Reveal key={category.id} as="li" delay={(i % 5) * 70} className="glass-card h-full p-6 transition-colors hover:text-primary">
              <CategoryIcon category={category.id} className="h-6 w-6 text-primary" />
              <h3 className="mt-3 text-sm font-bold uppercase tracking-[0.08em]">{category.label}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{category.blurb}</p>
              <p className="mt-3 text-2xs font-bold tabular text-muted-foreground">
                {category.count} torneos demo
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="shell pb-20 pt-4 lg:pb-28">
      <Reveal from="fade">
        <div className="relative overflow-hidden rounded-3xl bg-foreground px-6 py-14 text-background lg:px-14 lg:py-20">
          <div className="pointer-events-none absolute inset-0 opacity-[0.12]" aria-hidden="true">
            <svg viewBox="0 0 400 300" className="h-full w-full" fill="none" preserveAspectRatio="none">
              <path d="M20 40h60v70h70v70h70v80h80" stroke="currentColor" strokeWidth="2" />
              <path d="M20 240h60v-70h70v-70h70V40h80" stroke="currentColor" strokeWidth="2" strokeDasharray="6 8" />
            </svg>
          </div>

          <div className="relative text-center">
            <p className="text-2xs font-bold uppercase tracking-[0.16em] text-background/60">
              Cupos abiertos · Temporada 2026
            </p>
            <h2 className="display mt-3 text-4xl leading-[0.95] sm:text-5xl lg:text-6xl">
              Pinta la cancha,<br />arma el cuadro.
            </h2>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-5">
              <StretchyButton href="/registro" label="Crear cuenta gratis" variant="accent" size="lg" radius={160} />
              <Link
                href="/login"
                className="focus-ring rounded-sm text-sm font-semibold text-background underline decoration-background/30 underline-offset-4 transition-colors hover:decoration-background"
              >
                Ya tengo cuenta
              </Link>
            </div>

            <p className="mt-7 text-2xs leading-relaxed text-background/50">
              Modo demostración: la cuenta se guarda en tu navegador. Las credenciales
              de ejemplo viven en el README.
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

export default function HomePage() {
  return (
    <div>
      <Hero />
      <Marquee />
      <Agenda />
      <HowItWorks />
      <AuraStrip />
      <Categories />
      <FinalCta />
    </div>
  )
}
