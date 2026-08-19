import { Injectable, BadRequestException } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"

@Injectable()
export class TournamentService {
  constructor(private prisma: PrismaService) {}

  async create(tournamentData: any, organizerId: string) {
    const organizer = await this.prisma.user.findUnique({
      where: { id: organizerId },
    })

    if (!organizer) {
      throw new BadRequestException("Organizador no encontrado")
    }

    const tournament = await this.prisma.tournament.create({
      data: {
        name: tournamentData.name,
        description: tournamentData.description,
        format: tournamentData.format,
        category: tournamentData.category,
        maxParticipants: tournamentData.maxParticipants ?? 16,
        organizer: organizerId,
        status: "draft",
      },
    })

    return tournament
  }

  async findAll() {
    return this.prisma.tournament.findMany({
      where: { status: "published" },
      include: {
        organizerRel: {
          select: { id: true, name: true, image: true },
        },
      },
    })
  }

  async findOne(id: string) {
    return this.prisma.tournament.findUnique({
      where: { id },
      include: {
        organizerRel: {
          select: { id: true, name: true, image: true },
        },
        registrations: {
          where: { status: "accepted" },
          include: { user: { select: { id: true, name: true, aura: true } }, team: { select: { id: true, name: true } } },
        },
      },
    })
  }

  async register(tournamentId: string, userId: string, teamId?: string) {
    const tournament = await this.prisma.tournament.findUnique({
      where: { id: tournamentId },
    })

    if (!tournament) {
      throw new BadRequestException("Torneo no encontrado")
    }

    if (tournament.currentParticipants >= tournament.maxParticipants) {
      throw new BadRequestException("Torneo lleno")
    }

    const registration = await this.prisma.tournamentRegistration.create({
      data: {
        tournamentId,
        userId,
        teamId,
        status: "pending",
      },
    })

    // Update participant count
    await this.prisma.tournament.update({
      where: { id: tournamentId },
      data: { currentParticipants: { increment: 1 } },
    })

    return registration
  }