import { AuraMark } from "@/components/brand"
import { Progress } from "@/components/ui/progress"
import { formatNumber } from "@/lib/utils"

const quarterFinals = [
  { a: "Las Cadejas", b: "Vista Hermosa", sa: 21, sb: 18, live: false },
  { a: "Santa Ana Five", b: "Cuscatlán U.", sa: 15, sb: 21, live: false },
]

const semiFinal = [
  { a: "Las Cadejas", b: "Cuscatlán U.", sa: 12, sb: 9, live: true },
]

function MatchLine({
  a,
  b,
  sa,
  sb,
  emphasize = false,
}: {
  a: string
  b: string
  sa: number | string
  sb: number | string
  emphasize?: boolean
}) {
  return (
    <div className={emphasize ? "border border-foreground/80 bg-surface" : "border border-line bg-surface"}>
      <div className="flex items-center justify-between gap-2 px-2.5 py-1.5">
        <span className={emphasize ? "truncate text-[0.6875rem] font-bold" : "truncate text-[0.6875rem] font-medium"}>
          {a}
        </span>
        <span className="tabular text-[0.6875rem] font-bold">{sa}</span>
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-line px-2.5 py-1.5">
        <span className="truncate text-[0.6875rem] font-medium text-muted-foreground">{b}</span>
        <span className="tabular text-[0.6875rem] font-bold text-muted-foreground">{sb}</span>
      </div>
    </div>
  )
}

export function ControlDesk() {
  return (
    <div className="relative">
      <div className="absolute -left-3 -top-3 z-10 bg-accent px-2.5 py-1 text-2xs font-bold uppercase tracking-[0.14em] text-accent-foreground shadow-sm">
        Cuadro en vivo
      </div>

      <div className="border border-foreground bg-surface">
        <div className="flex items-center justify-between gap-3 border-b border-foreground px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="h-2 w-2 shrink-0 rounded-full bg-success" aria-hidden="true" />
            <p className="truncate text-xs font-bold uppercase tracking-[0.08em]">Copa Cadejos 3x3</p>
          </div>
          <span className="shrink-0 text-2xs font-semibold tabular text-muted-foreground">12 / 16</span>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-[1fr_0.9fr_1fr] gap-2.5">
            <div>
              <p className="mb-2 text-2xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Cuartos</p>
              <div className="space-y-2">
                {quarterFinals.map((match) => (
                  <MatchLine key={match.a} {...match} />
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <p className="mb-2 text-2xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Semis</p>
              <div className="relative">
                <div className="absolute -left-2 top-1/2 h-px w-2 bg-line" aria-hidden="true" />
                <MatchLine {...semiFinal[0]} emphasize />
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <p className="mb-2 text-2xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Final</p>
              <div className="border border-dashed border-line bg-elevated/60 px-2.5 py-4 text-center">
                <p className="text-2xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Por jugar</p>
                <p className="mt-1 text-[0.6875rem] font-semibold">3:00 p. m.</p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-line pt-3.5">
            <div>
              <p className="text-2xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">Cupos</p>
              <div className="mt-1.5 flex items-center gap-2">
                <Progress value={12} max={16} tone="primary" className="flex-1" />
                <span className="text-2xs font-bold tabular">75%</span>
              </div>
            </div>
            <div className="border-l border-line pl-3">
              <p className="text-2xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">Aura en juego</p>
              <p className="mt-1 flex items-center gap-1 text-sm font-extrabold tabular">
                <AuraMark className="h-3.5 w-3.5 text-aura" />
                {formatNumber(2400)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-line bg-elevated/60 px-4 py-2.5">
          <span className="text-2xs text-muted-foreground">Organiza Colectivo Cadejos</span>
          <span className="text-2xs font-bold uppercase tracking-[0.1em]">Parque Cuscatlán</span>
        </div>
      </div>

      <div className="absolute -bottom-4 -right-3 hidden border border-foreground bg-background px-3 py-2 sm:block">
        <p className="text-2xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Marcador</p>
        <p className="mt-0.5 text-sm font-extrabold tabular">12 — 9</p>
      </div>
    </div>
  )
}
