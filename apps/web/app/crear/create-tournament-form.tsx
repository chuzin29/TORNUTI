"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuraMark, CategoryIcon } from "@/components/brand"
import { StatusBadge } from "@/components/status-badge"
import { TournamentCover } from "@/components/tournament-cover"
import { Button } from "@/components/ui/button"
import { Input, Select, Textarea } from "@/components/ui/input"
import { useToast } from "@/components/providers/toast-provider"
import { useTornuti } from "@/components/providers/tornuti-provider"
import { getSupabaseClient } from "@/components/providers/supabase-provider"
import { CATEGORIES, FORMATS, TOURNAMENTS } from "@/lib/data"
import { formatDate } from "@/lib/format"
import { resizeToWebp } from "@/lib/media"
import type { Category, CoverPattern, Tournament, TournamentFormat } from "@/lib/types"
import { cn, formatNumber, slugify } from "@/lib/utils"

const coverByCategory: Record<Category, CoverPattern> = {
  deportes: "court",
  gaming: "grid",
  comunidad: "flag",
  cultura: "arc",
  empresas: "bracket",
}

const initial = {
  name: "",
  category: "deportes" as Category,
  sport: "",
  format: "eliminacion" as TournamentFormat,
  description: "",
  startsAt: "2026-12-05T15:00",
  registrationEndsAt: "2026-12-01T23:00",
  location: "",
  city: "San Salvador",
  maxParticipants: "16",
  auraPrize: "1200",
  organizer: "",
  rules: "",
}

type Errors = Partial<Record<keyof typeof initial, string>>

