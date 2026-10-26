"use client";

import Link from "next/link"
import { useState, useEffect } from "react"


function IconTrophy({ className = "", size = 24 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
      <path d="M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3" />
      <path d="M12 14v3M8 20h8" />
    </svg>
  )
}

function IconTarget({ className = "", size = 24 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  )
}

function IconUsers({ className = "", size = 24 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
      <circle cx="17" cy="9" r="2.5" opacity="0.5" />
      <path d="M17.5 14.5c2.5.5 4 2.5 4 5" opacity="0.5" />
    </svg>
  )
}

function IconChart({ className = "", size = 24 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4 20V10M10 20V4M16 20v-7M21 20H3" />
    </svg>
  )
}

function IconZap({ className = "", size = 24 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  )
}

function IconGoogle({ className = "", size = 24 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.44 12.18c0-.73-.07-1.44-.2-2.14H12v4.1h6.47c-.26 1.37-1.05 2.61-2.14 3.42v3.02h2.6c2.2-1.92 3.56-4.77 3.56-8.42Z"/>
      <path fill="#34A853" d="M12 24c3.24 0 5.98-1.05 7.93-2.82l-3.55-3.55c-.5-.5-.95-.77-1.39-.77H3.52C3.08 16.6 6.32 13.6 10.2 13.6c2.04 0 3.96.6 5.54 1.64l3.34-3.36Z"/>
      <path fill="#FBBC05" d="M5.2 12.58c-.4-1.01-.64-2.1-.64-3.24 0-3.18 2.58-5.76 5.76-5.76 1.14 0 2.17.34 3.02.92l3.22-3.22C12.74 3.74 11.52 3 10.2 3 6.32 3 3.08 6.4 3.08 10.4 3.08 14.4 6.4 17.6 10.6 17.6c2.2 0 4.17-.8 5.71-2.16l3.4 3.43C17.26 19.38 15.06 21 12 21Z"/>
      <path fill="#EA4335" d="M12 5.99c1.62 0 3.06.56 4.2 1.73l3.35-3.36C16.97 2.16 14.4 1 12 1 6.32 1 3.08 4.4 3.08 9.6 3.08 13.6 6.32 16.6 10.2 16.6c2.04 0 3.96-.6 5.54-1.64l3.35 3.36C17.06 17.84 14.62 19 12 19Z"/>
    </svg>
  )
}

// ============================================================================
// Página principal
// ============================================================================
export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-[80vh]">
      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Círculos decorativos animados */}
        <svg className="absolute -top-24 -left-24 w-96 h-96 text-morado opacity-10" aria-hidden="true">
          <circle cx="192" cy="192" r="150" fill="none" stroke="currentColor" strokeWidth="40">
            <animate attributeName="r" values="130;160;130" dur="8s" repeatCount="indefinite" />
          </circle>
        </svg>
        <svg className="absolute -bottom-24 -right-24 w-96 h-96 text-morado opacity-10" aria-hidden="true">
          <circle cx="192" cy="192" r="150" fill="none" stroke="currentColor" strokeWidth="40">
            <animate attributeName="r" values="160;130;160" dur="10s" repeatCount="indefinite" />
          </circle>
        </svg>

        <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-[480px] px-6 py-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-sm font-semibold text-muted-foreground">
            <span className="w-2.5 h-2.5 rounded-full bg-morado animate-pulse" />
            Torneos para todos: deportes, gaming, comunidad
          </span>

          <h1 className="mt-6 text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[0.95]">
            CREA. COMPITE.
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-morado-500 via-purple-500 to-indigo-500">
              GANA AURA.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl">
            La plataforma universal de torneos con gamificación{" "}
            <span className="font-bold text-morado">Aura</span>. Organiza en minutos,
            invita a tu comunidad y suma puntos en cada victoria.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link
              href="/crear"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-morado text-white font-bold shadow-lg shadow-morado/25 hover:-translate-y-0.5 hover:shadow-morado/40 active:scale-95 transition-all"
            >
              <IconZap size={18} /> Crear Torneo
            </Link>
            {isLoading ? (
              <div className="h-12 w-40 animate-pulse rounded-full bg-muted" />
            ) : (
              <Link
                href="/registro"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border-2 border-border font-bold hover:border-morado hover:text-morado active:scale-95 transition-all"
              >
                <IconGoogle size={18} /> Continuar con Google
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* CARACTERÍSTICAS */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10">
          Características <span className="text-morado">Principales</span>
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: IconTrophy, title: "Sistema Aura", desc: "Gana puntos por participación, victorias y logros en la comunidad" },
            { icon: IconTarget, title: "Multideporte", desc: "Desde eSports hasta deportes tradicionales y juegos de mesa" },
            { icon: IconUsers, title: "Comunidad", desc: "Conéctate con jugadores y organizadores de todo tipo" },
            { icon: IconChart, title: "Estadísticas", desc: "Seguimiento detallado de tu rendimiento y progreso" },
          ].map((f) => (
            <div
              key={f.title}
              className="group text-center p-6 rounded-2xl border border-border bg-card hover:-translate-y-1.5 hover:border-morado/40 hover:shadow-xl hover:shadow-morado/10 transition-all duration-300"
            >
              <div className="mb-4 h-14 w-12 mx-auto flex items-center justify-center rounded-xl bg-morado/10 text-morado group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">
                <f.icon size={28} />
              </div>
              <h3 className="font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="max-w-4xl mx-auto px-6 py-14">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10">
          ¿Cómo <span className="text-morado">Funciona</span>?
        </h2>
        <div className="space-y-6">
          {[
            { n: "1", title: "Crea tu Torneo", desc: "Define el formato, disciplina, premios y invita a tu comunidad" },
            { n: "2", title: "Compete y Gana", desc: "Juega partidos, acumula Aura y escala en los rankings" },
            { n: "3", title: "Desbloquea Logros", desc: "Consigue insignias, niveles y recompensas especiales" },
          ].map((s) => (
            <div
              key={s.n}
              className="flex items-start gap-4 p-5 rounded-2xl border border-border bg-card hover:border-morado/40 transition-colors"
            >
              <div className="h-11 w-11 shrink-0 flex items-center justify-center rounded-xl bg-morado text-white font-extrabold shadow-lg shadow-morado/25">
                {s.n}
              </div>
              <div>
                <h3 className="font-bold mb-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="relative overflow-hidden text-center py-14 px-6 rounded-3xl bg-gradient-to-br from-morado-600 to-indigo-700 text-white shadow-2xl shadow-morado/30">
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <h2 className="relative text-3xl sm:text-4xl font-extrabold mb-4">
            ¿Listo para comenzar?
          </h2>
          <p className="relative text-lg text-white/85 mb-8 max-w-2xl mx-auto">
            Únete a organizadores y jugadores que ya crean experiencias competitivas increíbles con Tornuti.
          </p>
          <Link
            href="/registro"
            className="relative inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-morado-700 font-extrabold hover:-translate-y-0.5 active:scale-95 transition-all shadow-xl"
          >
            <IconGoogle size={18} />
            Une Gratis Ahora
          </Link>
        </div>
      </section>
    </main>
  )
}