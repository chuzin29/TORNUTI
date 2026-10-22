# API

Base local: `http://localhost:3001/api`

Documentación interactiva: `http://localhost:3001/api/docs`

La API usa JSON, autenticación JWT Bearer y prefijo global `/api`. Todas las rutas responden con el formato de error descrito al final.

## Autenticación

### Registro

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Valeria Rivas",
  "email": "valeria@tornuti.app",
  "password": "tornuti123"
}
```

Crea la cuenta, genera un handle único y devuelve un token.

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "cm...",
    "name": "Valeria Rivas",
    "email": "valeria@tornuti.app",
    "handle": "valeria-rivas",
    "role": "PLAYER",
    "aura": 0
  }
}
```

Límite: 5 solicitudes por minuto por IP.

### Inicio de sesión

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "jugador@tornuti.app",
  "password": "tornuti123"
}
```

Límite: 10 solicitudes por minuto por IP.

### Perfil autenticado

```http
GET /api/auth/me
Authorization: Bearer <token>
```

Devuelve el perfil y sus estadísticas.

## Usuarios

| Método | Ruta | Auth | Descripción |
| --- | --- | --- | --- |
| `GET` | `/api/users/:handle` | No | Perfil público por handle o id. |
| `PATCH` | `/api/users/me` | Sí | Actualiza nombre, bio o avatar propio. |
| `GET` | `/api/users/me/teams` | Sí | Equipos a los que pertenece la sesión. |

Ejemplo de actualización:

```json
{
  "name": "Valeria Rivas",
  "bio": "Base de Las Cadejas.",
  "avatarUrl": "https://ejemplo.com/avatar.png"
}
```

## Equipos

| Método | Ruta | Auth | Descripción |
| --- | --- | --- | --- |
| `GET` | `/api/teams?q=&category=&page=&limit=` | No | Listado público paginado. |
| `POST` | `/api/teams` | Sí | Crea un equipo y asigna al creador como capitán. |
| `GET` | `/api/teams/me` | Sí | Equipos del usuario. |
| `GET` | `/api/teams/:slug` | No | Detalle con miembros y estadísticas. |
| `POST` | `/api/teams/:slug/join` | Sí | Unirse al equipo. |
| `DELETE` | `/api/teams/:slug/leave` | Sí | Salir del equipo. |
| `DELETE` | `/api/teams/:slug/members/:memberId` | Sí | Retirar un miembro; requiere capitán o admin. |

Crear equipo:

```json
{
  "name": "Las Cadejas",
  "motto": "Nadie corre sola.",
  "description": "Equipo de básquet 3x3 del barrio.",
  "category": "deportes",
  "city": "San Salvador"
}
```

Categorías válidas: `deportes`, `gaming`, `comunidad`, `cultura`, `empresas`.

Crear un equipo otorga 25 Aura al creador. Unirse otorga 15 Aura.

## Torneos

| Método | Ruta | Auth | Descripción |
| --- | --- | --- | --- |
| `GET` | `/api/tournaments` | No | Listado público con filtros y paginación. |
| `GET` | `/api/tournaments/mine` | Sí | Torneos organizados por la sesión. |
| `POST` | `/api/tournaments` | Sí | Crea un torneo en estado `DRAFT`. |
| `GET` | `/api/tournaments/:slug` | No | Detalle con inscripciones y partidos. |
| `PATCH` | `/api/tournaments/:id` | Sí | Actualiza la ficha; requiere organizador o admin. |
| `POST` | `/api/tournaments/:id/publish` | Sí | Publica y abre la inscripción. |
| `POST` | `/api/tournaments/:id/cancel` | Sí | Cancela el torneo. |
| `POST` | `/api/tournaments/:slug/register` | Sí | Inscribe a la sesión y, opcionalmente, a un equipo. |
| `DELETE` | `/api/tournaments/:slug/register` | Sí | Retira la inscripción propia. |
| `POST` | `/api/tournaments/:slug/bracket` | Sí | Genera el cuadro de eliminación directa. |

### Filtros del listado

| Parámetro | Valores | Uso |
| --- | --- | --- |
| `q` | texto | Busca en nombre, resumen, sede, ciudad y deporte. |
| `category` | categorías | Filtra por categoría. |
| `status` | `PUBLISHED`, `IN_PROGRESS`, `COMPLETED` | Filtra por estado público. |
| `format` | enum de formato | Filtra por formato. |
| `sort` | `date`, `aura`, `recent` | Ordena por fecha, premio o creación. |
| `page` | entero | Página, desde 1. |
| `limit` | 1 a 50 | Tamaño de página. Por defecto 12. |

### Crear torneo

```http
POST /api/tournaments
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Copa Cadejos 3x3",
  "summary": "Doce equipos, una cancha y cuatro horas de juego.",
  "description": "Torneo de básquet 3x3 con fase de grupos y eliminación directa.",
  "category": "deportes",
  "sport": "Básquet 3x3",
  "format": "GROUPS_THEN_PLAYOFF",
  "location": "Parque Cuscatlán, cancha 2",
  "city": "San Salvador",
  "startsAt": "2026-11-07T15:00:00.000Z",
  "registrationEndsAt": "2026-11-03T23:59:00.000Z",
  "maxParticipants": 16,
  "auraPrize": 2400,
  "rules": [
    "Equipos de 3 jugadores y hasta 1 suplente.",
    "Partidos a 10 minutos o 21 puntos."
  ],
  "cover": "court"
}
```

Formatos válidos:

- `SINGLE_ELIMINATION`
- `DOUBLE_ELIMINATION`
- `ROUND_ROBIN`
- `GROUPS_THEN_PLAYOFF`
- `SWISS`

La fecha de cierre debe ser anterior al inicio. El cupo mínimo es 4 y el máximo 128. El slug se genera a partir del nombre y se vuelve único automáticamente.

### Inscribirse

```http
POST /api/tournaments/copa-cadejos-3x3/register
Authorization: Bearer <token>
Content-Type: application/json

