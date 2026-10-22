import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common"
import { AuraReason } from "@prisma/client"
import { PrismaService } from "../prisma/prisma.service"
import { uniqueSlug } from "../common/utils/slug"
import { recordAura } from "../aura/aura.helper"
import { CreateTeamDto, TeamsQueryDto } from "./dto/team.dto"

@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTeamDto, userId: string) {
    const slug = await uniqueSlug(dto.name, async (candidate) => {
      const found = await this.prisma.team.findUnique({ where: { slug: candidate }, select: { id: true } })
      return Boolean(found)
    })

    return this.prisma.$transaction(async (tx) => {
      const team = await tx.team.create({
        data: {
          slug,
          name: dto.name.trim(),
          motto: dto.motto?.trim(),
          description: dto.description?.trim(),
          category: dto.category,
          city: dto.city?.trim(),
          logoUrl: dto.logoUrl,
          createdById: userId,
          members: { create: { userId, role: "captain" } },
          statistics: { create: {} },
        },
        include: { _count: { select: { members: true } }, statistics: true },
      })

      await recordAura(tx, {
        userId,
        amount: 25,
        reason: AuraReason.ORGANIZER,
        description: `Creó el equipo ${team.name}`,
      })

      return team
    })
  }

  async findAll(query: TeamsQueryDto) {
    const page = Number(query.page) || 1
    const limit = Math.min(Number(query.limit) || 20, 50)
    const where = {
      ...(query.category ? { category: query.category } : {}),
      ...(query.q
        ? {
            OR: [
              { name: { contains: query.q, mode: "insensitive" as const } },
              { motto: { contains: query.q, mode: "insensitive" as const } },
              { city: { contains: query.q, mode: "insensitive" as const } },
            ],
          }
        : {}),
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.team.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ statistics: { wins: "desc" } }, { name: "asc" }],
        include: {
          _count: { select: { members: true } },
          statistics: true,
          members: {
            take: 5,
            select: { user: { select: { id: true, name: true, handle: true, avatarUrl: true } } },
          },
        },
      }),
      this.prisma.team.count({ where }),
    ])

    return { items, total, page, limit, pages: Math.ceil(total / limit) }
  }

  async findBySlug(slug: string) {
    const team = await this.prisma.team.findUnique({
      where: { slug },
      include: {
        creator: { select: { id: true, name: true, handle: true } },
        statistics: true,
        members: {
          orderBy: { joinedAt: "asc" },
          select: {
            role: true,
            joinedAt: true,
            user: { select: { id: true, name: true, handle: true, aura: true, avatarUrl: true } },
          },
        },
      },
    })

    if (!team) throw new NotFoundException("Equipo no encontrado")
    return team
  }

  async join(slug: string, userId: string) {
    const team = await this.prisma.team.findUnique({
      where: { slug },
      select: { id: true, name: true },
    })
    if (!team) throw new NotFoundException("Equipo no encontrado")

    const existing = await this.prisma.teamMember.findUnique({
      where: { userId_teamId: { userId, teamId: team.id } },
    })
    if (existing) throw new BadRequestException("Ya eres miembro de este equipo")

    const members = await this.prisma.teamMember.count({ where: { teamId: team.id } })
    if (members >= 30) throw new BadRequestException("El equipo alcanzó el límite de 30 miembros")

    return this.prisma.$transaction(async (tx) => {
      const membership = await tx.teamMember.create({
        data: { userId, teamId: team.id, role: "member" },
      })

      await recordAura(tx, {
        userId,
        amount: 15,
        reason: AuraReason.ACHIEVEMENT,
        description: `Se unió al equipo ${team.name}`,
      })

      return { message: "Te has unido al equipo", membership }
    })
  }

  async leave(slug: string, userId: string) {
    const team = await this.prisma.team.findUnique({
      where: { slug },
      include: { members: { orderBy: { joinedAt: "asc" } } },
    })
    if (!team) throw new NotFoundException("Equipo no encontrado")

    const membership = team.members.find((member) => member.userId === userId)
    if (!membership) throw new BadRequestException("No eres miembro de este equipo")

    return this.prisma.$transaction(async (tx) => {
      await tx.teamMember.delete({ where: { id: membership.id } })

      if (membership.role === "captain") {
        const next = team.members.find((member) => member.userId !== userId)
        if (next) {
          await tx.teamMember.update({ where: { id: next.id }, data: { role: "captain" } })
        }
      }

      return { message: "Has salido del equipo" }
    })
  }

  async myTeams(userId: string) {
    return this.prisma.teamMember.findMany({
      where: { userId },
      include: { team: { include: { statistics: true, _count: { select: { members: true } } } } },
    })
  }

  async assertMember(teamId: string, userId: string) {
    const membership = await this.prisma.teamMember.findUnique({
      where: { userId_teamId: { userId, teamId } },
      select: { role: true },
    })
    if (!membership) throw new ForbiddenException("Debes pertenecer al equipo para inscribirlo")
    return membership
  }

  async removeMember(slug: string, memberId: string, requesterId: string, isAdmin: boolean) {
    const team = await this.prisma.team.findUnique({
      where: { slug },
      select: { id: true, createdById: true },
    })
    if (!team) throw new NotFoundException("Equipo no encontrado")

    const membership = await this.prisma.teamMember.findUnique({
      where: { userId_teamId: { userId: memberId, teamId: team.id } },
    })
    if (!membership) throw new NotFoundException("Miembro no encontrado")

    const canManage = isAdmin || team.createdById === requesterId
    if (!canManage) throw new ForbiddenException("Solo el capitán puede retirar miembros")

    await this.prisma.teamMember.delete({ where: { id: membership.id } })
    return { message: "Miembro retirado del equipo" }
  }
}
