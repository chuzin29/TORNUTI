import { NextResponse, type NextRequest } from "next/server"
import { createServerSession } from "@/lib/supabase/server"

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ")

/** Además del escudo de cabeceras, el middleware mantiene las sesiones
 *  de Supabase frescas: valida el JWT con `getUser` y deja que el cliente
 *  de servidor reparta cookies renovadas en la respuesta. */
export async function middleware(request: NextRequest) {
  const hasAuthCookies = request.cookies
    .getAll()
    .some((c) => c.name.includes("sb-"))

  const { supabase, supabaseResponse } = createServerSession(request)
  if (hasAuthCookies) {
    const { data } = await supabase.auth.getUser()
    void data
  }

  const response = supabaseResponse
  if (process.env.NODE_ENV === "production") {
    response.headers.set("Content-Security-Policy", csp)
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    )
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp|woff2)$).*)",
  ],
}
