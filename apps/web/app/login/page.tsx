import type { Metadata } from "next"
import { AuthForm } from "@/components/auth-form"

export const metadata: Metadata = {
  title: "Entrar",
  description: "Entra a Tornuti para gestionar tus inscripciones, equipos y Aura.",
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>
}) {
  const { redirect } = await searchParams
  return <AuthForm mode="login" redirectTo={redirect} />
}
