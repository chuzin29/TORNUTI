import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { SUPABASE_PUBLIC_KEY, SUPABASE_URL } from "@/lib/supabase/keys"

type CookieSetter = { name: string; value: string; options?: CookieOptions }[]

/** Cliente de servidor con el patrón oficial del middleware de @supabase/ssr:
 *
 *  - lee las cookies del request,
 *  - cada vez que Supabase reparta (o renueve) cookies de sesión, las
 *    escribe en el request (para seguir allí en esta misma petición) y
 *    también en una `NextResponse` que el llamador acabará regresando,
 *    asegurando que el navegador reciba la sesión renovada.
 *
 *  El llamador decide la respuesta final (redirect, JSON…); copia de
 *  `supabaseResponse.cookies` lascookies que Supabase repartió.
 */
export function createServerSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet: CookieSetter) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value)
        })
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options)
        })
      },
    },
  })

  return { supabase, supabaseResponse }
}

/** Copia todas las cookies acumuladas a una respuesta terminada. */
export function copySessionCookies(
  from: NextResponse,
  to: NextResponse,
): void {
  for (const cookie of from.cookies.getAll()) {
    to.cookies.set(cookie)
  }
}
