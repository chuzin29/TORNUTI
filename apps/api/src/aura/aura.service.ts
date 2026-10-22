import { Injectable } from "@nestjs/common"
import { AuraReason } from "@prisma/client"
import { PrismaService } from "../prisma/prisma.service"
import { PaginationQueryDto } from "../common/dto/pagination.dto"
import { recordAura } from "./aura.helper"

@Injectable()
export class AuraService {
  constructor(private readonly prisma: PrismaService) {}

  async leaderboard(limit = 20) {
    const users = await this.prisma.user.findMany({
      orderBy: [{ aura: "desc" }, { createdAt: "asc" }],
      take: Math.min(Math.max(limit, 1), 100),
      select: {
        id: true,
        name: true,
        handle: true,
        aura: true,
        avatarUrl: true,
        statistics: { select: { matches: true, wins: true, losses: true, draws: true, points: true } },
        teamMemberships: {
          take: 1,
          select: { team: { select: { name: true, slug: true, category: true } } },
        },
      },
    })

    return users.map((user, index) => ({
      position: index + 1,
      id: user.id,
      name: user.name,
      handle: user.handle,
      avatarUrl: user.avatarUrl,
      aura: user.aura,
      statistics: user.statistics,
      team: user.teamMemberships[0]?.team ?? null,
    }))
  }

  async history(userId: string, query: PaginationQueryDto) {
    const page = query.page ?? 1
    const limit = query.limit ?? 20
    const [items, total] = await this.prisma.$transaction([
      this.prisma.auraTransaction.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.auraTransaction.count({ where: { userId } }),
    ])

    return { items, total, page, limit, pages: Math.ceil(total / limit) }
  }

  async award(input: {
    userId: string
    amount: number
    reason: AuraReason
    description: string
    tournamentId?: string
    matchId?: string
  }) {
    return this.prisma.$transaction((tx) => recordAura(tx, input))
  }
}
