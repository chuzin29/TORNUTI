import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacidad",
  description: "Qué datos usa Tornuti en la demostración y cómo se tratan.",
}

export default function PrivacyPage() {
  return (
    <div className="shell py-14">
      <div className="max-w-prose">
        <p className="text-2xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Documento</p>
        <h1 className="display mt-3 text-4xl sm:text-5xl">Privacidad</h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          La versión pública de Tornuti funciona como demostración local. No hay
          analítica, cookies publicitarias ni rastreadores de terceros.
        </p>

        <div className="mt-10 space-y-9 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-xl font-bold text-foreground">Qué se guarda</h2>
            <p className="mt-2">
              El tema visual, la cuenta de demostración, las inscripciones, los torneos
              publicados y los equipos a los que te unes se guardan en el
              almacenamiento local de tu navegador. Esa información no viaja a un
              servidor y puedes borrarla limpiando los datos del sitio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground">Qué no se pide</h2>
            <p className="mt-2">
              No se solicitan datos de tarjetas, documentos de identidad ni ubicación
              precisa. El correo que escribes en una inscripción se usa únicamente para
              identificar el registro dentro de la demostración.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground">API y producción</h2>
            <p className="mt-2">
              Si conectas la API incluida en el repositorio, las cuentas se almacenan en
              la base de datos que configures. En ese caso, la organización responsable
              del despliegue debe publicar su propia política y atender solicitudes de
              acceso o eliminación.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground">Contacto</h2>
            <p className="mt-2">
              Consultas sobre datos:{" "}
              <a href="mailto:hola@tornuti.app" className="font-semibold text-foreground underline underline-offset-4">
                hola@tornuti.app
              </a>
              .
            </p>
          </section>
        </div>

        <p className="mt-12 border-t border-line pt-6 text-xs text-muted-foreground">
          Última actualización: 21 de octubre de 2026.{" "}
          <Link href="/terminos" className="underline underline-offset-4 hover:text-foreground">
            Ver términos
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