{
  "teamId": "cm..."
}
```

`teamId` es opcional. Si se envía, la sesión debe pertenecer al equipo. Una misma persona o equipo no puede tener dos inscripciones activas en el mismo torneo. Si el torneo está lleno o cerrado, responde `400`.

### Generar cuadro

```http
POST /api/tournaments/copa-cadejos-3x3/bracket
Authorization: Bearer <token>
Content-Type: application/json

{
  "force": false
}
```

- Requiere al menos dos inscripciones aceptadas.
- Todas las inscripciones deben tener equipo.
- Si ya existen partidos, responde `409` salvo que se envíe `force: true`.
- `force: true` borra los partidos y resultados anteriores.
- La siembra sigue el orden estándar y reparte los byes.
- Una ronda posterior se mantiene programada hasta que sus partidos alimentadores terminan.

Respuesta: lista de partidos con equipos y ganador.

## Partidos

| Método | Ruta | Auth | Descripción |
| --- | --- | --- | --- |
| `GET` | `/api/matches/:id` | No | Detalle público. |
| `PATCH` | `/api/matches/:id/start` | Sí | Marca el partido en juego; requiere organizador o admin. |
| `PATCH` | `/api/matches/:id/result` | Sí | Registra el marcador y avanza al ganador. |

Reportar resultado:

```json
{
  "score1": 21,
  "score2": 18
}
```

Reglas:

- No se permiten empates en eliminación directa.
- El equipo con mayor marcador avanza a la siguiente ronda.
- Cada jugador recibe 20 Aura por participar.
- Cada jugador del equipo ganador recibe 60 Aura adicionales.
- Si es la final, el torneo pasa a `COMPLETED` y se reparte el Aura del podio.
- Se actualizan estadísticas de equipo y jugador.

## Aura

| Método | Ruta | Auth | Descripción |
| --- | --- | --- | --- |
| `GET` | `/api/aura/leaderboard?limit=20` | No | Ranking público por Aura. Límite máximo 100. |
| `GET` | `/api/aura/me?page=1&limit=12` | Sí | Historial paginado de movimientos. |

El Aura se registra en un ledger (`AuraTransaction`). No se compra ni se transfiere.

Recompensas actuales:

| Acción | Aura |
| --- | --- |
| Inscripción a un torneo | +40 |
| Crear un equipo | +25 |
| Unirse a un equipo | +15 |
| Partido jugado | +20 |
| Victoria | +60 |
| Podio | `auraPrize` repartido entre el equipo ganador |

## Salud

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/api/health` | Estado del servicio y de la base de datos. |
| `GET` | `/api/health/ready` | Readiness para despliegues. |

Ejemplo:

```json
{
  "status": "ok",
  "service": "tornuti-api",
  "version": "1.0.0",
  "database": "up",
  "uptime": 42,
  "timestamp": "2026-10-21T19:42:45.000Z"
}
```

## Errores

Todas las excepciones pasan por un filtro global:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "El plazo de inscripción ya cerró",
  "path": "/api/tournaments/copa/register",
  "timestamp": "2026-10-21T19:42:45.000Z"
}
```

Códigos usados:

| Código | Significado |
| --- | --- |
| `400` | Datos inválidos, plazo cerrado, cupo completo o estado incompatible. |
| `401` | Token ausente, vencido o inválido. |
| `403` | La sesión no es propietaria del recurso. |
| `404` | Recurso inexistente o no público. |
| `409` | Conflicto de unicidad o cuadro ya existente. |
| `429` | Límite de solicitudes excedido. |
| `500` | Error interno; en producción no se exponen detalles de Prisma. |

## Rate limiting

- Límite global: 120 solicitudes por minuto por IP.
- Registro: 5 por minuto.
- Login: 10 por minuto.

En producción, si la API está detrás de un proxy, configura el proxy para conservar la IP real del cliente.
