"use client"

import * as React from "react"
import Link from "next/link"
import { AuraMark } from "@/components/brand"
import { Avatar } from "@/components/ui/avatar"
import { Button, buttonStyles } from "@/components/ui/button"
import { Input, Textarea } from "@/components/ui/input"
import { getSupabaseClient } from "@/components/providers/supabase-provider"
import { useTornuti } from "@/components/providers/tornuti-provider"
import { resizeToWebp } from "@/lib/media"
import { formatNumber } from "@/lib/utils"

/** Tamaño del avatar tras el recorte cuadrado: WebP a 320 px pesa kBs y
 *  sube volando incluso con datos móviles. */
const AVATAR_SIZE = 320

/** Recorta al centro en cuadrado y reescala; devuelve el blob final. */
async function toSquareWebp(file: File): Promise<{ blob: Blob; ext: string }> {
  return resizeToWebp(file, AVATAR_SIZE, AVATAR_SIZE)
}

export function ProfilePanel() {
  const { ready, session, editProfile, logout } = useTornuti()
  const fileRef = React.useRef<HTMLInputElement>(null)
  const [name, setName] = React.useState("")
  const [bio, setBio] = React.useState("")
  const [preview, setPreview] = React.useState<string | null>(null)
  const [saving, setSaving] = React.useState(false)
  const [uploading, setUploading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [saved, setSaved] = React.useState(false)

  React.useEffect(() => {
    setName(
      session?.name ??
        (() => {
          const local = (session?.email ?? "").split("@")[0]
          return local
            .replace(/[._-]+/g, " ")
            .replace(/\b\w/g, (letter) => letter.toUpperCase())
        })(),
    )
    setBio(session?.bio ?? "")
    setPreview(session?.avatar_url ?? null)
    /* Solo al tener sesión: los placeholders alinean el formulario. */
  }, [session?.email, session?.name, session?.bio, session?.avatar_url])

  React.useEffect(() => {
    if (!saved) return
    const timeout = setTimeout(() => setSaved(false), 2600)
    return () => clearTimeout(timeout)
  }, [saved])

  if (!ready) {
    return (
      <div className="shell py-20">
        <div className="mx-auto h-10 w-64 animate-pulse rounded bg-muted" />
        <div className="mx-auto mt-8 h-64 max-w-3xl animate-pulse rounded border border-line bg-muted/50" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="shell py-20">
        <div className="mx-auto max-w-lg border border-foreground bg-surface p-8 text-center">
          <svg viewBox="0 0 48 48" className="mx-auto h-14 w-14 text-muted-foreground" fill="none" aria-hidden="true">
            <circle cx="24" cy="16" r="7" stroke="currentColor" strokeWidth="1.6" />
            <path d="M10 40c2-7.5 7-11 14-11s12 3.5 14 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <h1 className="display mt-5 text-3xl">Tu ficha te espera</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Entra para poner tu foto, cambiar tu nombre y contar en una bio breve
            quién eres en la cancha.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
            <Link href="/login" className={buttonStyles({ size: "md" })}>
              Entrar
            </Link>
            <Link href="/registro" className={buttonStyles({ variant: "outline", size: "md" })}>
              Crear cuenta
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const pickPhoto = async (file: File) => {
    setError(null)
    setUploading(true)
    try {
      const { blob, ext } = await toSquareWebp(file)
      const client = getSupabaseClient()
      /* Ruta con vuelo: cada foto nueva es un objeto nuevo, así el CDN
         nunca muestra la anterior por caché. */
      const path = `${session.id}/avatar-${Date.now()}.${ext}`
      const { error: uploadError } = await client.storage
        .from("avatars")
        .upload(path, blob, {
          cacheControl: "300",
          contentType: ext === "webp" ? "image/webp" : "image/jpeg",
          upsert: false,
        })
      if (uploadError) throw uploadError
      const { data } = client.storage.from("avatars").getPublicUrl(path)
      const result = await editProfile({ avatar_url: data.publicUrl })
      if (!result.ok) throw new Error(result.error ?? "no-guardada")
      setPreview(data.publicUrl)
      setSaved(true)
    } catch (uploadError) {
      const message =
        uploadError instanceof Error && /no-|token|error/i.test(uploadError.message)
          ? uploadError.message
          : ""
      setError(
        /payload|size|exceed/i.test(message)
          ? "La imagen pesa demasiado; prueba otra más ligera."
          : "No se pudo subir tu foto. Intenta de nuevo.",
      )
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  const removePhoto = async () => {
    setError(null)
    const result = await editProfile({ avatar_url: null })
    if (result.ok) {
      setPreview(null)
      setSaved(true)
    } else {
      setError(result.error ?? "No se pudo quitar la foto.")
    }
  }

  const save = async () => {
    setError(null)
    setSaving(true)
    try {
      const result = await editProfile({
        name,
        bio: bio.trim() ? bio.trim() : "",
      })
      if (!result.ok) {
        setError(result.error ?? "No se pudo guardar tu ficha.")
        return
      }
      setSaved(true)
    } catch {
      setError("No se pudo guardar tu ficha. Intenta de nuevo.")
    } finally {
      setSaving(false)
    }
  }

  const isDemoSession = session.id.startsWith("demo-")

  return (
    <div className="shell py-10 lg:py-14">
      <div className="mb-8">
        <p className="text-2xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Mi panel</p>
        <h1 className="display mt-1 text-3xl leading-none sm:text-4xl">Mi ficha</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tu cara en rankings, equipos y torneos. Los cambios se ven al instante en toda la app.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Tarjeta de identidad */}
        <div className="border border-line bg-surface p-6">
          <div className="flex items-center gap-5">
            <Avatar name={name || session.name} src={preview ?? undefined} size="lg" className="h-20 w-20 text-lg" />
            <div className="min-w-0">
              <p className="truncate text-lg font-bold">{name || session.name}</p>
              <p className="text-xs text-muted-foreground">@{session.handle}</p>
              <p className="mt-1.5 inline-flex items-center gap-1 text-2xs font-bold text-aura tabular">
                <AuraMark className="h-3 w-3" />
                {formatNumber(session.aura)} Aura
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={uploading || isDemoSession}
              onClick={() => fileRef.current?.click()}
            >
              {uploading ? "Subiendo…" : preview ? "Cambiar foto" : "Poner foto"}
            </Button>
            {preview && !isDemoSession ? (
              <Button variant="ghost" size="sm" disabled={uploading} onClick={() => void removePhoto()}>
                Quitar foto
              </Button>
            ) : null}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) void pickPhoto(file)
              }}
            />
          </div>
          {isDemoSession ? (
            <p className="mt-3 text-xs text-muted-foreground">
              Estás en modo demostración: crea tu cuenta con Supabase para subir fotos reales.
            </p>
          ) : (
            <p className="mt-3 text-xs text-muted-foreground">
              JPG, PNG o WebP · recorte cuadrado automático · hasta 2 MB.
            </p>
          )}

          <dl className="mt-6 space-y-2 border-t border-line pt-4 text-xs">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Correo</dt>
              <dd className="truncate font-medium">{session.email}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Cuenta</dt>
              <dd className="font-medium">Supabase</dd>
            </div>
          </dl>
          <Button variant="ghost" size="sm" className="mt-4 w-full" onClick={logout}>
            Cerrar sesión
          </Button>
        </div>

        {/* Formulario */}
        <div className="border border-foreground bg-surface p-6 lg:p-8">
          <h2 className="text-lg font-bold">Edita tus datos</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Todo se guarda solo en tu cuenta; nada de rellenar de nuevo en cada torneo.
          </p>

          <div className="mt-6 space-y-5">
            <Input
              name="perfil-nombre"
              label="Nombre"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              disabled={isDemoSession}
            />
            <div className="relative">
              <Textarea
                name="perfil-bio"
                label="Bio breve"
                hint="Una pizca de quién eres: posición, equipo, lo que quieras."
                value={bio}
                maxLength={240}
                onChange={(event) => setBio(event.target.value)}
                disabled={isDemoSession}
              />
              <p className="mt-1 text-right text-2xs tabular text-muted-foreground" aria-live="polite">
                {bio.length}/240
              </p>
            </div>

            {error ? (
              <p className="text-xs font-medium text-danger" role="alert">
                {error}
              </p>
            ) : null}
            {saved && !error ? (
              <p className="text-xs font-medium text-success" role="status" aria-live="polite">
                Ficha actualizada ✓ — se ve ya en tu encabezado y equipos.
              </p>
            ) : null}

            <div className="flex items-center gap-3">
              <Button size="md" onClick={() => void save()} disabled={saving || (!name.trim() && !bio)}>
                {saving ? "Guardando…" : "Guardar cambios"}
              </Button>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline"
              >
                Volver a mi panel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
