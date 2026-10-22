# Cambios

Todas las fechas están en formato ISO 8601. El proyecto sigue versionado semántico para la API y la web a partir de la versión 1.0.0.

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
