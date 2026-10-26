/**
 * Credenciales públicas de Supabase, compartidas por cliente y servidor.
 *
 * La llave "publishable" (`sb_publishable_…`) es el formato nuevo del
 * panel; la antigua JWT "anon" se acepta como respaldo por si el
 * proyecto todavía no migró. Ambas son seguras para el navegador.
 */
export const SUPABASE_URL = (
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cnizavwjsztosgqwtzas.supabase.co"
).replace(/\/+$/, "")

export const SUPABASE_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_tJZWQWXkE13tQmuoZMUdYQ_Z8Fnhbvf"

/** ¿Hay credenciales por entorno? Sin ellas, el frontend —igual— apunta
 *  al proyecto demo que vive en el código. */
export function hasSupabaseCreds(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  )
}
