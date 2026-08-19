import { Controller, Post, Get, Body, Param, UseGuards } from "@nestjs/common"
import { TeamService } from "./team.service"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"

@Controller("team")
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @post("create")
  async create(
    @Body() data: { name: string; description?: string; category: string },
    @Request() req,
  ) {
    return this.teamService.create(data.name, data.description, data.category, req.user.userId)
  }

  @get("my-teams")
  async myTeams(@Request() req) {
    return this.teamService.findByUser(req.user.userId)
  }

  @post(":id/join")
  async join(@Param("id") teamId: string, @Request() req) {
    return this.teamService.join(teamId, req.user.userId)
  }