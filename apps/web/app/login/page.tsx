import type { Metadata } from "next"
import { AuthForm } from "@/components/auth-form"

export const metadata: Metadata = {
  title: "Entrar · Tornuti",
  description: "Entra a Tornuti con tu cuenta o continúa con Google.",
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; t?: string }>
}) {
  const { redirect, t } = await searchParams
  return <AuthForm mode="login" redirectTo={redirect} />
}
