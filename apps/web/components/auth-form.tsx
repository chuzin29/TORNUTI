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
import { Loader2, Google, Mail, Lock, Eye, EyeOff } from "lucide-react"

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
          </p>
        </div>
      </section>
    </div>
  )
}
