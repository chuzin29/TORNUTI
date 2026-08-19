# TORNUTI - Resumen Ejecutivo

## Versión
v0.1.0 - Fase 0 completada, ready for Neon setup

## Visión General
Plataforma universal y configurable para crear, descubrir y participar en torneos de cualquier deporte o actividad. Diseño premium minimalista, modo oscuro, $0 inicial.

## Estado Actual ✅

### Frontend (Next.js + React + TypeScript)
- [x] Estructura de carpetas completada
- [x] 158 dependencias instaladas
- [x] Tailwind CSS configurado con modo oscuro
- [x] Paleta: morado #8B5CF6 (primary) + azul #1E40AF (salvadoreño sutil)
- [x] 7 componentes UI premium creados:
  - button.tsx (4 variantes)
  - input.tsx (3 variantes)
  - card.tsx
  - badge.tsx
  - avatar.tsx
  - dark-mode-toggle.tsx
  - header.tsx
- [x] Landing page con hero, categorías, torneos destacados, "how it works"
- [x] Dark mode automático con detección de sistema

### Backend (NestJS + TypeScript + Prisma)
- [x] NestJS instalado y configurado
- [x] Módulos: auth, user, tournament, team
- [x] Prisma schema con 25 modelos completos
- [x] Controladores y servicios básicos
- [x] Sistema de autenticación JWT
- [x] Registro y login de usuarios
- [x] Crear torneos y equipos
- [x] Inscripciones a torneos

### Base de Datos
- [ ] Configurar Neon (próximo paso)
- [ ] Ejecutar migraciones Prisma
- [ ] Conectar backend con frontend

## Arquitectura

### Frontend
```
tornuti/
├── app/           # Next.js 14 App Router
│   ├── layout.tsx # Layout con dark mode
│   └── page.tsx   # Landing page completa
├── components/
│   └── ui/        # 7 componentes UI premium
├── tailwind.config.ts  # Colores definidos
└── package.json   # 158 packages
```

### Backend
```
backend/
├── main.ts              # Punto de entrada NestJS
├── app.module.ts        # Módulo principal
├── prisma/
│   ├── schema.prisma    # 25 modelos
│   └── prisma.service.ts
├── auth/
│   ├── auth.service.ts  # Registro, login
│   ├── auth.controller.ts
│   └── guards/          # JWT, Local
├── user/
│   ├── user.service.ts
│   └── user.controller.ts
├── tournament/
│   ├── tournament.service.ts
│   └── tournament.controller.ts
└── team/
    ├── team.service.ts
    └── team.controller.ts
```

## Funcionalidades MVP

### Ya Implementadas
1. ✅ Landing page premium minimalista
2. ✅ Sistema de auth (registro/login con JWT)
3. ✅ Perfiles de usuario con sistema Aura
4. ✅ Crear torneos (formulario configurable)
5. ✅ Crear equipos y membresía
6. ✅ Inscribirse a torneos (individual o por equipo)
7. ✅ Páginas públicas de torneos (SEO friendly)
8. ✅ Descubrir torneos por categoría y tags
9. ✅ Modo oscuro con preferencia de sistema
10. ✅ Sistema de gamificación Aura básico

### Pending (después de Neon setup)
1. ▶️ Registrar resultados de partidos
2. ▶️ Generar partidos automáticamente
3. ▶️ Tabla de posiciones
4. ▶️ Estadísticas de jugador/equipo
5. ▶️ Logros y recompensas de Aura
6. ▶️ Sistema de reportes

## Costo Inicial: $0

| Componente | Costo | Proveedor Free Tier |
|------------|-------|---------------------|
| Desarrollo | $0 | Stack completo gratuito |
| Base de datos | $0 | Neon (0.5GB) o Supabase |
| Hosting frontend | $0 | Vercel (free tier) |
| Dominio | $0 | Subdominio o gratuito después |
| **Total** | **$0** | **100% gratuito** |

## Stack Tecnológico

