import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import { CurrentUser } from "../common/decorators/current-user.decorator"
import { Public } from "../common/decorators/public.decorator"
import { CreateTeamDto, TeamsQueryDto } from "./dto/team.dto"
import { TeamsService } from "./teams.service"

@ApiTags("teams")
@Controller("teams")
export class TeamsController {
  constructor(private readonly teams: TeamsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "Lista equipos públicos" })
  findAll(@Query() query: TeamsQueryDto) {
    return this.teams.findAll(query)
  }

  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: "Crea un equipo y asigna al creador como capitán" })
  create(@Body() dto: CreateTeamDto, @CurrentUser("userId") userId: string) {
    return this.teams.create(dto, userId)
  }

  @ApiBearerAuth()
  @Get("me")
  @ApiOperation({ summary: "Equipos del usuario autenticado" })
  mine(@CurrentUser("userId") userId: string) {
    return this.teams.myTeams(userId)
  }

  @Public()
  @Get(":slug")
  @ApiOperation({ summary: "Detalle público de un equipo" })
  findOne(@Param("slug") slug: string) {
    return this.teams.findBySlug(slug)
  }

  @ApiBearerAuth()
  @Post(":slug/join")
  @ApiOperation({ summary: "Unirse a un equipo" })
  join(@Param("slug") slug: string, @CurrentUser("userId") userId: string) {
    return this.teams.join(slug, userId)
  }

  @ApiBearerAuth()
  @Delete(":slug/leave")
  @ApiOperation({ summary: "Salir de un equipo" })
  leave(@Param("slug") slug: string, @CurrentUser("userId") userId: string) {
    return this.teams.leave(slug, userId)
  }

  @ApiBearerAuth()
  @Delete(":slug/members/:memberId")
  @ApiOperation({ summary: "Retirar un miembro (capitán o admin)" })
  removeMember(
    @Param("slug") slug: string,
    @Param("memberId") memberId: string,
    @CurrentUser() user: { userId: string; role: string },
  ) {
    return this.teams.removeMember(slug, memberId, user.userId, user.role === "ADMIN")
  }
}
