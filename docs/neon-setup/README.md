# Tornuti — Configuración de Base de Datos Neon (Free Tier)

## Paso 1: Crear cuenta en Neon
1. Ve a https://neon.tech y crea una cuenta gratuita
2. Confirma tu email

## Paso 2: Crear un nuevo proyecto
1. En el panel de Neon, haz clic en "New Project"
2. Nombre: `tornuti`
3. Región: Elige la más cercana a tu ubicación
4. Haz clic en "Create project"

## Paso 3: Obtener la conexión (DATABASE_URL)
1. En tu proyecto Neon, haz clic en "Connect"
2. Selecciona "Prisma" o "Node.js"
3. Copia la cadena de conexión que se muestra

La URL tendrá este formato:
```
postgresql://ep-nombre_usuer:password@ep-host.neon.tech/neondb?sslmode=require
```

## Paso 4: Configurar el .env
1. Copia el archivo `.env.example`:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Edita `backend/.env` y pega tu DATABASE_URL:
   ```env
   DATABASE_URL="postgresql://ep-nombre_usuario:tu_password@ep-host.neon.tech/neondb?sslmode=require"
   
   JWT_SECRET="cambia-este-secreto-por-algo-muy-seguro-y-largo-minimo-32-caracteres"
   BCRYPT_SALT=10
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

## Paso 5: Ejecutar migraciones Prisma
Desde la terminal en `backend/`:

```bash
# 1. Generar el cliente Prisma
npx prisma generate

# 2. Crear y aplicar migración inicial
npx prisma migrate make init --name init
npx prisma migrate deploy

# 3. (Alternativo y más rápido) Empujar directamente
npx prisma db push
```

## Paso 6: Verificar conexión
1. Inicia el backend: `npm run start:dev` desde backend/
2. Deberías ver: "📊 Prisma connected to database"
3. Prueba la API en http://localhost:3001/api

## 💡 Tips Importantes

### Límites del Free Tier Neon
- **Almacenamiento**: 0.5 GB (suficiente para MVP)
- **Proyectos**: 1 proyecto gratuito (puedes archivar después)
- **Transferencia**: Generosa para un pequeño proyecto
- **Tiempo de inactividad**: El proyecto "duerme" después de 5 minutos de inactividad (reconexión automática)

### Solución si el proyecto duerme
El primer request después del "sueño" puede tardar 1-2 segundos en reconectarse. Esto es normal y esperado en el free tier.

### Alternativa: Supabase
Si prefieres Supabase en lugar de Neon:
1. Ve a https://supabase.com y crea cuenta gratuita
2. Crea un nuevo proyecto
3. Ve a Settings → Database → Connection string
4. Copia la URL `postgresql://postgres:password@db.eu-west-1.supabase.com:5452/postgres`
5. Úsala en backend/.env

Ambas opciones son compatibles con Prisma y el código de Tornuti.

## Verificación Post-Migración

Después de ejecutar las migraciones, ejecuta:

```bash
npx prisma migrate status
```

Deberías ver algo como:
```
database: neon

Migrations:
  applied: 2024202600000000_initial migration
```

## Estructura Esperada después de las Migraciones

```
backend/
├── prisma/
│   ├── schema.prisma     # Ya creado - 25 entidades
│   ├── migrations/
│   │   └── 2024202600000000_initial/
│   │       └── migration.sql
│   └── prisma.client/  # Generado por npx prisma generate
├── .env                 # Tu configuración con DATABASE_URL
└── .env.example         # Ejemplo para otros desarrolladores
```

## Solución de Problemas Comunes

### Error: "P1001: Cannot connect to database"
- Verifica que DATABASE_URL sea correcta
- Asegúrate de que el proyecto Neon esté activo
- Confirma que el usuario/tiene permisos

### Error: "P1014: Cannot create index"
- El free tier de Neon no soporta ciertos tipos de índices complejos
- El schema de Tornuti está optimizado para free tier, esto no debería ocurrir

### Error: "Table already exists"
- Ejecuta `npx prisma db push --reset` para recrear todas las tablas
- **Ojo**: Esto borrará datos si ya existían

### Conexión lenta después de inactividad
- Es normal en free tier de Neon
- La primera petición tardará 1-2 segundos extra
- Las siguientes serán normales

## Costo
- **Neon Free Tier**: $0/mes Forever
- **Tornuti completo**: $0 inicial
- **Vercel hosting**: $0/mes (plan Hobby gratuito)
- **Costo total inicio**: $0