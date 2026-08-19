import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Header } from "@/components/ui/header"
import { Input } from "@/components/ui/input"
import { Moon, Sun } from "lucide-react"
import { useState } from "react"
import Trophy from "@/assets/svg/trophy.svg"
import Medal from "@/assets/svg/medal.svg"
import Basketball from "@/assets/svg/basketball.svg"
import Controller from "@/assets/svg/controller.svg"
import GoldMedal from "@/assets/svg/gold-medal.svg"
import Laurel from "@/assets/svg/laurel.svg"

export default function HomePage() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
    }
    return false
  })

  const toggleDark = () => setIsDark((prev) => !prev)

  return (
    <html lang="es" className="font-inter antialiased">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Header />

        <main className="max-w-7xl mx-auto px-6 py-12">
          {/* Hero Section con SVG animado */}
          <section className="mb-12 overflow-hidden">
            <div class="absolute inset-0">
              <svg className="absolute -inset-0 overflow-hidden bg-gradient-to-br from-morado-500 to-salvadoreño-claro-500 opacity-20" aria-hidden="true">
                <circle cx="0" cy="0" r="300" fill="none" stroke="currentColor" stroke-width="100" opacity="0.3">
                  <animate 
                    attributeName="cx" 
                    from="0" to="300" 
                    dur="10s" 
                    repeatCount="indefinite" 
                    keyTimes="0;1" 
                    values="0;300" 
                  />
                  <animate 
                    attributeName="cy" 
                    from="0" to="300" 
                    dur="10s" 
                    repeatCount="indefinite" 
                    keyTimes="0;1" 
                    values="0;300" 
                  />
                </circle>
              </svg>
            </div>
            
            <div class="relative z-10 max-w-4xl mx-auto text-center">
              <div class="inline-flex items-center gap-2 mb-6">
                <Trophy className="h-8 w-8 text-morado-400 animate-float" />
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
                  Tornuti
                </h1>
              </div>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                La plataforma universal para crear, descubrir y participar en torneos.
                Desde baloncesto 3x3 hasta esports, la comunidad define los nichos.
              </p>
              
              {/* Stats cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 max-w-md mx-auto">
                <div className="bg-card/80 rounded-xl border border-border p-6 backdrop-blur-sm">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Medal className="h-6 w-6 text-morado-400" />
                  </div>
                  <p className="text-3xl font-bold text-foreground">10K+</p>
                  <p className="text-sm text-muted-foreground">Torneos creados</p>
                </div>
                <div className="bg-card/80 rounded-xl border border-border p-6 backdrop-blur-sm">
                  <div className="h-12 w-12 rounded-lg bg-salvadoreño-claro-500 flex items-center justify-center mb-3">
                    <Users className="h-6 w-6 text-salvadoreño-900" />
                  </div>
                  <p className="text-3xl font-bold text-salvadoreño-900">500K+</p>
                  <p className="text-sm text-muted-foreground">Jugadores activos</p>
                </div>
                <div className="bg-card/80 rounded-xl border border-border p-6 backdrop-blur-sm">
                  <div className="h-12 w-12 rounded-lg bg-amber-500 flex items-center justify-center mb-3">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-white">28</p>
                  <p className="text-sm text-white/80">Países</p>
                </div>
              </div>
            </div>
          </section>

          {/* Categories Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <Card>
              <div className="h-24 rounded-xl overflow-hidden flex items-center justify-center">
                <Basketball className="h-12 w-12 text-morado-400" />
              </div>
              <h3 className="font-medium text-foreground mb-2">Deportes</h3>
              <p className="text-muted-foreground text-sm">Baloncesto, fútbol, tenis, voleibol</p>
            </Card>
            <Card>
              <div className="h-24 rounded-xl overflow-hidden flex items-center justify-center">
                <Controller className="h-12 w-12 text-salvadoreño-claro-500" />
              </div>
              <h3 className="font-medium text-foreground mb-2">Gaming</h3>
              <p className="text-muted-foreground text-sm">Valorant, Fortnite, EA FC, Smash Bros.</p>
            </Card>
            <Card>
              <div className="h-24 rounded-xl overflow-hidden flex items-center justify-center">
                <Heart className="h-12 w-12 text-pink-400" />
              </div>
              <h3 className="font-medium text-foreground mb-2">Comunidad</h3>
              <p className="text-muted-foreground text-sm">Eventos escolares, reuniones, amistosos</p>
            </Card>
            <Card>
              <div className="h-24 rounded-xl overflow-hidden flex items-center justify-center">
                <GoldMedal className="h-12 w-12 text-yellow-400" />
              </div>
              <h3 className="font-medium text-foreground mb-2">Nichos</h3>
              <p className="text-muted-foreground text-sm">Aura, memes, competencias personalizadas</p>
            </Card>
          </section>

          {/* Featured Tournaments */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-6">Torneos Destacados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Torneo 1 */}
              <Card>
                <div className="h-48 rounded-xl overflow-hidden mb-4 flex items-end">
                  <div className="absolute bottom-4 left-4 right-0 bg-primary/20 px-4 py-2 rounded-xl">
                    <Badge variant="outline">3x3</Badge>
                  </div>
                  <div className="absolute top-4 left-4">
                    <Trophy className="h-6 w-6 text-morado-300" />
                  </div>
                </div>
                <h3 className="font-medium text-foreground">Copa Barrio 3x3</h3>
                <p className="text-muted-foreground text-sm">12 equipos · Hoy 3 PM</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-2 w-auto"
                >
                  Inscribirse
                </Button>
              </Card>

              {/* Torneo 2 */}
              <Card>
                <div className="h-48 rounded-xl overflow-hidden mb-4 flex items-end">
                  <div className="absolute bottom-4 left-4 right-0 bg-salvadoreño-claro-500 px-4 py-2 rounded-xl">
                    <Badge>Gaming</Badge>
                  </div>
                  <div className="absolute top-4 left-4">
                    <Controller className="h-6 w-6 text-salvadoreño-900" />
                  </div>
                </div>
                <h3 className="font-medium text-foreground">Torneo Valorant</h3>
                <p className="text-muted-foreground text-sm">8 equipos · Sábado 10 AM</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-2 w-auto"
                >
                  Inscribirse
                </Button>
              </Card>

              {/* Torneo 3 */}
              <Card>
                <div className="h-48 rounded-xl overflow-hidden mb-4 flex items-end">
                  <div className="absolute bottom-4 left-4 right-0 bg-amber-500/20 px-4 py-2 rounded-xl">
                    <Badge variant="aura">Aura</Badge>
                  </div>
                  <div className="absolute top-4 left-4">
                    <GoldMedal className="h-6 w-6 text-amber-300" />
                  </div>
                </div>
                <h3 className="font-medium text-foreground">Torneo Farmear Aura</h3>
                <p className="text-muted-foreground text-sm">100 participantes · Próximo mes</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-2 w-auto"
                >
                  Inscribirse
                </Button>
              </Card>

            </div>
          </section>

          {/* How It Works */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-6">¿Cómo funciona?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Trophy className="h-7 w-7 text-morado-400" />
                </div>
                <h3 className="font-medium text-foreground mb-2">Crear</h3>
                <p className="text-muted-foreground text-sm">Define nombre, formato, reglas y publica tu torneo en minutos</p>
              </div>
              <div>
                <div className="h-14 w-14 rounded-2xl bg-salvadoreño-claro-500 flex items-center justify-center mb-4">
                  <Users className="h-7 w-7 text-salvadoreño-900" />
                </div>
                <h3 className="font-medium text-foreground mb-2">Descubrir</h3>
                <p className="text-muted-foreground text-sm">Explora torneos por categoría, tags y popularidad</p>
              </div>
              <div>
                <div className="h-14 w-14 rounded-2xl bg-amber-500 flex items-center justify-center mb-4">
                  <GoldMedal className="h-7 w-7 text-amber-300" />
                </div>
                <h3 className="font-medium text-foreground mb-2">Participar</h3>
                <p className="text-muted-foreground text-sm">Inscribe tu equipo en un torneo en pocos clics</p>
              </div>
            </div>
          </section>
        </main>
      </body>
    </html>
  )
}