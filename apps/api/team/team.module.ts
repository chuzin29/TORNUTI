import { Module } from "@nestjs/common"
import { TeamController } from "./team.controller"
import { TeamService } from "./team.service"
import { PrismaService } from "../prisma/prisma.service"

@Module({
  controllers: [TeamController],
  providers: [TeamService, PrismaService],
})
export class TeamModule {}