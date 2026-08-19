import "./globals.css"
import { Inter } from "next/font/google"
import { Metadata } from "next"
import { NavMenu } from "@/components/ui/nav-menu"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Tornuti - Plataforma Universal de Torneos",
  description: "Crea, descubre y participa en torneos de cualquier deporte o actividad",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="font-inter antialiased">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <NavMenu isMobile={false} />
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  )
}