"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { BrandMark } from "@/components/brand"
import { Input } from "@/components/ui/input"
import StretchyButton from "@/components/StretchyButton"
import { useToast } from "@/components/providers/toast-provider"
import { useTornuti } from "@/components/providers/tornuti-provider"
import { getSupabaseClient, isGoogleEnabled } from "@/components/providers/supabase-provider"
import { Loader2 } from "lucide-react"

type Mode = "login" | "register"

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path fill="#4285F4" d="M23.44 12.18c0-.73-.07-1.44-.2-2.14H12v4.1h6.47c-.26 1.37-1.05 2.61-2.14 3.42v3.02h2.6c2.2-1.92 3.56-4.77 3.56-8.42Z"/>
      <path fill="#34A853" d="M12 24c3.24 0 5.98-1.05 7.93-2.82l-3.55-3.55c-.5-.5-.95-.77-1.39-.77H3.52C3.08 16.6 6.32 13.6 10.2 13.6c2.04 0 3.96.6 5.54 1.64l3.34-3.36Z"/>
      <path fill="#FBBC05" d="M5.2 12.58c-.4-1.01-.64-2.1-.64-3.24 0-3.18 2.58-5.76 5.76-5.76 1.14 0 2.17.34 3.02.92l3.22-3.22C12.74 3.74 11.52 3 10.2 3 6.32 3 3.08 6.4 3.08 10.4 3.08 14.4 6.4 17.6 10.6 17.6c2.2 0 4.17-.8 5.71-2.16l3.4 3.43C17.26 19.38 15.06 21 12 21Z"/>
      <path fill="#EA4335" d="M12 5.99c1.62 0 3.06.56 4.2 1.73l3.35-3.36C16.97 2.16 14.4 1 12 1 6.32 1 3.08 4.4 3.08 9.6 3.08 13.6 6.32 16.6 10.2 16.6c2.04 0 3.96-.6 5.54-1.64l3.35 3.36C17.06 17.84 14.62 19 12 19Z"/>
    </svg>
  )
}

