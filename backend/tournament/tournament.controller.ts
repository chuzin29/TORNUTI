import { Controller, Post, Get, Body, Param, UseGuards, Query } from "@nestjs/common"
import { TournamentService } from "./tournament.service"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"

@Controller("tournament")
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @post("create")
  async create(
    @Body() tournamentData: any,
    @Request() req,
  ) {
    return this.tournamentService.create(tournamentData, req.user.userId)
  }

  @get()
  async findAll(@Query("page") page = 1, @Query("limit") limit = 10) {
    return this.tournamentService.findAll()
  }

  @get(":id")
  async findOne(@Param("id") id: string) {
    return this.tournamentService.findOne(id)
  }

  @post(":id/register")
  async register(
    @Param("id") tournamentId: string,
    @Request() req,
  ) {
    return this.tournamentService.register(tournamentId, req.user.userId)
  }