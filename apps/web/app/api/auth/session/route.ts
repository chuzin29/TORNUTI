import { NextResponse, type NextRequest } from "next/server"
import { copySessionCookies, createServerSession } from "@/lib/supabase/server"

/** Puente de sesión para el navegador: con las cookies `sb-…` (colocadas
 *  por /auth/callback después de intercambiar el código de Google) este
 *  endpoint revela al cliente quién está firmado y, de paso, renueva las
 *  cookies si el token está por vencer. */
export async function GET(request: NextRequest) {
  const { supabase, supabaseResponse } = createServerSession(request)

  const { data } = await supabase.auth.getUser()
  const user = data.user

  const res = NextResponse.json(
    user
      ? {
          user: {
            id: user.id,
            email: user.email,
            user_metadata: {
              full_name:
                user.user_metadata?.full_name ?? user.user_metadata?.name,
            },
          },
        }
      : { user: null },
  )

  copySessionCookies(supabaseResponse, res)
  return res
}
