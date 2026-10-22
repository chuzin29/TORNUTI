import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common"
import {
  AuraReason,
  MatchStatus,
  Prisma,
  RegistrationStatus,
  Role,
  TournamentStatus,
} from "@prisma/client"
import { PrismaService } from "../prisma/prisma.service"
import { uniqueSlug } from "../common/utils/slug"
import { recordAura } from "../aura/aura.helper"
import { planSingleElimination } from "./bracket"
import {
  CreateTournamentDto,
  GenerateBracketDto,
  RegisterTournamentDto,
  TournamentsQueryDto,
  UpdateTournamentDto,
} from "./dto/tournament.dto"

const organizerSelect = { id: true, name: true, handle: true, avatarUrl: true } as const

const PUBLIC_STATUSES: TournamentStatus[] = [
  TournamentStatus.PUBLISHED,
  TournamentStatus.IN_PROGRESS,
  TournamentStatus.COMPLETED,
]

@Injectable()
export class TournamentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTournamentDto, userId: string) {
    const startsAt = new Date(dto.startsAt)
    const registrationEndsAt = new Date(dto.registrationEndsAt)
    this.assertDates(startsAt, registrationEndsAt)

    const slug = await uniqueSlug(dto.name, async (candidate) => {
      const found = await this.prisma.tournament.findUnique({
        where: { slug: candidate },
        select: { id: true },
      })
      return Boolean(found)
    })

