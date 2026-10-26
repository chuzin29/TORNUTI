import { createClient } from "@supabase/supabase-js"
import { SUPABASE_PUBLIC_KEY, SUPABASE_URL } from "@/lib/supabase/keys"

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY)

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

export async function signUp(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  })
  if (error) throw error
  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from("User")
    .select("id, name, email, image, role, aura")
    .eq("id", userId)
    .single()
  if (error) throw error
  return data
}
