import type { Metadata } from "next"
import { AuthForm } from "@/components/auth-form"

export const metadata: Metadata = {
<<<<<<< HEAD
  title: "Crear cuenta · Tornuti",
=======
  title: "Crear cuenta",
>>>>>>> origin/main
  description: "Crea una cuenta gratuita en Tornuti para inscribirte y organizar torneos.",
}

export default async function RegisterPage({
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
  return <AuthForm mode="register" redirectTo={redirect} />
}
