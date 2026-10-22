import type { Metadata } from "next"
import { AuthForm } from "@/components/auth-form"

export const metadata: Metadata = {
<<<<<<< HEAD
  title: "Entrar · Tornuti",
  description: "Entra a Tornuti con tu cuenta o continúa con Google.",
=======
  title: "Entrar",
  description: "Entra a Tornuti para gestionar tus inscripciones, equipos y Aura.",
>>>>>>> origin/main
}

export default async function LoginPage({
  searchParams,
}: {
<<<<<<< HEAD
  searchParams: Promise<{ redirect?: string; t?: string }>
}) {
  const { redirect, t } = await searchParams
=======
  searchParams: Promise<{ redirect?: string }>
}) {
  const { redirect } = await searchParams
>>>>>>> origin/main
  return <AuthForm mode="login" redirectTo={redirect} />
}
