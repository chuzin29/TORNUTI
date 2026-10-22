"use client"

import { Button } from "@/components/ui/button"

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="shell py-24">
      <div className="mx-auto max-w-lg border border-foreground bg-surface p-8 text-center">
        <svg viewBox="0 0 48 48" className="mx-auto h-12 w-12 text-danger" fill="none" aria-hidden="true">
          <path d="M24 6 4 42h40L24 6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M24 18v11M24 35v1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <h1 className="display mt-5 text-3xl">Algo se rompió en la mesa</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          La página no terminó de cargar. Puedes intentarlo otra vez; si sigue igual,
          revisa la consola o abre un reporte en el repositorio.
        </p>
        <Button className="mt-6" onClick={reset}>
          Intentar de nuevo
        </Button>
      </div>
    </div>
  )
}
