import Link from "next/link"
import { BrandMark } from "@/components/brand"
import { buttonStyles } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="shell py-20 lg:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="display text-7xl text-muted-foreground/40">404</p>
          <h1 className="display mt-4 text-4xl leading-[1.02] sm:text-5xl">
            Esta página no está en el cuadro.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            El enlace puede haber cambiado o el torneo ya no está publicado. Vuelve a
            la agenda o publica lo que estabas buscando.
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            <Link href="/explorar" className={buttonStyles({ size: "md" })}>
              Ver torneos
            </Link>
            <Link href="/" className={buttonStyles({ variant: "outline", size: "md" })}>
              Ir al inicio
            </Link>
          </div>
        </div>

        <div className="border border-foreground bg-surface p-6 sm:p-8" aria-hidden="true">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <span className="flex items-center gap-2 text-2xs font-bold uppercase tracking-[0.12em]">
              <BrandMark className="h-4 w-4 text-primary" />
              Mesa de control
            </span>
            <span className="text-2xs font-semibold text-muted-foreground">Sin resultado</span>
          </div>
          <svg viewBox="0 0 400 260" className="mt-6 w-full" fill="none">
            <g stroke="currentColor" strokeWidth="1.5" opacity="0.35">
              <path d="M30 40h64v46h80v46h80v46h74" />
              <path d="M30 220h64v-46h80v-46" />
              <path d="M30 130h50v-44" strokeDasharray="5 7" />
            </g>
            <g fill="currentColor">
              <rect x="22" y="32" width="8" height="8" />
              <rect x="22" y="212" width="8" height="8" />
              <rect x="22" y="122" width="8" height="8" opacity="0.4" />
              <circle cx="352" cy="178" r="8" opacity="0.35" />
            </g>
            <text x="200" y="70" textAnchor="middle" fontSize="13" fill="currentColor" opacity="0.55">
              Partido no encontrado
            </text>
          </svg>
        </div>
      </div>
    </div>
  )
}
