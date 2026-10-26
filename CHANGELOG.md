# Cambios

Todas las fechas están en formato ISO 8601. El proyecto sigue versionado semántico para la API y la web a partir de la versión 1.0.0.

## 1.1.0 - 2026-10-26

### Agregado

- Portada rediseñada con jerarquía de impreso deportivo: cuadro en vivo, cinta de disciplinas en bucle, agenda con datos reales de la demostración, pasos numerados, tirada de Aura y categorías.
- Botón insignia `StretchyButton` reescrito: píldora con bisel y relieve 3D (cúpula de gel, luz de subsurface, hundimiento al presionar) y una sola masa homogénea de "pintura" que nace en el borde de la píldora del lado del puntero y corre hasta la mano con onda viajera, culebreo y cabeza gorda que se estira con la velocidad. Sin hilillos: silueta rellena con la curva de puntos medios y difuminación casi nula al mover.
- Material de tarjetas estilo Apple: `.glass-card` con vidrio (backdrop-blur), hilo de 1 px, profundidad en dos capas y hover que eleva 4 px; aplica a tarjetas de torneos, pasos, categorías y el top de Aura.
- Movimiento con scroll de bajo costo: `Reveal` (un solo `IntersectionObserver` compartido), `Parallax` por `translate3d` y barra `ScrollProgress`; el HTML del servidor no queda vacío sin JS (`html.js`) y todo respeta `prefers-reduced-motion`.
- Cursor de guante con tres poses (señalar, abierto, puño), colores por tema y desactivación táctil; montado globalmente en los proveedores.
- Integración de autenticación con Supabase: `signInWithPassword`, `signUp` con aviso de confirmación de correo, cierre de sesión con `signOut`, sincronización de sesión de Google al volver por `/auth/callback` y errores traducidos a mensajes claros; Google muestra aviso amiable mientras el proveedor esté desactivado en el panel.
- `scripts/supabase-schema.sql`: ocho tablas con RLS (líneas, equipos, torneos, inscripciones, partidos, aura y logros), disparadores de perfil y de Aura, índices y tres torneos demo; `docs/SUPABASE.md` con instrucciones del SQL Editor, confirmación de correos y activación de Google.
- Tokens de bisel, guante y masa (`--btn-rim`, `--btn-low`, `--sb-*` incluido `--sb-dome`, `--glove-*`) y sombras `bevel`/`bevelLift`.

### Corregido

- Contraste roto: los botones de la portada usaban clases inexistentes (`bg-morado`, `bg-card`, `border-border`) que producían texto claro sobre fondo claro. Toda la portada usa ahora los tokens del sistema.
- La masa del botón no se pintaba: la regla heredada `.stretch-stage path { fill: none }` anulaba el relleno de la nueva silueta; se eliminó la regla obsoleta.
- El botón salía del centro; ahora la masa escapa por el borde (punto de fuga del estadio) exactamente del lado de la mano.
- El blur al acercarse se redujo a estela ligera (tope 0.65 px) para que la píldora siempre se lea con nitidez.
- El árbol entero quedaba sin HTML de servidor porque `SupabaseProvider` devolvía un placeholder hasta hidratar; vuelve a renderizar hijos siempre.
- Formulario de cuenta: iconos no importados (`Loader2`, `Google`), marcaje de error con el token inexistente `destructive`, formulario duplicado completo y textos truncados.
- Errores de typecheck previos: tipos de `SessionUser`/`Registration` en conflicto, `asChild` inexistente en `Button` y parámetros implícitamente `any` en las cookies de Supabase.

### Cambiado

- Todos los botones del sistema adoptan la píldora con bisel del botón Stretch y comparten la curva suave de movimiento.
- El botón Stretch ya no depende de arrastrar el botón: la interacción es el alcance de su masa hacia el cursor, desde los bordes de la píldora.
- La documentación de `docs/DISENO.md` describe la implementación real de masa, guante y cinta; `docs/SUPABASE.md` nuevo para la parte de cuentas.
- La cinta de disciplinas, el pulso de Aura y los ajustes decorativos corren solo bajo `motion-safe`; reveals, parallax, guante y masa respetan `prefers-reduced-motion`.

## 1.0.0 - 2026-10-21

### Agregado

- Monorepo con workspaces para `apps/web` y `apps/api`.
- Frontend Next.js con portada, explorador, ficha de torneo, creación, ranking, equipos, panel, autenticación y páginas legales.
- Modo de demostración local persistido en `localStorage`, con sesión, inscripciones, torneos creados y equipos.
- Identidad visual completa: papel cálido, tinta, cobalto, lima y ámbar; portadas SVG propias; modo claro y oscuro.
- API NestJS con autenticación JWT, bcrypt, roles, equipos, torneos, inscripciones, partidos, Aura y logros.
- Cuadro de eliminación directa con orden estándar de siembra, reparto de byes y avance automático del ganador.
- Ledger de Aura con recompensas por inscripción, equipo, partido, victoria y podio.
- Migración inicial de PostgreSQL y seed con usuarios, equipos, torneos, partidos, Aura y logros.
- Swagger, health check, readiness check, CORS, Helmet, rate limiting y filtro global de errores.
- Documentación de arquitectura, API, diseño, despliegue y roadmap.
- CI con GitHub Actions para typecheck, lint, pruebas y build.
- Configuración de PostgreSQL local con Docker Compose y blueprint de Render.

### Corregido

- El cuadro ya no completa rondas posteriores antes de que se jueguen sus partidos alimentadores.
- Los byes se reparten con siembra estándar en lugar de acumularse.
- El campeón solo se muestra si el partido de etapa `Final` terminó y el torneo está completado.
- Los torneos cerrados o en juego ya no muestran cupos disponibles ni plazas libres.
- El calendario usa estados de partido en lugar de estados de torneo.
- El listado de la portada solo incluye torneos que todavía reciben inscripciones.
- La ruta de arranque de la API se alineó con la salida de `nest build`.

### Cambiado

- Se reemplazó el esqueleto anterior por una aplicación funcional y verificable.
- Se eliminaron credenciales de ejemplo y dependencias de autenticación rotas.
- Se actualizó Next.js a una versión mantenida y se adaptaron las rutas dinámicas a `params` y `searchParams` asíncronos.
- Se normalizó el formato del código y se agregaron configuraciones de ESLint y Prettier.

### Seguridad

- Se eliminaron secretos del repositorio.
- Se agregó validación estricta, rate limiting y comprobación de propiedad.
- Se documentó el proceso de reporte de vulnerabilidades.

### Conocido

- La web mantiene su capa de demostración local; la sincronización completa con la API está en el roadmap.
- La generación automática de grupos, liga, suizo y doble eliminación aún no está implementada.
