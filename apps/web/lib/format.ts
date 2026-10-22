const DATE = new Intl.DateTimeFormat("es-SV", {
  day: "2-digit",
  month: "short",
  timeZone: "America/El_Salvador",
})

const DATE_LONG = new Intl.DateTimeFormat("es-SV", {
  weekday: "short",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "America/El_Salvador",
})

const TIME = new Intl.DateTimeFormat("es-SV", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "America/El_Salvador",
})

export function formatDay(iso: string) {
  return DATE.format(new Date(iso)).replace(".", "")
}

export function formatDate(iso: string) {
  return DATE_LONG.format(new Date(iso))
}

export function formatTime(iso: string) {
  return TIME.format(new Date(iso)).replace(/\u00a0/g, " ")
}

export function formatDateTime(iso: string) {
  return `${formatDate(iso)} · ${formatTime(iso)}`
}

export function splitDay(iso: string) {
  const date = new Date(iso)
  const day = new Intl.DateTimeFormat("es-SV", {
    day: "2-digit",
    timeZone: "America/El_Salvador",
  }).format(date)
  const month = new Intl.DateTimeFormat("es-SV", {
    month: "short",
    timeZone: "America/El_Salvador",
  })
    .format(date)
    .replace(".", "")
  return { day, month: month.toUpperCase() }
}

export function relativeTime(iso: string, now = new Date("2026-10-21T18:00:00Z")) {
  const diff = new Date(iso).getTime() - now.getTime()
  const days = Math.round(diff / 86_400_000)
  if (days === 0) return "hoy"
  if (days === 1) return "mañana"
  if (days > 1) return `en ${days} días`
  if (days === -1) return "ayer"
  return `hace ${Math.abs(days)} días`
}

export function hoursUntil(iso: string, now = new Date("2026-10-21T18:00:00Z")) {
  return Math.max(0, Math.round((new Date(iso).getTime() - now.getTime()) / 3_600_000))
}
