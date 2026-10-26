import type { Metadata } from "next"
import { AuthForm } from "@/components/auth-form"

export const metadata: Metadata = {
  title: "Crear cuenta · Tornuti",
  description: "Crea una cuenta gratuita en Tornuti para inscribirte y organizar torneos.",
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; t?: string }>
}) {
  const { redirect, t } = await searchParams
  return <AuthForm mode="register" redirectTo={redirect} />
}
