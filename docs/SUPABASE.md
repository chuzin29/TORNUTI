# Supabase — conexión, cuentas y correo

El frontend ya está enchufado a Supabase con las claves públicas del
proyecto (`apps/web/.env.local`). Este documento explica qué hace cada
pieza, qué queda del lado del panel de Supabase y cómo probar todo.

## Qué está conectado

| Pieza | Estado | Dónde |
| --- | --- | --- |
| Cliente de navegador (`@supabase/ssr`) | funcionando | `components/providers/supabase-provider.tsx` |
| Login con correo + contraseña | funcionando con RLS del panel | `components/providers/tornuti-provider.tsx` |
| Registro con correo (exige confirmación) | funcionando | mismo archivo |
| Google OAuth | código listo; falta activar el proveedor en el panel | `app/auth/callback/route.ts` |
| Mensajes de error claros en español | funcionando | `authFriendly()` en `tornuti-provider.tsx` |
| Esquema de base de datos | espera despliegue del SQL | `scripts/supabase-schema.sql` |

## Base de datos (una sola vez)

1. Entra a [supabase.com](https://supabase.com) → proyecto → **SQL Editor**.
2. Abre `scripts/supabase-schema.sql`, copia todo el contenido y pégalo.
3. Pulso en **Run**. Con eso quedan creadas `profiles`, `teams`,
   `team_members`, `tournaments`, `registrations`, `matches`,
   `aura_entries` y `achievements`, con RLS activo, disparadores de
   perfil y sincronía de Aura, más tres torneos de demostración.
4. Para verificar: **Table Editor** → las tablas aparecen con sus datos
   demo. En el navegador de la web, la agenda sigue sirviendo del JSON
   local hasta que la API se mueva a Postgres (siguiente fase).

## Correo de confirmación

El proyecto tiene `email auth` activo con `mailer_autoconfirm: false`
(Verificación de correo obligatoria). Consecuencia honesta del diseño:

- Al crear cuenta, Supabase envía un correo de confirmación.
- El formulario dice: "Cuenta creada: confirma tu correo para activar el
  acceso." — no se finge sesión si la cuenta no está confirmada.
- Para probar rápido sin esperar el correo: **Authentication →
  Sign In / Up → Email → Confirmar autoconfirmar: activar** (solo para
  desarrollo; en producción se recomienda dejar la confirmación).

Si los correos no llegan (el plan gratuito usa un remitente limitado), se
puede activar SMTP propio en **Project Settings → Authentication → SMTP
Settings** y poner datos de un proveedor de correo real.

## Google OAuth (falta tu gesto en el panel)

El código ya realiza el flujo completo (`signInWithOAuth` con
`redirectTo: {origen}/auth/callback`); el callback intercambia el código
por sesión y deja cookies. El proveedor hoy está **desactivado** en el
panel, por eso el botón de Google muestra un aviso amigable mientras
trabajas. Para activarlo:

1. Consola de [Google Cloud](https://console.cloud.google.com) → crea (o
   reutiliza) un proyecto → **APIs & Services → Credentials → OAuth
   client ID** → tipo *Web application*.
2. En *Authorized redirect URIs* agrega:
   `https://cnizavwjsztosgqwtzas.supabase.co/auth/v1/callback`
3. Copia *Client ID* y *Client secret*.
4. En Supabase: **Authentication → Providers → Google** (hoy aparece
   desmarcado) → pega las credenciales → **Save**.
5. Prueba: botón "Continúa con Google" en `/login` o `/registro` →
   te manda a Google → consentimiento → regresa por `/auth/callback` →
   la capa de sesión local se sincroniza al cargarse el dashboard.

## Endpoint de la API de NestJS

`NEXT_PUBLIC_API_URL` está dejado como cadena vacía a propósito: si
incluyera `http://localhost:3000` (el mismo puerto de la web), cada intento
de sesión golpearia al propio Next y tronaría con 404 — esos eran los
errores de backend que se veían. En cuanto la API corra en `:3001`, se
pone `NEXT_PUBLIC_API_URL=http://localhost:3001` y el proveedor prefiere
esa API sobre Supabase (la decisión es de configuración, no de código).

## Pruebas rápidas desde el shell

```sh
KEY=$(grep -o 'NEXT_PUBLIC_SUPABASE_ANON_KEY=.*' apps/web/.env.local | cut -d= -f2)
REF=$(grep -o 'https://[^ ]*supabase.co' apps/web/.env.local | head -1)

# servicio vivo
curl -s -o /dev/null -w "%{http_code}\n" -H "apikey: $KEY" "$REF/auth/v1/health"

# proveedores y confirmaciones activos
curl -s -H "apikey: $KEY" "$REF/auth/v1/settings" | head -c 500
```
