# Arquitectura

Tornuti es un monorepo con dos aplicaciones desplegables de forma independiente y una base de datos PostgreSQL compartida.

```text
Navegador
    │
    ├── Next.js 15 (apps/web)
    │       │
    │       └── NEXT_PUBLIC_API_URL (opcional)
    │                 │
    └─────────────────┴── NestJS 11 (apps/api)
                              │
                              └── Prisma 6 ── PostgreSQL
```

## Principios

1. **El producto se puede recorrer sin infraestructura.** La web incluye un modo de demostración local para que la portada, las fichas, las inscripciones y el panel funcionen sin base de datos.
2. **La API es independiente y verificable.** Expone el modelo completo, documentación OpenAPI y health checks. Puede usarse desde cualquier cliente.
3. **Los permisos viven en el servidor.** La interfaz oculta acciones, pero la API vuelve a comprobar propiedad y rol en cada operación sensible.
4. **El dinero no es parte del modelo.** No hay pagos, comisiones ni tarjetas. El Aura es reputación y no se compra, transfiere ni canjea.
5. **La accesibilidad y el rendimiento son requisitos, no adornos.** La navegación funciona con teclado, los iconos son SVG y las páginas se generan de forma estática cuando es posible.

## Frontend

Ruta: `apps/web`.

- **Next.js App Router** con React 18 y TypeScript estricto.
- **Tailwind CSS** con tokens semánticos en `app/globals.css`.
- **Componentes de servidor** para páginas de contenido y metadatos.
- **Componentes de cliente** para filtros, formularios, tabs, tema, toasts y el estado local.
- **Estado local** en `components/providers/tornuti-provider.tsx`, persistido en `localStorage`.
- **Capa de API opcional** para autenticación cuando existe `NEXT_PUBLIC_API_URL`.
- **Metadatos, sitemap, robots, manifest, favicon y Open Graph** generados desde el propio proyecto.

### Rutas principales

| Ruta | Tipo | Contenido |
| --- | --- | --- |
| `/` | Estática | Portada, agenda, categorías y explicación del producto. |
| `/explorar` | Cliente | Buscador, filtros, orden y tarjetas de torneo. |
| `/torneos/[slug]` | SSG | Ficha, participantes, cuadro, calendario y resultados. |
| `/crear` | Cliente | Formulario con vista previa y publicación local. |
| `/ranking` | Estática | Leaderboard de Aura de la temporada. |
| `/equipos` | Cliente | Directorio de equipos y unión local. |
| `/dashboard` | Cliente | Sesión, inscripciones, torneos creados, equipos y Aura. |
| `/login`, `/registro` | Dinámica | Autenticación local o contra la API. |
| `/reglas`, `/privacidad`, `/terminos` | Estática | Contenido legal y de producto. |

### Estado de demostración

`PersistedState` contiene:

- `session`: usuario actual, con Aura y rol.
- `registrations`: inscripciones guardadas en el navegador.
- `created`: torneos creados desde el formulario.
- `joinedTeams`: equipos a los que se unió la sesión.

La clave de almacenamiento es `tornuti:store:v1`. El estado se lee después del montaje para evitar diferencias entre servidor y cliente. Si `localStorage` no está disponible, la sesión vive solo en memoria.

## Backend

Ruta: `apps/api`.

### Módulos

| Módulo | Responsabilidad |
| --- | --- |
| `auth` | Registro, login, JWT, perfil autenticado. |
| `users` | Perfil público, actualización propia, equipos del usuario. |
| `teams` | Creación, listado, detalle, unión, salida y expulsión. |
| `tournaments` | CRUD, publicación, cancelación, inscripciones y cuadro. |
| `matches` | Consulta, inicio, reporte de resultado y avance. |
| `aura` | Leaderboard, historial y cálculo de recompensas. |
| `prisma` | Ciclo de vida de la conexión. |
| `common` | Decoradores, guards, filtros, DTOs y utilidades. |

### Flujo de autenticación

1. El cliente envía correo y contraseña a `POST /api/auth/login`.
2. El servicio busca al usuario y compara el hash con bcrypt.
3. Se firma un JWT con `sub`, `email` y `role`.
4. El cliente envía `Authorization: Bearer <token>`.
5. `JwtAuthGuard` es global. `@Public()` exceptúa las rutas abiertas.
6. `RolesGuard` aplica restricciones adicionales cuando existe `@Roles(...)`.

### Flujo de inscripción

