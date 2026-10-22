"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BrandMark } from "@/components/brand"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/providers/toast-provider"
import { useTornuti } from "@/components/providers/tornuti-provider"
import { cn } from "@/lib/utils"
<<<<<<< HEAD
import { Loader2, Google, Mail, Lock, Eye, EyeOff } from "lucide-react"
=======
>>>>>>> origin/main

type Mode = "login" | "register"

export function AuthForm({ mode, redirectTo }: { mode: Mode; redirectTo?: string }) {
  const router = useRouter()
  const { login, registerAccount, isDemo } = useTornuti()
  const { push } = useToast()
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirm, setConfirm] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  const isRegister = mode === "register"

<<<<<<< HEAD
  const handleGoogle = async () => {
    setError("")
    try {
      setLoading(true)
      const supabase = (window as any).__SUPABASE_CLIENT__
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithGoogle()
        if (error) throw error
        if (data?.url) {
          window.location.href = data.url
        }
      }
    } catch (err: any) {
      setError(err.message || "No se pudo iniciar sesión con Google.")
    } finally {
      setLoading(false)
    }
  }

=======
>>>>>>> origin/main
  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")

    if (isRegister && password !== confirm) {
      setError("Las contraseñas no coinciden.")
      return
    }

    setLoading(true)
    const result = isRegister
      ? await registerAccount(name, email, password)
      : await login(email, password)
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

        <div className="relative">
          <div className="flex items-center gap-2.5">
            <BrandMark className="h-9 w-9 text-accent" />
            <span className="display text-2xl uppercase leading-none tracking-[-0.03em]">Tornuti</span>
          </div>
        </div>

        <div className="relative max-w-md">
          <h2 className="display text-4xl leading-[0.98]">
            La cuenta
            <br />
            detrás del
            <br />
            marcador.
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-background/65">
            Un solo lugar para tus inscripciones, tus equipos y el Aura que has ganado
            jugando.
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
<<<<<<< HEAD
              ? "Tarda menos que llenar u"
              : "Accede con correo, contraseña o Google."}
            <span className="font-semibold"> {isRegister ? "Llena tus datos para empezar." : "Tu cuenta te da acceso a torneos, equipos y Aura."}</span>
          </p>

          {error && (
            <div className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-md border border-line bg-background px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Google className="h-5 w-5" />}
            <span> Continúa con Google</span>
          </button>

          <div className="mt-4 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-line" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider text-muted-foreground">
              <span className="bg-background px-3">o con correo</span>
            </div>
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {isRegister && (
              <Input
                label="Nombre completo"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. María González"
                required
              />
            )}

            <Input
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@ejemplo.com"
              required
            />

            <Input
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
            />

            {isRegister && (
              <Input
                label="Confirmar contraseña"
                type={showPassword ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repite tu contraseña"
                required
              />
            )}

            <Button
              type="submit"
              className="w-full mt-2"
              loading={loading}
              disabled={loading}
            >
              {loading ? "Procesando..." : isRegister ? "Crear cuenta" : "Entrar"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            {isRegister ? "Ya tienes cuenta? " : "Aún no tienes cuenta? "}
            <Link href={isRegister ? "/login" : "/registro"} className="font-semibold text-primary hover:underline">
              {isRegister ? "Entrar" : "Crear cuenta"}
            </Link>
          </p>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Demo: en modo demostración los datos se guardan en este navegador.
=======
              ? "Tarda menos que llenar una planilla. Puedes empezar como jugador y publicar torneos cuando quieras."
              : "Continúa con las inscripciones, tus equipos y tu historial de Aura."}
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

          <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
            {isRegister ? (
              <Input
                label="Nombre completo"
                name="nombre"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                placeholder="Valeria Rivas"
                required
              />
            ) : null}

            <Input
              label="Correo"
              name="correo"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              placeholder="tu@correo.com"
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
                  {showPassword ? (
                    <svg viewBox="0 0 18 18" className="h-4 w-4" fill="none" aria-hidden="true">
                      <path d="M2 9s2.6-4.5 7-4.5S16 9 16 9s-2.6 4.5-7 4.5S2 9 2 9Z" stroke="currentColor" strokeWidth="1.4" />
                      <circle cx="9" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.4" />
                      <path d="m3 15 12-12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 18 18" className="h-4 w-4" fill="none" aria-hidden="true">
                      <path d="M2 9s2.6-4.5 7-4.5S16 9 16 9s-2.6 4.5-7 4.5S2 9 2 9Z" stroke="currentColor" strokeWidth="1.4" />
                      <circle cx="9" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.4" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {isRegister ? (
              <Input
                label="Repite la contraseña"
                name="confirmar"
                type={showPassword ? "text" : "password"}
                value={confirm}
                onChange={(event) => setConfirm(event.target.value)}
                autoComplete="new-password"
                placeholder="Otra vez"
                required
              />
            ) : null}

            {error ? (
              <div className="border border-danger/40 bg-danger/10 px-3 py-2.5" role="alert">
                <p className="text-xs font-semibold text-danger">{error}</p>
              </div>
            ) : null}

            <Button type="submit" size="lg" loading={loading} className="w-full">
              {isRegister ? "Crear cuenta" : "Entrar"}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            {isRegister ? "¿Ya tienes cuenta?" : "¿Todavía no tienes cuenta?"}{" "}
            <Link
              href={isRegister ? "/login" : "/registro"}
              className="focus-ring rounded-sm font-semibold text-foreground underline decoration-line underline-offset-4 hover:decoration-foreground"
            >
              {isRegister ? "Entra aquí" : "Crea una gratis"}
            </Link>
          </p>

          <p className={cn("mt-8 border-t border-line pt-4 text-2xs leading-relaxed text-muted-foreground")}>
            Al continuar aceptas los{" "}
            <Link href="/terminos" className="underline underline-offset-2 hover:text-foreground">
              términos
            </Link>{" "}
            y la{" "}
            <Link href="/privacidad" className="underline underline-offset-2 hover:text-foreground">
              política de privacidad
            </Link>
            . No pedimos datos de pago.
>>>>>>> origin/main
          </p>
        </div>
      </section>
    </div>
  )
}
