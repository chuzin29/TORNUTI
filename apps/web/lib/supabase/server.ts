import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { type NextRequest } from "next/server"

export function createClient(request: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cnizavwjsztosgqwtzas.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbG...y59s",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(
          cookiesToSet: { name: string; value: string; options: CookieOptions }[],
        ) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
          })
        },
      },
    }
  )
}
