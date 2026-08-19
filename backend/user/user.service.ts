import { Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    })
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    })
  }

  async updateAura(userId: string, amount: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { aura: { increment: amount } },
    })
  }

  async getStats(userId: string) {
    return this.prisma.playerStatistics.findUnique({
      where: { userId },
    })
  }