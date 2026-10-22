import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Reglas de juego",
  description: "Cómo funcionan los torneos, las inscripciones, los cuadros y el sistema Aura de Tornuti.",
}

export default function RulesPage() {
  return (
    <div className="shell py-14">
      <div className="max-w-prose">
        <p className="text-2xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Documento</p>
        <h1 className="display mt-3 text-4xl sm:text-5xl">Reglas de juego</h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Tornuti no impone un deporte ni un reglamento único. Estas son las reglas
          de la plataforma: lo que garantiza la ficha, la inscripción, el cuadro y el
          registro de Aura. Cada organización publica además sus propias reglas.
        </p>

        <div className="mt-10 space-y-10">
          <section>
            <h2 className="text-xl font-bold">1. Publicar un torneo</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                Cualquier persona puede publicar un torneo de forma gratuita. La ficha
                debe indicar disciplina, formato, fecha, sede, cupos y reglas. La
                organización es responsable de la veracidad de esos datos y de contar
                con los permisos del espacio donde se juega.
              </p>
              <p>
                Tornuti no cobra por publicar, inscribirse ni consultar resultados. No
                se solicitan datos de pago en ninguna parte de la plataforma.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold">2. Inscripciones y cupos</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                Una inscripción queda registrada cuando la persona completa el
                formulario. La organización puede aceptar, rechazar o pedir información
                adicional. El cupo se cierra al alcanzar el máximo publicado.
              </p>
              <p>
                En la versión de demostración, las inscripciones se guardan en el
                almacenamiento local del navegador y no se comparten entre dispositivos.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold">3. Cuadros y resultados</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                El cuadro proyectado se genera con las personas inscritas, en el orden
                de inscripción y con descansos para completar la ronda cuando el número
                de participantes no es potencia de dos. La organización confirma el
                cuadro definitivo al cerrar los cupos.
              </p>
              <p>
                Los resultados son responsabilidad de la organización y de la mesa de
                anotación. Cualquier reclamo debe presentarse directamente a quien
                organiza el torneo.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold">4. Aura</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                Aura es un registro de participación, no una moneda. No se compra, no se
                transfiere y no tiene valor monetario. Se suma por inscribirse, jugar,
                ganar y subir al podio, según la tabla publicada en el ranking.
              </p>
              <p>
                Las cuentas de demostración no alteran el ranking público. Los datos de
                la tabla de la temporada son sintéticos y se identifican como tales.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold">5. Conducta</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                No se toleran amenazas, acoso, discriminación ni manipulación de
                resultados. La organización puede retirar a un participante que incumpla
                las reglas del torneo o estas reglas de plataforma.
              </p>
              <p>
                Para reportar un problema, escribe a{" "}
                <a href="mailto:hola@tornuti.app" className="font-semibold text-foreground underline underline-offset-4">
                  hola@tornuti.app
                </a>{" "}
                o abre un reporte en el repositorio del proyecto.
              </p>
            </div>
          </section>
        </div>

        <div className="mt-12 border-t border-line pt-6">
          <p className="text-xs text-muted-foreground">
            Última actualización: 21 de octubre de 2026.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold">
            <Link href="/terminos" className="underline decoration-line underline-offset-4 hover:decoration-foreground">
              Términos de uso
            </Link>
            <Link href="/privacidad" className="underline decoration-line underline-offset-4 hover:decoration-foreground">
              Privacidad
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
