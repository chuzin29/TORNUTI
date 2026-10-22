import { Controller, Get, Query } from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsInt, IsOptional, Max, Min } from "class-validator"
import { Public } from "../common/decorators/public.decorator"
import { CurrentUser } from "../common/decorators/current-user.decorator"
import { PaginationQueryDto } from "../common/dto/pagination.dto"
import { AuraService } from "./aura.service"

class LeaderboardQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number
}

@ApiTags("aura")
@Controller("aura")
export class AuraController {
  constructor(private readonly aura: AuraService) {}

  @Public()
  @Get("leaderboard")
  @ApiOperation({ summary: "Ranking público por Aura acumulada" })
  @ApiQuery({ name: "limit", required: false, example: 20 })
  leaderboard(@Query() query: LeaderboardQueryDto) {
    return this.aura.leaderboard(query.limit ?? 20)
  }

  @ApiBearerAuth()
  @Get("me")
  @ApiOperation({ summary: "Historial de Aura del usuario autenticado" })
  history(@CurrentUser("userId") userId: string, @Query() query: PaginationQueryDto) {
    return this.aura.history(userId, query)
  }
}
