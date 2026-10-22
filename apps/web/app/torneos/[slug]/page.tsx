import type { Metadata } from "next"
import { TournamentDetail } from "@/components/tournament-detail"
import { TOURNAMENTS, getTournament } from "@/lib/data"

type PageProps = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return TOURNAMENTS.map((tournament) => ({ slug: tournament.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const tournament = getTournament(slug)

  if (!tournament) {
    return {
      title: "Torneo",
      description: "Consulta la ficha del torneo, sus reglas y cupos disponibles.",
    }
  }

  return {
    title: tournament.name,
    description: `${tournament.summary} ${tournament.location}, ${tournament.city}.`,
    openGraph: {
      title: `${tournament.name} · Tornuti`,
      description: tournament.summary,
      type: "article",
    },
  }
}

export default async function TournamentPage({ params }: PageProps) {
  const { slug } = await params
  const tournament = getTournament(slug)

  const jsonLd = tournament
    ? {
        "@context": "https://schema.org",
        "@type": "SportsEvent",
        name: tournament.name,
        description: tournament.description,
        startDate: tournament.startsAt,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: {
          "@type": "Place",
          name: tournament.location,
          address: {
            "@type": "PostalAddress",
            addressLocality: tournament.city,
            addressCountry: "SV",
          },
        },
        organizer: {
          "@type": "Organization",
          name: tournament.organizer.name,
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability:
            tournament.entrants.length < tournament.maxParticipants
              ? "https://schema.org/InStock"
              : "https://schema.org/SoldOut",
        },
      }
    : null

  return (
    <>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
      <TournamentDetail slug={slug} />
    </>
  )
}