    return this.prisma.tournament.create({
      data: {
        slug,
        name: dto.name.trim(),
        summary: dto.summary?.trim(),
        description: dto.description.trim(),
        category: dto.category,
        sport: dto.sport?.trim(),
        format: dto.format ?? "SINGLE_ELIMINATION",
        location: dto.location.trim(),
        city: dto.city.trim(),
        startsAt,
        registrationEndsAt,
        maxParticipants: dto.maxParticipants,
        auraPrize: dto.auraPrize ?? 0,
        rules: dto.rules ?? [],
        cover: dto.cover ?? "court",
        organizerId: userId,
      },
      include: { organizer: { select: organizerSelect } },
    })
  }

  async findAll(query: TournamentsQueryDto) {
    const page = Number(query.page) || 1
    const limit = Math.min(Number(query.limit) || 12, 50)

    const statusFilter = query.status
      ? PUBLIC_STATUSES.includes(query.status)
        ? query.status
        : { in: [] as TournamentStatus[] }
      : { in: PUBLIC_STATUSES }

    const where: Prisma.TournamentWhereInput = {
      status: statusFilter,
      ...(query.category ? { category: query.category } : {}),
      ...(query.format ? { format: query.format } : {}),
      ...(query.q
        ? {
            OR: [
              { name: { contains: query.q, mode: "insensitive" } },
              { summary: { contains: query.q, mode: "insensitive" } },
              { location: { contains: query.q, mode: "insensitive" } },
              { city: { contains: query.q, mode: "insensitive" } },
              { sport: { contains: query.q, mode: "insensitive" } },
            ],
          }
        : {}),
    }

    const orderBy: Prisma.TournamentOrderByWithRelationInput =
      query.sort === "aura"
        ? { auraPrize: "desc" }
        : query.sort === "recent"
          ? { createdAt: "desc" }
          : { startsAt: "asc" }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.tournament.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          organizer: { select: organizerSelect },
          _count: {
            select: {
              registrations: { where: { status: RegistrationStatus.ACCEPTED } },
            },
          },
        },
      }),
      this.prisma.tournament.count({ where }),
    ])

    return {
      items: items.map(({ _count, ...tournament }) => ({
        ...tournament,
        participants: _count.registrations,
      })),
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    }
  }

  async findMine(userId: string) {
    const items = await this.prisma.tournament.findMany({
      where: { organizerId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        organizer: { select: organizerSelect },
        _count: {
          select: { registrations: { where: { status: RegistrationStatus.ACCEPTED } } },
        },
      },
    })

    return items.map(({ _count, ...tournament }) => ({
      ...tournament,
      participants: _count.registrations,
    }))
  }

  async findBySlug(slug: string) {
    const tournament = await this.prisma.tournament.findUnique({
      where: { slug },
      include: {
        organizer: { select: organizerSelect },
        _count: {
          select: { registrations: { where: { status: RegistrationStatus.ACCEPTED } } },
        },
        registrations: {
          where: { status: { in: [RegistrationStatus.PENDING, RegistrationStatus.ACCEPTED] } },
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            status: true,
            seed: true,
            createdAt: true,
            user: {
              select: { id: true, name: true, handle: true, aura: true, avatarUrl: true },
            },
            team: { select: { id: true, slug: true, name: true, logoUrl: true } },
          },
        },
        matches: {
          orderBy: [{ round: "asc" }, { position: "asc" }],
          include: {
            team1: { select: { id: true, slug: true, name: true, logoUrl: true } },
            team2: { select: { id: true, slug: true, name: true, logoUrl: true } },
            winner: { select: { id: true, slug: true, name: true } },
          },
        },
      },
    })

    if (!tournament || !PUBLIC_STATUSES.includes(tournament.status)) {
      throw new NotFoundException("Torneo no encontrado")
    }

    const { _count, ...rest } = tournament
    return { ...rest, participants: _count.registrations }
  }

  async update(id: string, dto: UpdateTournamentDto, user: { userId: string; role: string }) {
    const tournament = await this.prisma.tournament.findUnique({
      where: { id },
      select: { organizerId: true, maxParticipants: true },
    })
    if (!tournament) throw new NotFoundException("Torneo no encontrado")
    this.assertOwner(tournament.organizerId, user)

    const startsAt = dto.startsAt ? new Date(dto.startsAt) : undefined
    const registrationEndsAt = dto.registrationEndsAt ? new Date(dto.registrationEndsAt) : undefined
    if (startsAt && registrationEndsAt) this.assertDates(startsAt, registrationEndsAt)

    if (dto.maxParticipants !== undefined) {
      const accepted = await this.prisma.tournamentRegistration.count({
        where: { tournamentId: id, status: RegistrationStatus.ACCEPTED },
      })
      if (dto.maxParticipants < accepted) {
        throw new BadRequestException(
          `No puedes dejar los cupos por debajo de las ${accepted} inscripciones aceptadas`,
        )
      }
    }

    return this.prisma.tournament.update({
      where: { id },
      data: {
        name: dto.name?.trim(),
        summary: dto.summary?.trim(),
        description: dto.description?.trim(),
        category: dto.category,
        sport: dto.sport?.trim(),
        format: dto.format,
        location: dto.location?.trim(),
        city: dto.city?.trim(),
        startsAt,
        registrationEndsAt,
        maxParticipants: dto.maxParticipants,
        auraPrize: dto.auraPrize,
        rules: dto.rules,
        cover: dto.cover,
      },
      include: { organizer: { select: organizerSelect } },
    })
  }

  async publish(id: string, user: { userId: string; role: string }) {
    const tournament = await this.prisma.tournament.findUnique({
      where: { id },
      select: { organizerId: true, status: true },
    })
    if (!tournament) throw new NotFoundException("Torneo no encontrado")
    this.assertOwner(tournament.organizerId, user)

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.tournament.update({
        where: { id },
        data: { status: TournamentStatus.PUBLISHED },
      })

      // Publishing makes the account an organizer. It keeps the permission
      // model honest without a separate onboarding step.
      await tx.user.updateMany({
        where: { id: user.userId, role: Role.PLAYER },
        data: { role: Role.ORGANIZER },
      })

      return updated
    })
  }

  async cancel(id: string, user: { userId: string; role: string }) {
    const tournament = await this.prisma.tournament.findUnique({
      where: { id },
      select: { organizerId: true },
    })
    if (!tournament) throw new NotFoundException("Torneo no encontrado")
    this.assertOwner(tournament.organizerId, user)

    return this.prisma.tournament.update({
      where: { id },
      data: { status: TournamentStatus.CANCELLED },
    })
  }

  async register(slug: string, dto: RegisterTournamentDto, userId: string) {
    const tournament = await this.prisma.tournament.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        status: true,
        registrationEndsAt: true,
        maxParticipants: true,
        auraPrize: true,
      },
    })

    if (!tournament) throw new NotFoundException("Torneo no encontrado")
    if (tournament.status !== TournamentStatus.PUBLISHED) {
      throw new BadRequestException("El torneo no está recibiendo inscripciones")
    }
    if (new Date() > tournament.registrationEndsAt) {
      throw new BadRequestException("El plazo de inscripción ya cerró")
    }

    if (dto.teamId) {
      const team = await this.prisma.team.findUnique({
        where: { id: dto.teamId },
        select: { id: true, name: true },
      })
      if (!team) throw new NotFoundException("Equipo no encontrado")

      const membership = await this.prisma.teamMember.findUnique({
        where: { userId_teamId: { userId, teamId: team.id } },
        select: { id: true },
      })
      if (!membership) {
        throw new ForbiddenException("Debes pertenecer al equipo para inscribirlo")
      }

      const teamRegistration = await this.prisma.tournamentRegistration.findFirst({
        where: {
          tournamentId: tournament.id,
          teamId: team.id,
          status: { in: [RegistrationStatus.PENDING, RegistrationStatus.ACCEPTED] },
        },
        select: { id: true },
      })
      if (teamRegistration) {
        throw new ConflictException("Ese equipo ya tiene una inscripción activa")
      }
    }

    const existing = await this.prisma.tournamentRegistration.findUnique({
      where: { tournamentId_userId: { tournamentId: tournament.id, userId } },
    })

    if (existing && existing.status !== RegistrationStatus.WITHDRAWN) {
      throw new ConflictException("Ya tienes una inscripción en este torneo")
    }

    return this.prisma.$transaction(
      async (tx) => {
        const accepted = await tx.tournamentRegistration.count({
          where: {
            tournamentId: tournament.id,
            status: { in: [RegistrationStatus.PENDING, RegistrationStatus.ACCEPTED] },
          },
        })

        if (accepted >= tournament.maxParticipants) {
          throw new BadRequestException("El torneo ya completó sus cupos")
        }

        const registration = existing
          ? await tx.tournamentRegistration.update({
              where: { id: existing.id },
              data: {
                status: RegistrationStatus.ACCEPTED,
                teamId: dto.teamId,
                seed: accepted + 1,
              },
              include: { team: { select: { id: true, name: true, slug: true } } },
            })
          : await tx.tournamentRegistration.create({
              data: {
                tournamentId: tournament.id,
                userId,
                teamId: dto.teamId,
                status: RegistrationStatus.ACCEPTED,
                seed: accepted + 1,
              },
              include: { team: { select: { id: true, name: true, slug: true } } },
            })

        if (!existing) {
          await recordAura(tx, {
            userId,
            amount: 40,
            reason: AuraReason.REGISTRATION,
            description: `Inscripción a ${tournament.name}`,
            tournamentId: tournament.id,
          })
        }

        return registration
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, timeout: 15_000 },
    )
  }

  async withdraw(slug: string, userId: string) {
    const tournament = await this.prisma.tournament.findUnique({
      where: { slug },
      select: { id: true },
    })
    if (!tournament) throw new NotFoundException("Torneo no encontrado")

    const registration = await this.prisma.tournamentRegistration.findUnique({
      where: { tournamentId_userId: { tournamentId: tournament.id, userId } },
    })
    if (!registration || registration.status === RegistrationStatus.WITHDRAWN) {
      throw new NotFoundException("No tienes una inscripción activa en este torneo")
    }

    await this.prisma.tournamentRegistration.update({
      where: { id: registration.id },
      data: { status: RegistrationStatus.WITHDRAWN },
    })

    return { message: "Inscripción retirada" }
  }

  async generateBracket(
    slug: string,
    dto: GenerateBracketDto,
    user: { userId: string; role: string },
  ) {
    const tournament = await this.prisma.tournament.findUnique({
      where: { slug },
      include: {
        registrations: {
          where: { status: RegistrationStatus.ACCEPTED },
          orderBy: [{ seed: "asc" }, { createdAt: "asc" }],
          include: { team: { select: { id: true, name: true } } },
        },
      },
    })

    if (!tournament) throw new NotFoundException("Torneo no encontrado")
    this.assertOwner(tournament.organizerId, user)

    if (tournament.status === TournamentStatus.DRAFT) {
      throw new BadRequestException("Publica el torneo antes de generar el cuadro")
    }
    if (tournament.registrations.length < 2) {
      throw new BadRequestException("Necesitas al menos dos inscripciones aceptadas")
    }
    if (tournament.registrations.some((registration) => !registration.team)) {
      throw new BadRequestException(
        "Todas las inscripciones aceptadas deben estar asociadas a un equipo",
      )
    }

    const existingMatches = await this.prisma.match.count({
      where: { tournamentId: tournament.id },
    })
    if (existingMatches > 0 && !dto.force) {
      throw new ConflictException(
        "El cuadro ya existe. Envía force=true para reemplazarlo y borrar los resultados",
      )
    }

    const plan = planSingleElimination(
      tournament.registrations.map((registration) => ({
        id: registration.team!.id,
        name: registration.team!.name,
      })),
    )

    const base = tournament.startsAt.getTime()
    const data: Prisma.MatchCreateManyInput[] = plan.map((match) => ({
      tournamentId: tournament.id,
      round: match.round,
      position: match.position,
      stage: match.stage,
      team1Id: match.team1Id,
      team2Id: match.team2Id,
      winnerId: match.winnerId,
      status: match.status,
      scheduledAt:
        match.status === MatchStatus.SCHEDULED
          ? new Date(base + (match.round - 1) * 60 * 60 * 1000)
          : null,
    }))

    await this.prisma.$transaction(async (tx) => {
      await tx.match.deleteMany({ where: { tournamentId: tournament.id } })
      await tx.match.createMany({ data })
    })

    return this.prisma.match.findMany({
      where: { tournamentId: tournament.id },
      orderBy: [{ round: "asc" }, { position: "asc" }],
      include: {
        team1: { select: { id: true, name: true, slug: true } },
        team2: { select: { id: true, name: true, slug: true } },
        winner: { select: { id: true, name: true, slug: true } },
      },
    })
  }

  private assertOwner(organizerId: string, user: { userId: string; role: string }) {
    if (user.role !== Role.ADMIN && organizerId !== user.userId) {
      throw new ForbiddenException("Solo quien organiza el torneo puede hacer esta acción")
    }
  }

  private assertDates(startsAt: Date, registrationEndsAt: Date) {
    if (Number.isNaN(startsAt.getTime()) || Number.isNaN(registrationEndsAt.getTime())) {
      throw new BadRequestException("Las fechas no son válidas")
    }
    if (registrationEndsAt >= startsAt) {
      throw new BadRequestException("El cierre de inscripción debe ser anterior al inicio")
    }
  }
}
