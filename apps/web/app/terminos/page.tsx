import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Términos de uso",
  description: "Condiciones de uso de Tornuti, la plataforma gratuita de torneos.",
}

export default function TermsPage() {
  return (
    <div className="shell py-14">
      <div className="max-w-prose">
        <p className="text-2xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Documento</p>
        <h1 className="display mt-3 text-4xl sm:text-5xl">Términos de uso</h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Tornuti es una plataforma de código abierto para publicar y gestionar
          torneos. Al usarla aceptas estas condiciones.
        </p>

        <div className="mt-10 space-y-9 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-xl font-bold text-foreground">1. Uso gratuito</h2>
            <p className="mt-2">
              Publicar torneos, inscribirse y consultar resultados es gratuito. No hay
              planes de pago, comisiones ni cargos ocultos. La demostración no procesa
              pagos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground">2. Responsabilidad de la organización</h2>
            <p className="mt-2">
              Quien publica un torneo es responsable de su organización, de la seguridad
              del espacio, de los permisos necesarios y del trato con las personas
              inscritas. Tornuti no organiza, arbitra ni supervisa los eventos
              publicados.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground">3. Contenido</h2>
            <p className="mt-2">
              No publiques contenido ilegal, amenazas, acoso, discriminación ni
              información falsa. Podemos retirar fichas que incumplan estas condiciones
              o las reglas de juego.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground">4. Disponibilidad</h2>
            <p className="mt-2">
              La demostración se ofrece tal como está, sin garantía de disponibilidad
              ni de conservación de datos locales. El código puede desplegarse por
              cuenta propia bajo la licencia MIT.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground">5. Aura</h2>
            <p className="mt-2">
              Aura es un registro de participación sin valor monetario. No constituye
              una moneda, un título valor ni una promesa de premio.
            </p>
          </section>
        </div>

        <p className="mt-12 border-t border-line pt-6 text-xs text-muted-foreground">
          Última actualización: 21 de octubre de 2026.{" "}
          <Link href="/privacidad" className="underline underline-offset-4 hover:text-foreground">
            Ver privacidad
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
