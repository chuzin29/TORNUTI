import { Injectable, BadRequestException } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"

@Injectable()
export class TeamService {
  constructor(private prisma: PrismaService) {}

  async create(name: string, description: string, category: string, createdBy: string) {
    const creator = await this.prisma.user.findUnique({
      where: { id: createdBy },
    })

    if (!creator) {
      throw new BadRequestException("Creador no encontrado")
    }

    const team = await this.prisma.team.create({
      data: {
        name,
        description,
        category,
        createdBy,
      },
    })

    // Add creator as member/captain
    await this.prisma.teamMember.create({
      data: {
        userId: createdBy,
        teamId: team.id,
        role: "captain",
      },
    })

    return team
  }

  async findByUser(userId: string) {
    return this.prisma.teamMember.findMany({
      where: { userId },
      include: { team: true },
    })
  }

  async join(teamId: string, userId: string) {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
    })

    if (!team) {
      throw new BadRequestException("Equipo no encontrado")
    }

    // Check if user already in team
    const existingMember = await this.prisma.teamMember.findFirst({
      where: { userId, teamId },
    })

    if (existingMember) {
      throw new BadRequestException("Ya eres miembro de este equipo")
    }

    await this.prisma.teamMember.create({
      data: {
        userId,
        teamId,
        role: "member",
      },
    })

    return { team, message: "Te has unido al equipo" }
  }