import { NextResponse, type NextRequest } from "next/server"
import { copySessionCookies, createServerSession } from "@/lib/supabase/server"

/** Llegada del OAuth de Google (y de confirmaciones de correo que
 *  `signInWithOAuth` dispara): intercambia el `code` por sesión y regresa
 *  — hacia `redirectTo` — con las cookies `sb-…` ya colocadas en la
 *  respuesta. Con el middleware refrescando sesiones, el usuario queda
 *  firmado también para el servidor. */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const redirectTo = searchParams.get("redirect_to") || "/"

  const { supabase, supabaseResponse } = createServerSession(request)

  if (code) {
    try {
      await supabase.auth.exchangeCodeForSession(code)
    } catch {
      // Código reusado o expirado: se regresa a la portada sin sesión.
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  const response = NextResponse.redirect(new URL(redirectTo, request.url))
  copySessionCookies(supabaseResponse, response)
  return response
}
