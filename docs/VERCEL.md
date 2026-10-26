# Vercel — subir TORNUTI gratis, paso a paso

Todo el stack de la web es serverless-friendly (Next.js + Supabase):
no necesita servidor propio, ni base de datos bonificada, ni IMAP.
El plan gratuito de Vercel es más que suficiente para arrancar.

## 1. Subir el código a GitHub

El repo ya tiene remoto (`github.com/chuzin29/TORNUTI`), solo faltan las
credenciales en esta máquina. Dos caminos:

**A. Token en el navegador (recomendado)** — en [github.com/settings/tokens](https://github.com/settings/tokens)
crea un *token clásico* con alcance `repo` y pégalo cuando git lo pida.
Desde la terminal donde corre este agente pídele: “empuja con mi token”
(y pégalo). Alternativa: instala la CLI de GitHub y corre `gh auth login`.

**B. SSH** — genera una llave (`ssh-keygen -t ed25519`), súbela en
<https://github.com/settings/keys> y cambia el remoto:

```sh
git remote set-url origin git@github.com:chuzin29/TORNUTI.git
```

## 2. Importar el proyecto en Vercel (gratis)

1. [vercel.com/new](https://vercel.com/new) → continúa con GitHub →
   importa `chuzin29/TORNUTI`.
2. **Root directory**: `apps/web` (el monorepo tiene apps/web como
   aplicación Next.js; los scripts ya no necesitan cambios).
3. Framework preset: **Next.js** (detectado solo). No toques Build
   Command ni Output Directory — `npm run build` es el estándar.
4. Antes de pulsar *Deploy*, abre **Environment Variables** y agrega las
   dos claves públicas que viven en `apps/web/.env.local`:

   | Nombre | Valor |
   | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://cnizavwjsztosgqwtzas.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(la clave anon del proyecto)* |

   Son claves públicas (la web entera las trae en el navegador), seguras
   para el frontend. Nunca subas ahí la `service_role`.
5. Deploy. En ~1 minuto tendrás `https://tornuti-<algo>.vercel.app`.

> Si te aparecen advertencias de “lint budget” o “telemetry”, ignóralas:
> la compilación de producción ya está verificada localmente (todas las
> rutas estáticas, `/torneos/[slug]` con SSG de 12 fichas y middleware).

## 3. Supabase: autorizar el dominio nuevo (una sola vez)

Las rutas de auth solo aceptan devolver cookies a dominios de confianza:

1. Panel de Supabase → **Authentication → URL Configuration**.
2. **Site URL**: `https://tornuti-<algo>.vercel.app` (luego tu dominio).
3. **Redirect URLs** → agrega:
   - `https://tornuti-<algo>.vercel.app/auth/callback`
   - `http://localhost:3000/auth/callback` (para seguir desarrollando).

Sin esto, Google y la confirmación por correo no regresan bien desde
producción.

## 4. Google OAuth (si ya activaste el proveedor)

1. Consola de Google Cloud → *Credentials → OAuth client ID (Web)*:
   en *Authorized redirect URIs* agrégale la línea de producción:
   `https://cnizavwjsztosgqwtzas.supabase.co/auth/v1/callback`
   (es la misma URI que ya usa Supabase; Google acepta varias, el dominio
   del callback no cambia al desplegar Vercel).
2. No hay que tocar nada más en Vercel: el flujo vive en Supabase.

## 5. Chequeo post-deploy (2 minutos)

```sh
DOM=tornuti-<algo>.vercel.app
curl -s -o /dev/null -w "%{http_code}\n" https://$DOM/                 # 200
curl -s -o /dev/null -w "%{http_code}\n" https://$DOM/torneos/copa-cadejos-3x3   # 200
curl -s -o /dev/null -w "%{http_code}\n" https://$DOM/auth/callback    # 307 (redirige a la portada)
```

Y en el navegador: crear cuenta con un correo real → confirmar desde el
buzón → entrar → inscribirse a un torneo. El botón de Google debe mandar
al consentimiento cuando el proveedor esté activado.
