import type { Metadata, Viewport } from "next"
import "@fontsource-variable/archivo"
import "./globals.css"
import { Providers } from "@/components/providers/providers"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { SITE } from "@/lib/data"

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Tornuti — torneos de cualquier cosa, con la cuenta clara",
    template: "%s · Tornuti",
  },
  description: SITE.description,
  keywords: [
    "torneos",
    "torneos de fútbol",
    "torneos gaming",
    "organizar torneos",
    "El Salvador",
    "Aura",
    "cuadros de eliminación",
  ],
  authors: [{ name: "Tornuti" }],
  creator: "Tornuti",
  openGraph: {
    type: "website",
    locale: "es_SV",
    url: SITE.url,
    siteName: SITE.name,
    title: "Tornuti — torneos de cualquier cosa",
    description: SITE.description,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Tornuti: torneos de cualquier cosa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tornuti — torneos de cualquier cosa",
    description: SITE.description,
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

const themeScript = `(function(){try{var stored=localStorage.getItem("tornuti-theme");var dark=stored?stored==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;var root=document.documentElement;root.classList.toggle("dark",dark);root.style.colorScheme=dark?"dark":"light";}catch(e){}})();`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {/*
          THESIS: a tournament platform that reads like a match-day program and a scorekeeper's ledger, not another dark neon SaaS.
          OWN-WORLD: warm paper, ink, cobalt, acid lime, hairline rules, flat geometric court art, Archivo at display weights.
          STORY: anyone can publish a tournament in minutes; inscriptions, brackets, results and Aura stay in one legible record.
          FIRST VIEWPORT: an asymmetric editorial statement beside a working control desk with a live bracket, capacity and Aura prize.
          FORM: the sports program and the scorebook; no cards-as-page-structure, no gradient text, no emoji, icons are authored SVG.
          FINISH: unreviewed and undocumented is unfinished; the build ends with the finish review, DESIGN.md and every raster carrying provenance.
        */}
        <a
          href="#contenido"
          className="sr-only z-[100] rounded-md bg-foreground px-4 py-2 text-background focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Saltar al contenido
        </a>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main id="contenido" className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  )
}