1. `POST /api/tournaments/:slug/register`.
2. Se comprueba que el torneo exista, esté publicado y dentro del plazo.
3. Si se inscribe un equipo, se verifica que el usuario sea miembro.
4. Se impide duplicar una inscripción activa del mismo usuario o equipo.
5. Dentro de una transacción Serializable se cuenta el cupo y se crea la inscripción.
6. La primera inscripción otorga 40 Aura mediante un registro en el ledger.

### Flujo de cuadro y resultados

1. La organización genera el cuadro con `POST /api/tournaments/:slug/bracket`.
2. Se ordenan las inscripciones aceptadas y se aplica el orden estándar de siembra.
3. Los byes se reparten en el cuadro; una ronda posterior no se cierra hasta que sus partidos alimentadores terminan.
4. La organización inicia un partido con `PATCH /api/matches/:id/start`.
5. Al reportar el resultado, el ganador avanza a la posición correspondiente de la siguiente ronda.
6. Se actualizan estadísticas de equipo y de jugador.
7. Cada jugador recibe 20 Aura por jugar; el equipo ganador recibe 60 Aura por victoria.
8. Si era la final, el torneo pasa a completado y se reparte el Aura del podio.

### Modelo de datos

```text
User ──< TeamMember >── Team
 │                         │
 ├──< TournamentRegistration >── Tournament
 │                                      │
 ├──< AuraTransaction                   ├──< Match
 ├──  PlayerStatistics                  └──< TournamentGroup
 └──< Achievement                            └──< GroupParticipant
```

Tablas principales:

- `User`: cuenta, rol, Aura total y perfil.
- `PlayerStatistics` y `TeamStatistics`: partidos, victorias, derrotas y puntos.
- `Team` y `TeamMember`: equipos y membresías.
- `Tournament` y `TournamentRegistration`: ficha, cupos e inscripciones.
- `Match`: ronda, posición, etapa, equipos, marcador, ganador y estado.
- `AuraTransaction`: ledger inmutable de cada movimiento de Aura.
- `Achievement`: logros y relación muchos-a-muchos con usuarios.
- `TournamentGroup` y `GroupParticipant`: base para grupos y playoffs.
- `Report`: reportes de conducta para moderación.

### Transacciones

Las operaciones que cambian cupos, resultados, estadísticas o Aura usan `prisma.$transaction`. La inscripción usa aislamiento `Serializable` para evitar sobreventa de cupos. El reporte de resultado usa una transacción de 20 segundos para actualizar partido, siguiente ronda, torneo, estadísticas y ledger como una sola unidad.

## Seguridad

- Contraseñas con bcrypt, costo 12.
- JWT firmado con secreto obligatorio en producción.
- `JwtAuthGuard` global y rutas públicas explícitas.
- Comprobación de propiedad en torneos, equipos y resultados.
- Validación con `class-validator` y `ValidationPipe` con `whitelist` y `forbidNonWhitelisted`.
- Rate limiting global y límites más estrictos en login y registro.
- Helmet, CORS configurable y límite de payload.
- Filtro global que no filtra detalles internos de Prisma en producción.
- Migraciones versionadas; el seed solo se ejecuta manualmente.

Consulta [SECURITY.md](../SECURITY.md) para el proceso de reporte.

## Rendimiento

- Páginas de producto estáticas o SSG cuando no dependen de sesión.
- Fuente variable local, sin bloqueo de terceros.
- SVG propios en lugar de imágenes raster.
- `next/font` no se usa porque la fuente se sirve desde el paquete local; el CSS la carga con `font-display: swap`.
- Compresión activada y cabeceras de seguridad en Next.
- Consultas con `select` explícito y paginación en listados.
- Índices en Aura, categorías, estados y relaciones consultadas.

## Pruebas

- **API:** Jest para utilidades, bracket y reglas de servicio con Prisma simulado.
- **Web:** Vitest para bracket y utilidades.
- **Verificación manual:** migración, seed, arranque de API, login, listados, generación de cuadro, reporte de resultados y avance del ganador contra PostgreSQL real.

## Decisiones y límites

- El frontend prioriza una experiencia completa sin backend. La integración total de datos está en el roadmap.
- El formato de grupo existe en el modelo y en la interfaz, pero la generación automática implementada es de eliminación directa.
- La doble eliminación y el suizo están modelados como formatos, aún sin generador automático.
- El Aura es un contador reputacional. No hay economía, compra ni transferencia.
- No se incluyen fotos de personas ni testimonios ficticios. Las portadas y avatares son geométricos y generados.
