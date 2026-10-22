import type { Metadata, Viewport } from "next"
import "./globals.css"
import { Providers } from "@/components/providers/providers"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://tornuti.com"),
  title: {
    default: "Tornuti — torneos de cualquier cosa, con la cuenta clara",
    template: "%s · Tornuti",
  },
  description: "Crea, descubre y participa en torneos de cualquier deporte o actividad",
  keywords: ["torneos", "torneos de fútbol", "torneos gaming", "organizar torneos", "El Salvador", "Aura", "cuadros de eliminación"],
  authors: [{ name: "Tornuti" }],
  creator: "Tornuti",
  openGraph: {
    type: "website",
    locale: "es_SV",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://tornuti.com",
    siteName: "Tornuti",
    title: "Tornuti — torneos de cualquier cosa",
    description: "Crea, descubre y participa en torneos de cualquier deporte o actividad",
    images: [{ url: "/og.png", width: 1200, height: 630, type: "image/png", alt: "Tornuti" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tornuti — torneos de cualquier cosa",
    description: "Crea, descubre y participa en torneos de cualquier deporte o actividad",
    images: ["/og.png"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/favicon.svg" }],
  },
  manifest: "/manifest.webmanifest",
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F4ED" },
    { media: "(prefers-color-scheme: dark)", color: "#101320" },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  )
}
