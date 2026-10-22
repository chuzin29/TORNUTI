import { Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { UpdateUserDto } from "./dto/update-user.dto"

const publicSelect = {
  id: true,
  name: true,
  handle: true,
  bio: true,
  avatarUrl: true,
  role: true,
  aura: true,
  createdAt: true,
  statistics: true,
} as const

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findPublicProfile(handle: string) {
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ handle }, { id: handle }] },
      select: {
        ...publicSelect,
        teamMemberships: {
          select: {
            role: true,
            team: { select: { id: true, slug: true, name: true, category: true, city: true } },
          },
        },
        registrations: {
          where: { status: "ACCEPTED" },
          take: 10,
          orderBy: { createdAt: "desc" },
          select: {
            status: true,
            createdAt: true,
            tournament: {
              select: { slug: true, name: true, startsAt: true, status: true, category: true },
            },
          },
        },
      },
    })

    if (!user) throw new NotFoundException("Jugador no encontrado")
    return user
  }

  async updateMe(userId: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.name?.trim(),
        bio: dto.bio?.trim(),
        avatarUrl: dto.avatarUrl,
      },
      select: publicSelect,
    })
  }

  async myTeams(userId: string) {
    const memberships = await this.prisma.teamMember.findMany({
      where: { userId },
      orderBy: { joinedAt: "desc" },
      include: {
        team: {
          include: {
            statistics: true,
            _count: { select: { members: true } },
          },
        },
      },
    })

    return memberships.map((membership) => ({
      role: membership.role,
      joinedAt: membership.joinedAt,
      ...membership.team,
    }))
  }
}
