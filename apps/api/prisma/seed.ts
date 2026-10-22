import "dotenv/config"
import {
  AuraReason,
  MatchStatus,
  PrismaClient,
  RegistrationStatus,
  Role,
  TournamentFormat,
  TournamentStatus,
} from "@prisma/client"
import * as bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const DEMO_PASSWORD = "tornuti123"

async function main() {
  const password = await bcrypt.hash(DEMO_PASSWORD, 12)

  // Delete in dependency order so the seed can run repeatedly.
  await prisma.report.deleteMany()
  await prisma.auraTransaction.deleteMany()
  await prisma.achievement.deleteMany()
  await prisma.match.deleteMany()
  await prisma.groupParticipant.deleteMany()
  await prisma.tournamentGroup.deleteMany()
  await prisma.tournamentRegistration.deleteMany()
  await prisma.tournament.deleteMany()
  await prisma.teamMember.deleteMany()
  await prisma.teamStatistics.deleteMany()
  await prisma.playerStatistics.deleteMany()
  await prisma.team.deleteMany()
  await prisma.user.deleteMany()

  const valeria = await prisma.user.create({
    data: {
      email: "valeria@tornuti.app",
      password,
      name: "Valeria Rivas",
      handle: "vale.rivas",
      bio: "Base de Las Cadejas. Me gusta el pase extra y el café antes del partido.",
      aura: 9840,
      role: Role.PLAYER,
      statistics: { create: { matches: 38, wins: 31, losses: 7, points: 93 } },
    },
  })

  const diego = await prisma.user.create({
    data: {
      email: "diego@tornuti.app",
      password,
      name: "Diego Menjívar",
      handle: "dmenjivar",
      bio: "Alero, tirador y organizador de la cancha de Vista Hermosa.",
      aura: 9210,
      role: Role.PLAYER,
      statistics: { create: { matches: 36, wins: 29, losses: 7, points: 87 } },
    },
  })

  const andrea = await prisma.user.create({
    data: {
      email: "andrea@tornuti.app",
      password,
      name: "Andrea Portillo",
      handle: "andreap",
      bio: "Duelista de Pixel Patria. Cinco en línea, cero excusas.",
      aura: 8875,
      role: Role.PLAYER,
      statistics: { create: { matches: 33, wins: 27, losses: 6, points: 81 } },
    },
  })

  const luis = await prisma.user.create({
    data: {
      email: "luis@tornuti.app",
      password,
      name: "Luis Escalante",
      handle: "lucho.esc",
      bio: "Pívot de Santa Ana Five. La casa se defiende.",
      aura: 8420,
      role: Role.PLAYER,
      statistics: { create: { matches: 34, wins: 25, losses: 9, points: 75 } },
    },
  })

  const camila = await prisma.user.create({
    data: {
      email: "camila@tornuti.app",
      password,
      name: "Camila Nolasco",
      handle: "caminolas",
      bio: "Ajedrecista y capitana de La Garra. Pienso antes de mover.",
      aura: 8110,
      role: Role.PLAYER,
      statistics: { create: { matches: 29, wins: 24, losses: 5, points: 72 } },
    },
  })

  const oscar = await prisma.user.create({
    data: {
      email: "oscar@tornuti.app",
      password,
      name: "Óscar Cañas",
      handle: "ocanas",
      bio: "Cierre de Vista Hermosa. Defensa primero, preguntas después.",
      aura: 7690,
      role: Role.PLAYER,
      statistics: { create: { matches: 31, wins: 22, losses: 9, points: 66 } },
    },
  })

  const rebeca = await prisma.user.create({
    data: {
      email: "rebeca@tornuti.app",
      password,
      name: "Rebeca Ávalos",
      handle: "rebavalos",
      bio: "Iniciadora de Las Cadejas. Corro hasta que el reloj diga basta.",
      aura: 7235,
      role: Role.PLAYER,
      statistics: { create: { matches: 27, wins: 20, losses: 7, points: 60 } },
    },
  })

  const mauricio = await prisma.user.create({
    data: {
      email: "mauricio@tornuti.app",
      password,
      name: "Mauricio Lemus",
      handle: "mau.lemus",
      bio: "Delantero de Santa Ana Five. El área es mi oficina.",
      aura: 6980,
      role: Role.PLAYER,
      statistics: { create: { matches: 30, wins: 19, losses: 11, points: 57 } },
    },
  })

  const fernanda = await prisma.user.create({
    data: {
      email: "fernanda@tornuti.app",
      password,
      name: "Fernanda Orellana",
      handle: "fer.ore",
      bio: "Control de Pixel Patria. Ordeno el mapa antes de disparar.",
      aura: 6540,
      role: Role.PLAYER,
      statistics: { create: { matches: 26, wins: 18, losses: 8, points: 54 } },
    },
  })

  const demo = await prisma.user.create({
    data: {
      email: "jugador@tornuti.app",
      password,
      name: "Jugador Demo",
      handle: "jugador.demo",
      bio: "Cuenta de demostración para probar inscripciones, equipos y Aura.",
      aura: 1240,
      role: Role.PLAYER,
      statistics: { create: { matches: 6, wins: 3, losses: 3, points: 9 } },
    },
  })

  const organizer = await prisma.user.create({
    data: {
      email: "organiza@tornuti.app",
      password,
      name: "Colectivo Cadejos",
      handle: "cadejos.sv",
      bio: "Organizamos la Copa Cadejos y torneos abiertos en el Parque Cuscatlán.",
      aura: 3420,
      role: Role.ORGANIZER,
      statistics: { create: { matches: 0, wins: 0, losses: 0, points: 0 } },
    },
  })

  const admin = await prisma.user.create({
    data: {
      email: "admin@tornuti.app",
      password,
      name: "Admin Tornuti",
      handle: "equipo.tornuti",
      bio: "Equipo de la plataforma. Cuenta de administración para soporte.",
      aura: 0,
      role: Role.ADMIN,
      statistics: { create: { matches: 0, wins: 0, losses: 0, points: 0 } },
    },
  })

  const createTeam = (
    name: string,
    slug: string,
    category: string,
    city: string,
    motto: string,
    creatorId: string,
    memberIds: string[],
    stats: { matches: number; wins: number; losses: number; points: number },
    description: string,
  ) =>
    prisma.team.create({
      data: {
        name,
        slug,
        category,
        city,
        motto,
        description,
        createdById: creatorId,
        members: {
          create: memberIds.map((userId, index) => ({
            userId,
            role: index === 0 ? "captain" : "member",
          })),
        },
        statistics: { create: stats },
      },
    })

  const lasCadejas = await createTeam(
    "Las Cadejas",
    "las-cadejas",
    "deportes",
    "San Salvador",
    "Nadie corre sola.",
    valeria.id,
    [valeria.id, rebeca.id],
    { matches: 46, wins: 33, losses: 13, points: 99 },
    "Equipo de básquet 3x3 del barrio Las Cadejas. Juego rápido, pases cortos y defensa que incomoda.",
  )

  const vistaHermosa = await createTeam(
    "Vista Hermosa",
    "vista-hermosa",
    "deportes",
    "Mejicanos",
    "De la cancha al cuadro.",
    diego.id,
    [diego.id, oscar.id],
    { matches: 44, wins: 29, losses: 15, points: 87 },
    "Colectivo deportivo de Vista Hermosa. Competimos en cancha y en sala, sin cambiar de camiseta.",
  )

  const pixelPatria = await createTeam(
    "Pixel Patria",
    "pixel-patria",
    "gaming",
    "San Salvador",
    "Cinco en línea, cero excusas.",
    andrea.id,
    [andrea.id, fernanda.id],
    { matches: 39, wins: 31, losses: 8, points: 93 },
    "Escuadra de Valorant y EA FC. Prácticas los martes, torneos los fines de semana.",
  )

  const santaAna = await createTeam(
    "Santa Ana Five",
    "santa-ana-five",
    "deportes",
    "Santa Ana",
    "La casa se defiende.",
    luis.id,
    [luis.id, mauricio.id],
    { matches: 42, wins: 26, losses: 16, points: 78 },
    "Equipo de fútbol y básquet de Santa Ana. Viajamos a donde haya un cuadro que jugar.",
  )

  const laGarra = await createTeam(
    "La Garra",
    "la-garra",
    "cultura",
    "Santa Tecla",
    "Pensar también es competir.",
    camila.id,
    [camila.id],
    { matches: 28, wins: 21, losses: 7, points: 63 },
    "Ajedrez, debate y cartas. Entrenamos en la biblioteca y competimos en todo el país.",
  )

  const oficina404 = await createTeam(
    "Oficina 404",
    "oficina-404",
    "empresas",
    "San Salvador",
    "No encontramos la excusa.",
    admin.id,
    [admin.id, demo.id],
    { matches: 18, wins: 11, losses: 7, points: 33 },
    "Equipo corporativo de la plataforma. Jugamos después del trabajo, sin dejar de responder correos.",
  )

  const losDelFondo = await createTeam(
    "Los del Fondo",
    "los-del-fondo",
    "comunidad",
    "Soyapango",
    "El barrio juega junto.",
    demo.id,
    [demo.id],
    { matches: 4, wins: 1, losses: 3, points: 3 },
    "Equipo abierto para probar la plataforma. Cualquiera puede unirse y armar su propia historia.",
  )

  const copaCadejos = await prisma.tournament.create({
    data: {
      slug: "copa-cadejos-3x3",
      name: "Copa Cadejos 3x3",
      summary:
        "Doce equipos, una cancha y cuatro horas para decidir quién manda en el barrio.",
      description:
        "La sexta edición de la copa de básquet 3x3 vuelve al parque Cuscatlán. Formato de grupos cortos y eliminación directa desde cuartos. Se juega con reglas FIBA 3x3 adaptadas: 10 minutos o 21 puntos, lo que llegue primero. Habrá mesa de anotación, árbitros y una zona de calentamiento.",
      category: "deportes",
      sport: "Básquet 3x3",
      format: TournamentFormat.GROUPS_THEN_PLAYOFF,
      status: TournamentStatus.PUBLISHED,
      location: "Parque Cuscatlán, cancha 2",
      city: "San Salvador",
      startsAt: new Date("2026-11-07T15:00:00.000Z"),
      registrationEndsAt: new Date("2026-11-03T23:59:00.000Z"),
      maxParticipants: 16,
      auraPrize: 2400,
      cover: "court",
      organizerId: organizer.id,
      rules: [
        "Equipos de 3 jugadores y hasta 1 suplente.",
        "Partidos a 10 minutos o 21 puntos.",
        "Inscripción gratis; se confirma al completar la ficha del equipo.",
        "Aura para todos los participantes y bono extra al podio.",
      ],
    },
  })

  const liguilla = await prisma.tournament.create({
    data: {
      slug: "liguilla-aura-valorant",
      name: "Liguilla Aura: Valorant",
      summary:
        "Ocho escuadras, mapa fijo y una final al mejor de cinco transmitida en pantalla grande.",
      description:
        "Liguilla abierta para equipos amateur de Valorant. Fase de grupos en formato BO1, semifinales BO3 y final BO5. Los servidores se asignan al momento del check-in. Se permite un suplente por equipo. La organización comparte el código de sala 20 minutos antes de cada partido.",
      category: "gaming",
      sport: "Valorant",
      format: TournamentFormat.SINGLE_ELIMINATION,
      status: TournamentStatus.PUBLISHED,
      location: "Online · servidor Miami",
      city: "Nacional",
      startsAt: new Date("2026-11-14T01:00:00.000Z"),
      registrationEndsAt: new Date("2026-11-10T23:59:00.000Z"),
      maxParticipants: 16,
      auraPrize: 3000,
      cover: "grid",
      organizerId: organizer.id,
      rules: [
        "Equipos de 5 titulares y 1 suplente.",
        "Check-in obligatorio 30 minutos antes.",
        "Un solo cambio de jugador por serie.",
        "La final se juega al mejor de cinco mapas.",
      ],
    },
  })

  const ajedrez = await prisma.tournament.create({
    data: {
      slug: "ajedrez-del-barrio",
      name: "Ajedrez del Barrio",
      summary:
        "Rápida de 10+3 en el centro cultural. Tableros, relojes y café para todos.",
      description:
        "Torneo abierto de ajedrez rápido con ritmo de 10 minutos más 3 segundos de incremento. Se juega a siete rondas suizas. Hay categoría sub-14 y categoría libre. No se necesita ranking nacional ni federación: solo saber mover las piezas y querer jugar.",
      category: "cultura",
      sport: "Ajedrez rápido",
      format: TournamentFormat.SWISS,
      status: TournamentStatus.PUBLISHED,
      location: "Centro Cultural de San Salvador",
      city: "San Salvador",
      startsAt: new Date("2026-11-21T16:00:00.000Z"),
      registrationEndsAt: new Date("2026-11-19T23:59:00.000Z"),
      maxParticipants: 40,
      auraPrize: 1200,
      cover: "arc",
      organizerId: camila.id,
      rules: [
        "Siete rondas suizas, ritmo 10+3.",
        "Categoría libre y sub-14.",
        "Empate en primera posición se resuelve con partida relámpago.",
        "Se prestan tableros y relojes a quien lo necesite.",
      ],
    },
  })

  const voleibol = await prisma.tournament.create({
    data: {
      slug: "copa-voleibol-playa",
      name: "Copa Voleibol Playa",
      summary: "Cuatro parejas, arena caliente y un cuadro que no perdona.",
      description:
        "Cuadro de eliminación directa de voleibol playa en la cancha del malecón. Se juega al mejor de tres sets de 21 puntos, con tie-break a 15. Las semifinales arrancan a las nueve de la mañana y la final cierra la jornada. Hay hidratación y sombra para el público.",
      category: "deportes",
      sport: "Voleibol playa",
      format: TournamentFormat.SINGLE_ELIMINATION,
      status: TournamentStatus.IN_PROGRESS,
      location: "Malecón, cancha de arena 1",
      city: "La Libertad",
      startsAt: new Date("2026-10-17T15:00:00.000Z"),
      registrationEndsAt: new Date("2026-10-14T23:59:00.000Z"),
      maxParticipants: 8,
      auraPrize: 1600,
      cover: "court",
      organizerId: organizer.id,
      rules: [
        "Parejas de dos jugadores, sin suplentes.",
        "Mejor de tres sets: 21, 21 y 15.",
        "Cambio de lado cada siete puntos en el set decisivo.",
        "El equipo que llega tarde pierde el primer set.",
      ],
    },
  })

  const ligaBarrio = await prisma.tournament.create({
    data: {
      slug: "liga-de-barrio-apertura",
      name: "Liga de Barrio: Apertura",
      summary: "La primera liga de la temporada ya tiene campeón. La copa se queda en Cadejas.",
      description:
        "Liga de fútbol 5 entre colectivos de cuatro barrios. Se jugó a una sola vuelta durante tres sábados y cerró con eliminación directa. La final se definió por penales después de un empate 3-3. El acta completa queda disponible para consulta y réplica.",
      category: "comunidad",
      sport: "Fútbol 5",
      format: TournamentFormat.SINGLE_ELIMINATION,
      status: TournamentStatus.COMPLETED,
      location: "Cancha sintética El Carmen",
      city: "Soyapango",
      startsAt: new Date("2026-09-12T16:00:00.000Z"),
      registrationEndsAt: new Date("2026-09-08T23:59:00.000Z"),
      maxParticipants: 8,
      auraPrize: 1800,
      cover: "flag",
      organizerId: organizer.id,
      rules: [
        "Equipos de 5 titulares y hasta 3 suplentes.",
        "Tres puntos por victoria, uno por empate.",
        "Eliminación directa desde semifinales.",
        "Tarjeta roja: un partido de suspensión.",
      ],
    },
  })

  const registrations = [
    { tournamentId: copaCadejos.id, userId: valeria.id, teamId: lasCadejas.id, seed: 1 },
    { tournamentId: copaCadejos.id, userId: diego.id, teamId: vistaHermosa.id, seed: 2 },
    { tournamentId: copaCadejos.id, userId: luis.id, teamId: santaAna.id, seed: 3 },
    { tournamentId: copaCadejos.id, userId: camila.id, teamId: laGarra.id, seed: 4 },
    { tournamentId: liguilla.id, userId: andrea.id, teamId: pixelPatria.id, seed: 1 },
    { tournamentId: liguilla.id, userId: demo.id, teamId: oficina404.id, seed: 2 },
    { tournamentId: liguilla.id, userId: diego.id, teamId: vistaHermosa.id, seed: 3 },
    { tournamentId: liguilla.id, userId: camila.id, teamId: laGarra.id, seed: 4 },
    { tournamentId: ajedrez.id, userId: camila.id, seed: 1 },
    { tournamentId: ajedrez.id, userId: oscar.id, seed: 2 },
    { tournamentId: ajedrez.id, userId: fernanda.id, seed: 3 },
    { tournamentId: ajedrez.id, userId: demo.id, seed: 4 },
    { tournamentId: voleibol.id, userId: valeria.id, teamId: lasCadejas.id, seed: 1 },
    { tournamentId: voleibol.id, userId: diego.id, teamId: vistaHermosa.id, seed: 2 },
    { tournamentId: voleibol.id, userId: luis.id, teamId: santaAna.id, seed: 3 },
    { tournamentId: voleibol.id, userId: camila.id, teamId: laGarra.id, seed: 4 },
    { tournamentId: ligaBarrio.id, userId: valeria.id, teamId: lasCadejas.id, seed: 1 },
    { tournamentId: ligaBarrio.id, userId: diego.id, teamId: vistaHermosa.id, seed: 2 },
    { tournamentId: ligaBarrio.id, userId: luis.id, teamId: santaAna.id, seed: 3 },
    { tournamentId: ligaBarrio.id, userId: camila.id, teamId: laGarra.id, seed: 4 },
  ]

  await prisma.tournamentRegistration.createMany({
    data: registrations.map((registration) => ({
      ...registration,
      status: RegistrationStatus.ACCEPTED,
    })),
  })

  await prisma.match.createMany({
    data: [
      {
        tournamentId: voleibol.id,
        round: 1,
        position: 0,
        stage: "Semifinal",
        team1Id: lasCadejas.id,
        team2Id: vistaHermosa.id,
        winnerId: lasCadejas.id,
        score1: 21,
        score2: 18,
        status: MatchStatus.COMPLETED,
        scheduledAt: new Date("2026-10-17T15:00:00.000Z"),
      },
      {
        tournamentId: voleibol.id,
        round: 1,
        position: 1,
        stage: "Semifinal",
        team1Id: santaAna.id,
        team2Id: laGarra.id,
        winnerId: laGarra.id,
        score1: 16,
        score2: 21,
        status: MatchStatus.COMPLETED,
        scheduledAt: new Date("2026-10-17T16:00:00.000Z"),
      },
      {
        tournamentId: voleibol.id,
        round: 2,
        position: 0,
        stage: "Final",
        team1Id: lasCadejas.id,
        team2Id: laGarra.id,
        status: MatchStatus.SCHEDULED,
        scheduledAt: new Date("2026-10-24T17:00:00.000Z"),
      },
      {
        tournamentId: ligaBarrio.id,
        round: 1,
        position: 0,
        stage: "Semifinal",
        team1Id: lasCadejas.id,
        team2Id: santaAna.id,
        winnerId: lasCadejas.id,
        score1: 4,
        score2: 2,
        status: MatchStatus.COMPLETED,
        scheduledAt: new Date("2026-09-26T16:00:00.000Z"),
      },
      {
        tournamentId: ligaBarrio.id,
        round: 1,
        position: 1,
        stage: "Semifinal",
        team1Id: vistaHermosa.id,
        team2Id: laGarra.id,
        winnerId: vistaHermosa.id,
        score1: 3,
        score2: 1,
        status: MatchStatus.COMPLETED,
        scheduledAt: new Date("2026-09-26T17:00:00.000Z"),
      },
      {
        tournamentId: ligaBarrio.id,
        round: 2,
        position: 0,
        stage: "Final",
        team1Id: lasCadejas.id,
        team2Id: vistaHermosa.id,
        winnerId: lasCadejas.id,
        score1: 4,
        score2: 3,
        status: MatchStatus.COMPLETED,
        scheduledAt: new Date("2026-09-26T19:00:00.000Z"),
      },
    ],
  })

  await prisma.auraTransaction.createMany({
    data: [
      {
        userId: valeria.id,
        amount: 40,
        reason: AuraReason.REGISTRATION,
        description: "Inscripción a Copa Cadejos 3x3",
        tournamentId: copaCadejos.id,
      },
      {
        userId: valeria.id,
        amount: 20,
        reason: AuraReason.MATCH_PLAYED,
        description: "Partido jugado: Semifinal · Liga de Barrio: Apertura",
        tournamentId: ligaBarrio.id,
      },
      {
        userId: valeria.id,
        amount: 60,
        reason: AuraReason.MATCH_WIN,
        description: "Victoria en Semifinal · Liga de Barrio: Apertura",
        tournamentId: ligaBarrio.id,
      },
      {
        userId: valeria.id,
        amount: 1800,
        reason: AuraReason.PODIUM,
        description: "Campeón de Liga de Barrio: Apertura",
        tournamentId: ligaBarrio.id,
      },
      {
        userId: diego.id,
        amount: 40,
        reason: AuraReason.REGISTRATION,
        description: "Inscripción a Copa Cadejos 3x3",
        tournamentId: copaCadejos.id,
      },
      {
        userId: demo.id,
        amount: 40,
        reason: AuraReason.REGISTRATION,
        description: "Inscripción a Liguilla Aura: Valorant",
        tournamentId: liguilla.id,
      },
      {
        userId: demo.id,
        amount: 25,
        reason: AuraReason.ORGANIZER,
        description: "Creó el equipo Los del Fondo",
      },
    ],
  })

  const primeraSangre = await prisma.achievement.create({
    data: {
      slug: "primera-sangre",
      name: "Primera sangre",
      description: "Gana tu primer partido oficial dentro de la plataforma.",
      icon: "flame",
      criteria: "Primera victoria registrada",
      rewardAura: 50,
      category: "competencia",
    },
  })

  const cuadroCompleto = await prisma.achievement.create({
    data: {
      slug: "cuadro-completo",
      name: "Cuadro completo",
      description: "Participa en un torneo con cuadro de eliminación directa.",
      icon: "bracket",
      criteria: "Participación en eliminación directa",
      rewardAura: 80,
      category: "competencia",
    },
  })

  const buenaRacha = await prisma.achievement.create({
    data: {
      slug: "buena-racha",
      name: "Buena racha",
      description: "Gana tres partidos consecutivos en un mismo torneo.",
      icon: "spark",
      criteria: "Tres victorias consecutivas",
      rewardAura: 120,
      category: "constancia",
    },
  })

  const embajador = await prisma.achievement.create({
    data: {
      slug: "embajador-del-barrio",
      name: "Embajador del barrio",
      description: "Organiza un torneo abierto y súmalo al calendario público.",
      icon: "compass",
      criteria: "Primer torneo organizado",
      rewardAura: 150,
      category: "comunidad",
    },
  })

  await prisma.user.update({
    where: { id: valeria.id },
    data: {
      achievements: { connect: [{ id: primeraSangre.id }, { id: cuadroCompleto.id }, { id: buenaRacha.id }] },
    },
  })
  await prisma.user.update({
    where: { id: diego.id },
    data: { achievements: { connect: [{ id: cuadroCompleto.id }] } },
  })
  await prisma.user.update({
    where: { id: andrea.id },
    data: { achievements: { connect: [{ id: primeraSangre.id }] } },
  })
  await prisma.user.update({
    where: { id: organizer.id },
    data: { achievements: { connect: [{ id: embajador.id }] } },
  })
  await prisma.user.update({
    where: { id: demo.id },
    data: { achievements: { connect: [{ id: cuadroCompleto.id }] } },
  })

  const users = await prisma.user.count()
  const teams = await prisma.team.count()
  const tournaments = await prisma.tournament.count()

  console.log("Seed completado.")
  console.log(`Usuarios: ${users} · Equipos: ${teams} · Torneos: ${tournaments}`)
  console.log("Acceso demo: jugador@tornuti.app / tornuti123")
  console.log("Organizador: organiza@tornuti.app / tornuti123")
  console.log("Administración: admin@tornuti.app / tornuti123")
  console.log(`Equipos abiertos: ${losDelFondo.slug}`)
}

main()
  .catch((error) => {
    console.error("El seed falló:", error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
