# 🏆 TORNUTI

**Plataforma universal de torneos** con sistema de gamificación **Aura**.

Tornuti no está atado a ningún deporte: la comunidad crea sus propios nichos (eSports, fútbol, ajedrez, torneos de empresa...) y la plataforma se configura para cada uno.

---

## 📁 Estructura del proyecto

```
TORNUTI/
├── apps/
│   ├── web/                  # Frontend (Next.js 14 + Tailwind CSS)
│   │   ├── app/              # Páginas y rutas
│   │   ├── components/       # Componentes UI reutilizables
│   │   ├── lib/              # Utilidades y helpers
│   │   └── assets/svg/       # Iconos SVG premium
│   └── api/                  # Backend (NestJS + Prisma)
│       ├── src/              # Módulos (auth, user, tournament, team)
│       ├── prisma/           # Schema y servicios Prisma
│       └── .env.example      # Variables de entorno (copiar a .env)
├── docs/                     # Documentación del proyecto
│   ├── RESUMEN_EJECUTIVO.md
│   └── neon-setup/           # Guía para base de datos Neon (gratis)
├── scripts/                  # Scripts para lanzar el proyecto
│   ├── LANZAR.bat            # Verifica y lanza todo automáticamente
│   ├── INICIAR_PROYECTO.bat  # Menú para iniciar servidores
│   ├── start-dev.ps1         # Inicia ambos servidores (PowerShell)
│   └── start-frontend.js     # Inicia solo el frontend
└── package.json              # Workspace raíz (npm workspaces)
```

---

## 🚀 Cómo ejecutar

### Requisitos
- Node.js 18+ (ruta usada en scripts: `C:\nvm4w\nodejs\node.exe`)
- Base de datos Neon gratuita (ver `docs/neon-setup/README.md`)

### Opción A: Script automático
```cmd
scripts\LANZAR.bat
```
Verifica Node.js, copia `.env` si falta e inicia frontend + backend en ventanas separadas.

### Opción B: Manual
```cmd
:: Frontend (http://localhost:3000)
cd apps\web
npm install
npm run dev

:: Backend (http://localhost:3001/api)
cd ..\api
npm install
copy .env.example .env   :: luego edita DATABASE_URL
npm run db:generate
npm run db:push
npm run start:dev
```

---

## 🎨 Diseño

- **Modo oscuro** por defecto (estilo premium tipo Apple)
- **Color primario:** morado `#8B5CF6`
- **Acento salvadoreño:** azul `#1E40AF`
- Componentes animados: cards con glow, badges neon, transiciones suaves

## 💰 Costo

**$0** — Next.js, NestJS, Prisma y PostgreSQL (Neon free tier) son 100% gratuitos.

## 📦 Stack

| Capa       | Tecnología                          |
|------------|-------------------------------------|
| Frontend   | Next.js 14, React 18, Tailwind CSS  |
| Backend    | NestJS 11, Express                  |
| Base datos | PostgreSQL (Neon) + Prisma ORM      |
| Autentic.  | JWT + bcrypt                        |