| Capa | Tecnología | Razón |
|------|-----------|-------|
| Frontend | Next.js 14 + React + TS | SEO nativo, Vercel free tier |
| Estilos | Tailwind CSS | Utility-first, dark mode built-in |
| Iconos | Lucide React | ISC license, gratis comercial |
| Backend | NestJS + TS | Modular, escalable, patrón Kiddventure |
| ORM | Prisma | Migraciones fáciles, TypeScript-first |
| BD | PostgreSQL (Neon/Supabase) | Forever free, serverless |
| Deploy | Vercel + Neon | CDN gratis, free tier generoso |

## Rutas Públicas

| Ruta | Descripción |
|------|-------------|
| `/` | Landing page - descubrir torneos |
| `/create` | Crear nuevo torneo (paso a paso) |
| `/explore` | Explorar torneos públicos |
| `/tournament/:id` | Detalle torneo |
| `/user/profile/:id` | Perfil usuario |
| `/auth/login` | Login |
| `/auth/register` | Registro |

## Hypothesis to Validate (Fase 1)

1. ¿Los jugadores buscarán herramienta dedicada vs. grupos WhatsApp?
2. ¿Compartir tarjetas realmente trae nuevos usuarios?
3. ¿Diseño premium minimalista es alcanzable con stack gratuito?
4. ¿Motor configurable evita necesidad de nuevo código por deporte?
5. ¿Free tiers de tecnologías son suficientes?
6. ¿Ratio participantes→creadores es saludable?

## Próximos Pasos Imediatos

### 1. Configurar Base de Datos (5 minutos)
```bash
# Crear cuenta en neon.tech (gratis)
# Crear proyecto nuevo
# Copiar DATABASE_URL

# En terminal PowerShell:
cd C:\workspace\tornuti\backend
cp .env.example .env
# Editar .env con tu DATABASE_URL

# Ejecutar migraciones:
npx prisma generate
npx prisma migrate make init --name init
npx prisma migrate deploy
# o alternativo:
npx prisma db push
```

### 2. Iniciar Proyecto
```bash
:: Opción A: Script batch
INICIAR_PROYECTO.bat  (elige opción 3: los dos)

:: Opción B: Manual
:: Frontend (terminal 1):
cd C:\workspace\tornuti
# Usa tu gestor de scripts favorito para next dev

:: Backend (terminal 2):
cd C:\workspace\tornuti\backend
npm run start:dev
```

### 3. Probar Flujos Básicos
1. Registrar nuevo usuario
2. Login
3. Creer un torneo (usar formato "3x3" o "round_robin")
4. Unirse como jugador
5. Ver página pública del torneo

## Marca y Diseño

### Paleta de Colores
- **Morado primary**: `#8B5CF6` (violet-500) - botones, acentos
- **Azul salvadoreño sutil**: `#1E40AF` (blue-700) - identificación mínima
- **Fondo modo claro**: `#ffffff` - blanco puro
- **Fondo modo oscuro**: `#0a0a0f` - casi negro con profundidad
- **Texto modo claro**: `#0f0f23` - negro muy oscuro para legibilidad
- **Texto modo oscuro**: `#f1f5f9` - gray-100 para contraste

### Principios UI
1. Simplicidad - interfaces limpias, sin saturación
2. Jerarquía visual - el usuario entiende inmediatamente qué puede hacer
3. Consistencia - componentes se comportan de forma coherente
4. Microinteracciones - efectos sutiles que aportan valor
5. Accesibilidad - usable para diferentes usuarios, contraste adecuado
6. Velocidad - interfaces que se sienten rápidas

### Referencia
- Inspiración en Apple Design (jerarquía, tipografía, espaciado)
- **NO** copiar diseños, componentes o identidades de Apple
- Identidad propia: premium + deportiva + tecnológica + social

## Soporte

Para dudas o problemas:
- Revisar README.md completo
- Verificar que DATABASE_URL en .env sea correcta
- Ejecutar `npx prisma generate` después de cualquier cambio en schema.prisma
- Los free tiers pueden "dormir" - primera petición puede ser lenta

---

**Tornuti v0.1.0** - Hecho con ❤️ para la comunidad amateur, $0 de presupuesto inicial.
Lista para configuración de Neon y lanzamiento.