function EyeIcon({ off }: { off: boolean }) {
  return off ? (
    <svg viewBox="0 0 18 18" className="h-4 w-4" fill="none" aria-hidden="true">
      <path d="M2 9s2.6-4.5 7-4.5S16 9 16 9s-2.6 4.5-7 4.5S2 9 2 9Z" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="9" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  ) : (
    <svg viewBox="0 0 18 18" className="h-4 w-4" fill="none" aria-hidden="true">
      <path d="M2 9s2.6-4.5 7-4.5S16 9 16 9s-2.6 4.5-7 4.5S2 9 2 9Z" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="9" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.4" />
      <path d="m3 15 12-12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export function AuthForm({ mode, redirectTo }: { mode: Mode; redirectTo?: string }) {
  const router = useRouter()
  const { login, registerAccount, isDemo } = useTornuti()
  const { push } = useToast()
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  const isRegister = mode === "register"

  const handleGoogle = async () => {
    setError("")
    try {
      setLoading(true)
      /* Primero se pregunta si el proyecto tiene el proveedor activo: con
         Google apagado en el panel, `signInWithOAuth` no falla — te manda a
         una página de JSON crudo de Supabase. Se corta antes, con mensaje. */
      const google = await isGoogleEnabled()
      if (google === false) {
        setError(
          "Google todavía no está activado en el proyecto de Supabase. Entra con tu correo y contraseña — todo lo demás funciona igual.",
        )
        setLoading(false)
        return
      }
      const supabase = getSupabaseClient()
      const origin =
        typeof window === "undefined" ? "" : window.location.origin
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${origin}/auth/callback` },
      })
      if (error) throw error
      /* signInWithOAuth navega por su cuenta al consentimiento de Google. */
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : ""
      if (/unsupported provider|provider not found|disabled/i.test(message)) {
        setError(
          "Google todavía no está activado en el proyecto de Supabase. Entra con tu correo y contraseña — todo lo demás funciona igual.",
        )
      } else {
        setError(
          message || "No se pudo iniciar sesión con Google. Intenta de nuevo.",
        )
      }
      setLoading(false)
    }
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")
    setLoading(true)
    const result = isRegister
      ? await registerAccount(name.trim(), email.trim(), password)
      : await login(email.trim(), password)
    setLoading(false)

    if (!result.ok) {
      setError(result.error ?? "No se pudo completar la operación.")
      return
    }

    push({
      title: isRegister ? "Cuenta creada" : "Sesión iniciada",
      description: "Ya puedes inscribirte y publicar torneos.",
      tone: "success",
    })
    const safeRedirect = redirectTo && redirectTo.startsWith("/") ? redirectTo : "/dashboard"
    router.push(safeRedirect)
    router.refresh()
  }

  return (
    <div className="grid min-h-[calc(100vh-10rem)] lg:grid-cols-[0.92fr_1.08fr]">
      <aside className="relative hidden overflow-hidden border-r border-line bg-foreground p-10 text-background lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute inset-0 opacity-[0.14]" aria-hidden="true">
          <svg viewBox="0 0 400 500" className="h-full w-full" fill="none">
            <path d="M40 80h70v90h80v100h80v110h90" stroke="currentColor" strokeWidth="2" />
            <path d="M40 420h70v-90h80v-100h80V120h90" stroke="currentColor" strokeWidth="2" strokeDasharray="6 8" />
            <circle cx="270" cy="120" r="34" stroke="currentColor" strokeWidth="2" />
            <rect x="340" y="360" width="26" height="26" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>

        <div className="relative flex items-center gap-2.5">
          <BrandMark className="h-9 w-9 text-accent" />
          <span className="display text-2xl uppercase leading-none tracking-[-0.03em]">Tornuti</span>
        </div>

        <div className="relative max-w-md">
          <h2 className="display text-4xl leading-[0.98]">
            La cuenta detrás del marcador.
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-background/65">
            Un solo lugar para tus inscripciones, tus equipos y el Aura que has
            ganado jugando.
          </p>
          <ul className="mt-8 space-y-3 border-t border-background/20 pt-6">
            {[
              "Inscripciones y cupos confirmados.",
              "Historial de Aura por temporada.",
              "Torneos publicados y equipos a la mano.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-background/75">
                <svg viewBox="0 0 14 14" className="mt-0.5 h-4 w-4 shrink-0 text-accent" fill="none" aria-hidden="true">
                  <path d="m2.5 7 3 3 6-6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-2xs text-background/45">
          Proyecto de código abierto. Sin planes de pago ni comisiones.
        </p>
      </aside>

      <section className="flex items-center justify-center px-5 py-12 sm:px-10 lg:px-14">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 lg:hidden">
            <BrandMark className="h-8 w-8 text-primary" />
            <span className="display text-xl uppercase leading-none tracking-[-0.03em]">Tornuti</span>
          </div>

          <h1 className="display mt-6 text-4xl leading-[1.02] lg:mt-0">
            {isRegister ? "Crea tu cuenta" : "Entra a tu cuenta"}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {isRegister
              ? "Tarda menos que llenar una planilla. "
              : "Accede con tu correo y contraseña. "}
            <span className="font-semibold">
              {isRegister ? "Llena tus datos para empezar." : "Tu cuenta guarda inscripciones, equipos y Aura."}
            </span>
          </p>

          {error && (
            <div className="mt-4 rounded-md border border-danger/40 bg-danger/10 px-4 py-3 text-sm font-medium text-danger" role="alert">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="focus-ring mt-6 flex w-full items-center justify-center gap-3 rounded-full border border-line bg-surface px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50"
          >
            <GoogleMark />
            <span>Continúa con Google</span>
          </button>

          <div className="mt-4 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-line" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider text-muted-foreground">
              <span className="bg-background px-3">o con correo</span>
            </div>
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
            {isRegister && (
              <Input
                label="Nombre completo"
                name="nombre"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                placeholder="Valeria Rivas"
                required
              />
            )}

            <Input
              label="Correo electrónico"
              name="correo"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              placeholder="tucorreo@ejemplo.com"
              required
            />

            <div>
              <label htmlFor="password" className="field-label">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  placeholder={isRegister ? "Mínimo 8 caracteres" : "Tu contraseña"}
                  className="field pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="focus-ring absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  aria-pressed={showPassword}
                >
                  <EyeIcon off={!showPassword} />
                </button>
              </div>
            </div>

            <StretchyButton
              type="submit"
              size="lg"
              className="mt-1 w-full [&>.stretch-btn]:w-full"
              disabled={loading}
              isLoading={loading}
              label={isRegister ? "Crear cuenta" : "Entrar"}
            />
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            {isRegister ? "¿Ya tienes cuenta? " : "¿Todavía no tienes cuenta? "}
            <Link href={isRegister ? "/login" : "/registro"} className="font-semibold text-primary hover:underline">
              {isRegister ? "Entra aquí" : "Crea una gratis"}
            </Link>
          </p>

          {isDemo ? (
            <div className="mt-6 border border-line bg-elevated/60 px-3.5 py-3">
              <p className="text-2xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Modo demostración</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Usa cualquier correo válido y una contraseña de {isRegister ? "8" : "6"}+ caracteres.
                La cuenta se guarda solo en este navegador.
              </p>
            </div>
          ) : null}

          <p className="mt-8 border-t border-line pt-4 text-2xs leading-relaxed text-muted-foreground">
            Al continuar aceptas los{" "}
            <Link href="/terminos" className="underline underline-offset-2 hover:text-foreground">
              términos
            </Link>{" "}
            y la{" "}
            <Link href="/privacidad" className="underline underline-offset-2 hover:text-foreground">
              política de privacidad
            </Link>
            . No pedimos datos de pago.
          </p>
        </div>
      </section>
    </div>
  )
}