export function CreateTournamentForm() {
  const router = useRouter()
  const { session, created, createTournament } = useTornuti()
  const { push } = useToast()
  const [values, setValues] = React.useState(initial)
  const [errors, setErrors] = React.useState<Errors>({})
  const [submitting, setSubmitting] = React.useState(false)
  const [coverFile, setCoverFile] = React.useState<File | null>(null)
  const [coverUrl, setCoverUrl] = React.useState<string | undefined>(undefined)
  const [uploadingCover, setUploadingCover] = React.useState(false)
  const coverRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (session) {
      setValues((current) => ({
        ...current,
        organizer: current.organizer || session.name,
      }))
    }
  }, [session])

  const set = <K extends keyof typeof initial>(key: K, value: (typeof initial)[K]) => {
    setValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const clearCover = () => {
    if (coverUrl?.startsWith("blob:")) URL.revokeObjectURL(coverUrl)
    setCoverFile(null)
    setCoverUrl(undefined)
  }

  const pickCover = (file: File) => {
    if (coverRef.current) coverRef.current.value = ""
    /* El bucket exige sesión real (RLS de storage): sin cuenta avisamos
       antes de prometer algo que no se puede cumplir. */
    if (!session || session.id.startsWith("demo-")) {
      push({
        title: "Entra con tu cuenta",
        description: "La fotografía del lugar se guarda en tu cuenta de Supabase.",
        tone: "error",
      })
      return
    }
    clearCover()
    setCoverFile(file)
    setCoverUrl(URL.createObjectURL(file))
  }

  const preview: Tournament = {
    id: "preview",
    slug: "preview",
    name: values.name || "Nombre del torneo",
    summary: values.description.slice(0, 140) || "Una línea que explique de qué se trata y quién debería inscribirse.",
    description: values.description || "Descripción del torneo.",
    category: values.category,
    format: values.format,
    status: "abierto",
    sport: values.sport || "Disciplina",
    location: values.location || "Sede por confirmar",
    city: values.city || "Ciudad",
    startsAt: values.startsAt ? new Date(values.startsAt).toISOString() : new Date().toISOString(),
    registrationEndsAt: values.registrationEndsAt
      ? new Date(values.registrationEndsAt).toISOString()
      : new Date().toISOString(),
    maxParticipants: Number(values.maxParticipants) || 16,
    auraPrize: Number(values.auraPrize) || 1200,
    organizer: { name: values.organizer || "Tu organización", handle: slugify(values.organizer || "tornuti") },
    entrants: [],
    rules: values.rules
      .split("\n")
      .map((rule) => rule.trim())
      .filter(Boolean),
    cover: coverByCategory[values.category],
    matches: [],
    ...(coverUrl ? { cover_url: coverUrl } : {}),
  }

  const validate = () => {
    const next: Errors = {}
    if (values.name.trim().length < 4) next.name = "Usa al menos 4 caracteres."
    if (values.sport.trim().length < 2) next.sport = "Indica la disciplina."
    if (values.description.trim().length < 30) next.description = "Escribe al menos 30 caracteres para que se entienda el torneo."
    if (!values.location.trim()) next.location = "Indica la sede o el enlace."
    if (!values.city.trim()) next.city = "Indica la ciudad o cobertura."
    if (values.organizer.trim().length < 2) next.organizer = "Indica quién organiza."
    const max = Number(values.maxParticipants)
    if (!Number.isFinite(max) || max < 4 || max > 64) next.maxParticipants = "Elige entre 4 y 64 cupos."
    const aura = Number(values.auraPrize)
    if (!Number.isFinite(aura) || aura < 0 || aura > 10000) next.auraPrize = "Elige entre 0 y 10,000 Aura."
    if (!values.startsAt) next.startsAt = "Elige la fecha de inicio."
    if (!values.registrationEndsAt) next.registrationEndsAt = "Elige el cierre de inscripción."
    if (values.startsAt && values.registrationEndsAt) {
      if (new Date(values.registrationEndsAt) >= new Date(values.startsAt)) {
        next.registrationEndsAt = "El cierre debe ser antes del inicio."
      }
    }
    setErrors(next)
    return next
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    const next = validate()
    if (Object.keys(next).length > 0) {
      const first = document.querySelector<HTMLElement>("[aria-invalid='true']")
      first?.focus()
      push({
        title: "Revisa los campos marcados",
        description: "Falta completar o corregir algunos datos antes de publicar.",
        tone: "error",
      })
      return
    }

    setSubmitting(true)
    /* La foto del lugar: recorte y reescalado local + subida al bucket.
       Si el bucket falla, el torneo se publica igual con portada base. */
    let finalCoverUrl: string | undefined
    if (coverFile && session) {
      try {
        const { blob, ext } = await resizeToWebp(coverFile, 1280, 720)
        const client = getSupabaseClient()
        const path = `${session.id}/cover-${Date.now()}.${ext}`
        const { error: uploadError } = await client.storage.from("covers").upload(path, blob, {
          cacheControl: "300",
          contentType: ext === "webp" ? "image/webp" : "image/jpeg",
        })
        if (uploadError) throw uploadError
        const { data } = client.storage.from("covers").getPublicUrl(path)
        finalCoverUrl = data.publicUrl
      } catch {
        push({
          title: "La foto no se pudo subir",
          description: "El torneo se publica con la portada base; puedes agregar la foto después.",
          tone: "error",
        })
      }
    }
    if (coverUrl?.startsWith("blob:")) URL.revokeObjectURL(coverUrl)
    setCoverFile(null)
    setCoverUrl(undefined)

    const baseSlug = slugify(values.name)
    const taken = [...created, ...TOURNAMENTS].some((item) => item.slug === baseSlug)
    const tournament: Tournament = {
      ...preview,
      ...(finalCoverUrl ? { cover_url: finalCoverUrl } : {}),
      id: `trn-${Date.now()}`,
      slug: taken ? `${baseSlug}-${Date.now().toString().slice(-4)}` : baseSlug,
      description: values.description.trim(),
      summary: values.description.trim().slice(0, 150),
      entrants: [],
      rules: preview.rules.length > 0
        ? preview.rules
        : [
            "Inscripción gratuita y confirmada por la organización.",
            "El calendario se publica al cerrar los cupos.",
            "Los resultados se registran al final de cada partido.",
          ],
      matches: [],
    }

    createTournament(tournament)
    push({
      title: "Torneo publicado",
      description: "La ficha ya está lista para compartir.",
      tone: "success",
    })
    router.push(`/torneos/${tournament.slug}`)
  }

  return (
    <div className="shell py-10 lg:py-14">
      <div className="max-w-2xl">
        <h1 className="display text-4xl leading-[1.02] sm:text-5xl">Publica tu torneo</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Una ficha, un enlace y una lista de inscritos. No necesitas cuenta
          corporativa ni plan de pago. La publicación es gratuita.
        </p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_23rem] lg:gap-14">
        <form onSubmit={submit} noValidate className="min-w-0">
          <fieldset className="border-t border-line pt-6">
            <legend className="text-sm font-bold uppercase tracking-[0.1em]">Lo esencial</legend>
            <div className="mt-5 grid gap-5">
              <Input
                label="Nombre del torneo"
                name="nombre"
                value={values.name}
                onChange={(event) => set("name", event.target.value)}
                placeholder="Copa Cadejos 3x3"
                error={errors.name}
                maxLength={70}
                required
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <Select
                  label="Categoría"
                  name="categoria"
                  value={values.category}
                  onChange={(event) => set("category", event.target.value as Category)}
                  hint="Define el tono y el arte de la portada."
                >
                  {CATEGORIES.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </Select>
                <Select
                  label="Formato"
                  name="formato"
                  value={values.format}
                  onChange={(event) => set("format", event.target.value as TournamentFormat)}
                >
                  {Object.entries(FORMATS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </div>
              <Input
                label="Disciplina"
                name="disciplina"
                value={values.sport}
                onChange={(event) => set("sport", event.target.value)}
                placeholder="Básquet 3x3, Valorant, ajedrez rápido..."
                error={errors.sport}
                maxLength={40}
                required
              />
              <Textarea
                label="Descripción"
                name="descripcion"
                value={values.description}
                onChange={(event) => set("description", event.target.value)}
                placeholder="Qué se juega, cómo se juega y a quién está dirigido. Tres o cuatro frases bastan."
                error={errors.description}
                maxLength={700}
                rows={5}
                required
              />
              <p className="-mt-2 text-right text-2xs tabular text-muted-foreground">
                {values.description.length} / 700
              </p>
            </div>
          </fieldset>

          <fieldset className="mt-10 border-t border-line pt-6">
            <legend className="text-sm font-bold uppercase tracking-[0.1em]">Cuándo y dónde</legend>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Input
                label="Inicio del torneo"
                name="inicio"
                type="datetime-local"
                value={values.startsAt}
                onChange={(event) => set("startsAt", event.target.value)}
                error={errors.startsAt}
                required
              />
              <Input
                label="Cierre de inscripción"
                name="cierre"
                type="datetime-local"
                value={values.registrationEndsAt}
                onChange={(event) => set("registrationEndsAt", event.target.value)}
                error={errors.registrationEndsAt}
                required
              />
              <Input
                label="Sede"
                name="sede"
                value={values.location}
                onChange={(event) => set("location", event.target.value)}
                placeholder="Cancha 2, Parque Cuscatlán"
                error={errors.location}
                maxLength={90}
                required
              />
              <Input
                label="Ciudad o cobertura"
                name="ciudad"
                value={values.city}
                onChange={(event) => set("city", event.target.value)}
                placeholder="San Salvador"
                error={errors.city}
                maxLength={50}
                required
              />
            </div>
          </fieldset>

          <fieldset className="mt-10 border-t border-line pt-6">
            <legend className="text-sm font-bold uppercase tracking-[0.1em]">Foto del lugar</legend>
            <div className="mt-5 flex flex-wrap items-start gap-5">
              <div className="h-24 w-40 shrink-0 overflow-hidden border border-line">
                <TournamentCover
                  pattern={preview.cover}
                  category={preview.category}
                  photo={preview.cover_url}
                  sizes="200px"
                  className="h-full w-full"
                />
              </div>
              <div className="min-w-[14rem] flex-1">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Fotografía de la cancha, sala o lugar donde se juega. Aparece sobre
                  la portada en las tarjetas de búsqueda y en la ficha del torneo.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={uploadingCover}
                    onClick={() => coverRef.current?.click()}
                  >
                    {coverUrl ? "Cambiar foto" : "Subir foto"}
                  </Button>
                  {coverUrl ? (
                    <Button type="button" variant="ghost" size="sm" onClick={clearCover}>
                      Quitar foto
                    </Button>
                  ) : null}
                  <input
                    ref={coverRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      if (file) pickCover(file)
                    }}
                  />
                </div>
                <p className="mt-2 text-2xs text-muted-foreground">
                  Se recorta a 16:9 y se comprime aquí mismo; 5 MB máximo.
                </p>
              </div>
            </div>
          </fieldset>

          <fieldset className="mt-10 border-t border-line pt-6">
            <legend className="text-sm font-bold uppercase tracking-[0.1em]">Cupos, Aura y reglas</legend>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Input
                label="Cupos"
                name="cupos"
                type="number"
                min={4}
                max={64}
                value={values.maxParticipants}
                onChange={(event) => set("maxParticipants", event.target.value)}
                error={errors.maxParticipants}
                hint="Entre 4 y 64 participantes o equipos."
                required
              />
              <Input
                label="Aura para el podio"
                name="aura"
                type="number"
                min={0}
                max={10000}
                step={100}
                value={values.auraPrize}
                onChange={(event) => set("auraPrize", event.target.value)}
                error={errors.auraPrize}
                hint="Puedes dejarlo en 0 si no hay premio."
                required
              />
              <Input
                label="Organiza"
                name="organiza"
                value={values.organizer}
                onChange={(event) => set("organizer", event.target.value)}
                placeholder="Tu nombre o colectivo"
                error={errors.organizer}
                maxLength={60}
                required
              />
              <div className="flex items-end">
                <p className="border border-line bg-elevated/60 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
                  La inscripción siempre es gratuita para quien juega. Tornuti no
                  cobra comisiones.
                </p>
              </div>
            </div>
            <div className="mt-5">
              <Textarea
                label="Reglas"
                name="reglas"
                value={values.rules}
                onChange={(event) => set("rules", event.target.value)}
                placeholder={"Una regla por línea.\nEquipos de 3 jugadores y 1 suplente.\nPartidos a 21 puntos."}
                hint="Se muestran tal cual en la ficha. Si lo dejas vacío, usamos reglas base."
                rows={5}
              />
            </div>
          </fieldset>

          <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-sm text-2xs leading-relaxed text-muted-foreground">
              Al publicar se crea una ficha local de demostración. Para producción,
              conecta la API y la base de datos.
            </p>
            <Button type="submit" size="lg" loading={submitting} className="shrink-0">
              Publicar torneo
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Button>
          </div>
        </form>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-2xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Vista previa</p>
          <div className="mt-3 overflow-hidden rounded-card border border-line bg-surface">
            <TournamentCover
              pattern={preview.cover}
              category={preview.category}
              photo={preview.cover_url}
              sizes="460px"
              className="aspect-[16/9]"
              label={preview.sport}
            />
            <div className="p-4">
              <div className="flex items-center justify-between gap-2">
                <StatusBadge status="abierto" />
                <span className="inline-flex items-center gap-1 text-2xs font-bold tabular">
                  <AuraMark className="h-3 w-3 text-aura" />
                  {formatNumber(preview.auraPrize)}
                </span>
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-2xs font-bold uppercase tracking-[0.1em] text-muted-foreground">
                <CategoryIcon category={preview.category} className="h-3.5 w-3.5" />
                {CATEGORIES.find((category) => category.id === preview.category)?.label}
              </p>
              <h2 className="mt-1.5 text-base font-bold leading-snug">{preview.name}</h2>
              <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                {preview.summary}
              </p>
              <div className="mt-4 space-y-1.5 border-t border-line pt-3 text-xs text-muted-foreground">
                <p className="flex justify-between gap-3">
                  <span>Inicio</span>
                  <span className="font-medium text-foreground">{formatDate(preview.startsAt)}</span>
                </p>
                <p className="flex justify-between gap-3">
                  <span>Cupos</span>
                  <span className="font-medium tabular text-foreground">0 / {preview.maxParticipants}</span>
                </p>
                <p className="flex justify-between gap-3">
                  <span>Sede</span>
                  <span className="max-w-[60%] truncate text-right font-medium text-foreground">{preview.location}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 border border-line p-4">
            <p className="text-xs font-bold">Lo que se publica</p>
            <ul className="mt-2 space-y-1.5 text-2xs leading-relaxed text-muted-foreground">
              <li>Ficha con reglas, sede y fecha.</li>
              <li>Formulario de inscripción y control de cupos.</li>
              <li>Cuadro proyectado de eliminación directa.</li>
              <li>Enlace para compartir con tu comunidad.</li>
            </ul>
          </div>
          <p className="mt-4 text-2xs leading-relaxed text-muted-foreground">
            ¿Solo quieres ver cómo queda? Publica un torneo de prueba y bórralo
            limpiando los datos del navegador.
          </p>
        </aside>
      </div>
    </div>
  )
}
