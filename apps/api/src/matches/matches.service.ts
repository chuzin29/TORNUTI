import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common"
import {
  AuraReason,
  MatchStatus,
  Role,
  TournamentStatus,
} from "@prisma/client"
import { PrismaService } from "../prisma/prisma.service"
import { recordAura } from "../aura/aura.helper"
import { nextMatchPosition, nextMatchSlot } from "../tournaments/bracket"
import { ReportResultDto } from "./dto/report-result.dto"

const matchInclude = {
  tournament: {
    select: {
      id: true,
      slug: true,
      name: true,
      organizerId: true,
      auraPrize: true,
      status: true,
    },
  },
  team1: { include: { members: { select: { userId: true } } } },
  team2: { include: { members: { select: { userId: true } } } },
} as const

@Injectable()
export class MatchesService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string) {
    const match = await this.prisma.match.findUnique({
      where: { id },
      include: {
        tournament: { select: { slug: true, name: true, status: true } },
        team1: { select: { id: true, name: true, slug: true } },
        team2: { select: { id: true, name: true, slug: true } },
        winner: { select: { id: true, name: true, slug: true } },
      },
    })
    if (!match) throw new NotFoundException("Partido no encontrado")
    return match
  }

  async start(id: string, user: { userId: string; role: string }) {
    const match = await this.prisma.match.findUnique({
      where: { id },
      include: { tournament: { select: { organizerId: true, id: true } } },
    })
    if (!match) throw new NotFoundException("Partido no encontrado")
    this.assertOwner(match.tournament.organizerId, user)

    if (match.status === MatchStatus.COMPLETED) {
      throw new BadRequestException("El partido ya está finalizado")
    }
    if (!match.team1Id || !match.team2Id) {
      throw new BadRequestException("El partido todavía no tiene ambos equipos")
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.match.update({
        where: { id },
        data: { status: MatchStatus.IN_PROGRESS },
      })
      await tx.tournament.updateMany({
        where: {
          id: match.tournamentId,
          status: { in: [TournamentStatus.PUBLISHED, TournamentStatus.IN_PROGRESS] },
        },
        data: { status: TournamentStatus.IN_PROGRESS },
      })
      return updated
    })
  }

  async reportResult(id: string, dto: ReportResultDto, user: { userId: string; role: string }) {
    const match = await this.prisma.match.findUnique({
      where: { id },
      include: matchInclude,
    })

    if (!match) throw new NotFoundException("Partido no encontrado")
    this.assertOwner(match.tournament.organizerId, user)

    if (match.status === MatchStatus.COMPLETED) {
      throw new BadRequestException("El partido ya está finalizado")
    }
    if (match.status === MatchStatus.CANCELLED) {
      throw new BadRequestException("El partido está cancelado")
    }
    if (!match.team1Id || !match.team2Id || !match.team1 || !match.team2) {
      throw new BadRequestException("El partido todavía no tiene ambos equipos")
    }
    if (dto.score1 === dto.score2) {
      throw new BadRequestException("Un partido de eliminación no puede terminar en empate")
    }

    const winnerId = dto.score1 > dto.score2 ? match.team1Id : match.team2Id
    const loserId = dto.score1 > dto.score2 ? match.team2Id : match.team1Id
    const winner = match.team1Id === winnerId ? match.team1 : match.team2
    const loser = match.team1Id === loserId ? match.team1 : match.team2

    return this.prisma.$transaction(
      async (tx) => {
        const updated = await tx.match.update({
          where: { id },
          data: {
            score1: dto.score1,
            score2: dto.score2,
            winnerId,
            status: MatchStatus.COMPLETED,
          },
          include: {
            team1: { select: { id: true, name: true } },
            team2: { select: { id: true, name: true } },
            winner: { select: { id: true, name: true } },
          },
        })

        const nextRound = match.round + 1
        const nextPosition = nextMatchPosition(match.position)
        const nextMatch = await tx.match.findUnique({
          where: {
            tournamentId_round_position: {
              tournamentId: match.tournamentId,
              round: nextRound,
              position: nextPosition,
            },
          },
        })

        if (nextMatch && nextMatch.status !== MatchStatus.COMPLETED) {
          const slot = nextMatchSlot(match.position)
          await tx.match.update({
            where: { id: nextMatch.id },
            data: { [slot]: winnerId, status: MatchStatus.SCHEDULED },
          })
        }

        await tx.tournament.updateMany({
          where: { id: match.tournamentId, status: TournamentStatus.PUBLISHED },
          data: { status: TournamentStatus.IN_PROGRESS },
        })

        await tx.teamStatistics.upsert({
          where: { teamId: winnerId },
          create: { teamId: winnerId, matches: 1, wins: 1, points: 3 },
          update: { matches: { increment: 1 }, wins: { increment: 1 }, points: { increment: 3 } },
        })
        await tx.teamStatistics.upsert({
          where: { teamId: loserId },
          create: { teamId: loserId, matches: 1, losses: 1 },
          update: { matches: { increment: 1 }, losses: { increment: 1 } },
        })

        const winnerMembers = new Set(winner.members.map((member) => member.userId))
        const loserMembers = new Set(loser.members.map((member) => member.userId))
        const description = `${match.stage} · ${match.tournament.name}`

        for (const userId of new Set([...winnerMembers, ...loserMembers])) {
          await tx.playerStatistics.upsert({
            where: { userId },
            create: {
              userId,
              matches: 1,
              wins: winnerMembers.has(userId) ? 1 : 0,
              losses: winnerMembers.has(userId) ? 0 : 1,
              points: winnerMembers.has(userId) ? 3 : 0,
            },
            update: {
              matches: { increment: 1 },
              ...(winnerMembers.has(userId)
                ? { wins: { increment: 1 }, points: { increment: 3 } }
                : { losses: { increment: 1 } }),
            },
          })

          await recordAura(tx, {
            userId,
            amount: 20,
            reason: AuraReason.MATCH_PLAYED,
            description: `Partido jugado: ${description}`,
            tournamentId: match.tournamentId,
            matchId: match.id,
          })
        }

        for (const userId of winnerMembers) {
          await recordAura(tx, {
            userId,
            amount: 60,
            reason: AuraReason.MATCH_WIN,
            description: `Victoria en ${description}`,
            tournamentId: match.tournamentId,
            matchId: match.id,
          })
        }

        // The final is the match without a next round. Closing it also closes
        // the tournament and pays the podium bonus proportionally.
        if (!nextMatch) {
          await tx.tournament.update({
            where: { id: match.tournamentId },
            data: { status: TournamentStatus.COMPLETED },
          })

          const bonus = Math.max(1, Math.floor(match.tournament.auraPrize / Math.max(1, winnerMembers.size)))
          for (const userId of winnerMembers) {
            await recordAura(tx, {
              userId,
              amount: bonus,
              reason: AuraReason.PODIUM,
              description: `Campeón de ${match.tournament.name}`,
              tournamentId: match.tournamentId,
            })
          }
        }

        return { match: updated, nextMatch }
      },
      { isolationLevel: "Serializable", timeout: 20_000 },
    )
  }

  private assertOwner(organizerId: string, user: { userId: string; role: string }) {
    if (user.role !== Role.ADMIN && organizerId !== user.userId) {
      throw new ForbiddenException("Solo quien organiza el torneo puede reportar resultados")
    }
  }
}
