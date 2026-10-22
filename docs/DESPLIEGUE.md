# Despliegue gratuito

La combinación recomendada no cuesta dinero:

- **Neon** para PostgreSQL.
- **Render** para la API NestJS.
- **Vercel** para la web Next.js.

Los tres servicios tienen planes gratuitos. Tienen límites y suspensiones por inactividad; para una demo o un proyecto comunitario pequeño son suficientes. Revisa las condiciones vigentes antes de usar datos reales.

## 1. Base de datos en Neon

1. Crea una cuenta en [neon.tech](https://neon.tech).
2. Crea un proyecto y una base llamada `tornuti`.
3. Copia dos cadenas de conexión:
   - **Pooled connection**: va en `DATABASE_URL`.
   - **Direct connection**: va en `DIRECT_URL`.
4. Agrega `?sslmode=require` si el proveedor no lo incluye.

Prisma usa `DATABASE_URL` en la aplicación y `DIRECT_URL` para migraciones. Si el pooler no admite migraciones, `DIRECT_URL` resuelve el problema.

Prueba local contra Neon:

```bash
cd apps/api
DATABASE_URL="postgresql://..." DIRECT_URL="postgresql://..." npx prisma migrate deploy
DATABASE_URL="postgresql://..." DIRECT_URL="postgresql://..." npm run db:seed
```

El seed es opcional y crea cuentas de demostración. No lo ejecutes en una base con datos reales.

## 2. API en Render

El repositorio incluye `render.yaml`. También puedes crear el servicio a mano.

### Con blueprint

1. En Render, elige **New > Blueprint**.
2. Conecta `https://github.com/chuzin29/TORNUTI`.
3. Render lee `render.yaml`.
4. Completa las variables marcadas como secretas:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `CORS_ORIGIN`
5. `JWT_SECRET` se genera automáticamente. Si lo defines a mano, usa una cadena larga y aleatoria.

### Manual

| Campo | Valor |
| --- | --- |
| Runtime | Node |
| Plan | Free |
| Build command | `npm ci --include=dev && npm run db:deploy && npm run build:api` |
| Start command | `npm run start:prod --workspace @tornuti/api` |
| Health check | `/api/health` |
| Node version | 20 |

Variables:

```text
NODE_ENV=production
NODE_VERSION=20
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
JWT_SECRET=<cadena aleatoria de al menos 32 caracteres>
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://tu-app.vercel.app
```

El build ejecuta `prisma migrate deploy`, por lo que cada despliegue aplica migraciones pendientes. El seed no se ejecuta automáticamente.

Para cargar el contenido de demostración una sola vez, abre la Shell del servicio o ejecuta desde tu máquina con las credenciales de producción:

```bash
cd apps/api
DATABASE_URL="postgresql://..." DIRECT_URL="postgresql://..." npm run db:seed
```

### Verificación

```bash
curl https://tu-api.onrender.com/api/health
curl https://tu-api.onrender.com/api/tournaments
```

La documentación Swagger queda en `https://tu-api.onrender.com/api/docs`.

El plan gratuito de Render suspende el servicio tras un periodo de inactividad. La primera solicitud puede tardar en responder.

## 3. Web en Vercel

1. Importa el repositorio en Vercel.
2. Configura:
   - **Framework preset**: Next.js.
   - **Root Directory**: `apps/web`.
   - **Build command**: `npm run build`.
   - **Install command**: `npm ci`.
3. Agrega la variable:

```text
NEXT_PUBLIC_API_URL=https://tu-api.onrender.com/api
```

4. Despliega.

Vercel detecta el monorepo y ejecuta la instalación desde la raíz del repositorio. La carpeta `apps/web` contiene el `package.json` del workspace y la aplicación Next.

Si prefieres no usar Root Directory, deja la raíz del repositorio y configura:

```text
Build command: npm run build:web
Output directory: apps/web/.next
```

La primera opción es más simple y respeta la detección automática de Next.js.

### CORS

La API solo acepta los orígenes configurados en `CORS_ORIGIN`. Después de desplegar la web, actualiza esa variable en Render con el dominio final, por ejemplo:

```text
CORS_ORIGIN=https://tornuti.vercel.app
```

Puedes separar varios orígenes con coma. Si usas dominios de vista previa de Vercel, agrégalos explícitamente o limita las pruebas al dominio de producción.

## 4. Variables del frontend

Solo hay una variable pública:

| Variable | Ejemplo | Efecto |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `https://api.ejemplo.com/api` | Activa el login y registro contra la API real. |

Si no se define, la web funciona en modo de demostración local. Esa es la opción por defecto y no requiere backend.

No pongas secretos en variables `NEXT_PUBLIC_*`. Cualquier persona puede leerlas desde el navegador.

## 5. Alternativa local con Docker

```bash
docker compose up -d db
cd apps/api
cp .env.example .env
# Ajusta DATABASE_URL y DIRECT_URL si hace falta.
cd ../..
npm run db:deploy
npm run db:seed
npm run dev
```

El contenedor escucha en `localhost:5432` con usuario, contraseña y base `tornuti`. Los datos quedan en el volumen `tornuti-db-data`.

Para detenerlo:

```bash
docker compose down
```

Para borrar también los datos:

```bash
docker compose down -v
```

## 6. Checklist de producción

- [ ] `JWT_SECRET` es único, largo y no está en el repositorio.
- [ ] `CORS_ORIGIN` apunta solo a dominios propios.
- [ ] La base tiene migraciones aplicadas y un respaldo.
- [ ] No se ejecutó el seed con contraseñas de demostración en una base real.
- [ ] `/api/health` y `/api/health/ready` responden.
- [ ] Swagger está protegido o deshabilitado si no debe ser público.
- [ ] La web carga con HTTPS y las cabeceras de seguridad activas.
- [ ] Se revisó el límite de peticiones detrás del proxy.
- [ ] El plan gratuito y sus límites son aceptables para el uso previsto.

## 7. Costos

El proyecto no incluye pagos, comisiones ni servicios obligatorios de pago. Los límites gratuitos de Neon, Render y Vercel pueden cambiar. Si el proyecto crece, las alternativas son un VPS propio, PostgreSQL administrado o un servicio de contenedores; la aplicación no depende de un proveedor específico.
