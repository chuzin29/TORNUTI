import Link from "next/link"
import { BrandMark, FlagSV } from "@/components/brand"

const columns = [
  {
    title: "Producto",
    links: [
      { href: "/explorar", label: "Explorar torneos" },
      { href: "/crear", label: "Crear un torneo" },
      { href: "/ranking", label: "Ranking Aura" },
      { href: "/equipos", label: "Equipos" },
    ],
  },
  {
    title: "Comunidad",
    links: [
      { href: "/dashboard", label: "Mi panel" },
      { href: "/registro", label: "Crear cuenta" },
      { href: "/login", label: "Entrar" },
      { href: "/reglas", label: "Reglas de juego" },
    ],
  },
  {
    title: "Proyecto",
    links: [
      { href: "https://github.com/chuzin29/TORNUTI", label: "Código abierto" },
      { href: "https://github.com/chuzin29/TORNUTI/blob/main/CONTRIBUTING.md", label: "Contribuir" },
      { href: "https://github.com/chuzin29/TORNUTI/issues", label: "Reportar un fallo" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="shell py-14">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <BrandMark className="h-8 w-8 text-primary" />
              <span className="display text-xl uppercase leading-none tracking-[-0.03em]">Tornuti</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Torneos de cualquier cosa, con la cuenta clara. Inscripciones, cuadros,
              resultados y Aura en un solo lugar.
            </p>
            <p className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <FlagSV />
              Hecho en El Salvador para cualquier cancha.
            </p>
            <p className="mt-6 max-w-xs text-2xs leading-relaxed text-muted-foreground">
              Gratis para organizadores y jugadores. El proyecto es de código abierto y
              se sostiene con trabajo voluntario.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((column) => (
              <div key={column.title}>
                <h2 className="text-2xs font-bold uppercase tracking-[0.14em] text-foreground">
                  {column.title}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="focus-ring rounded-sm text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>2026 Tornuti. Contenido de demostración salvo que se indique lo contrario.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacidad" className="focus-ring rounded-sm hover:text-foreground">
              Privacidad
            </Link>
            <Link href="/terminos" className="focus-ring rounded-sm hover:text-foreground">
              Términos
            </Link>
            <span className="hidden items-center gap-1.5 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
              Sistema operativo
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
