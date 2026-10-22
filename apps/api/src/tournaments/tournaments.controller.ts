import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import { CurrentUser } from "../common/decorators/current-user.decorator"
import { Public } from "../common/decorators/public.decorator"
import {
  CreateTournamentDto,
  GenerateBracketDto,
  RegisterTournamentDto,
  TournamentsQueryDto,
  UpdateTournamentDto,
} from "./dto/tournament.dto"
import { TournamentsService } from "./tournaments.service"

interface AuthenticatedUser {
  userId: string
  role: string
}

@ApiTags("tournaments")
@Controller("tournaments")
export class TournamentsController {
  constructor(private readonly tournaments: TournamentsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "Lista torneos publicados con filtros y paginación" })
  findAll(@Query() query: TournamentsQueryDto) {
    return this.tournaments.findAll(query)
  }

  @ApiBearerAuth()
  @Get("mine")
  @ApiOperation({ summary: "Torneos que organiza el usuario autenticado" })
  mine(@CurrentUser("userId") userId: string) {
    return this.tournaments.findMine(userId)
  }

  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: "Crea un torneo en borrador" })
  create(@Body() dto: CreateTournamentDto, @CurrentUser("userId") userId: string) {
    return this.tournaments.create(dto, userId)
  }

  @Public()
  @Get(":slug")
  @ApiOperation({ summary: "Detalle público por slug, con cuadro e inscritos" })
  findOne(@Param("slug") slug: string) {
    return this.tournaments.findBySlug(slug)
  }

  @ApiBearerAuth()
  @Patch(":id")
  @ApiOperation({ summary: "Actualiza la ficha del torneo" })
  update(
    @Param("id") id: string,
    @Body() dto: UpdateTournamentDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.tournaments.update(id, dto, user)
  }

  @ApiBearerAuth()
  @Post(":id/publish")
  @ApiOperation({ summary: "Publica el torneo y abre la inscripción" })
  publish(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.tournaments.publish(id, user)
  }

  @ApiBearerAuth()
  @Post(":id/cancel")
  @ApiOperation({ summary: "Cancela un torneo" })
  cancel(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.tournaments.cancel(id, user)
  }

  @ApiBearerAuth()
  @Post(":slug/register")
  @ApiOperation({ summary: "Inscribe al usuario (y opcionalmente a su equipo)" })
  register(
    @Param("slug") slug: string,
    @Body() dto: RegisterTournamentDto,
    @CurrentUser("userId") userId: string,
  ) {
    return this.tournaments.register(slug, dto, userId)
  }

  @ApiBearerAuth()
  @Delete(":slug/register")
  @ApiOperation({ summary: "Retira la inscripción propia" })
  withdraw(@Param("slug") slug: string, @CurrentUser("userId") userId: string) {
    return this.tournaments.withdraw(slug, userId)
  }

  @ApiBearerAuth()
  @Post(":slug/bracket")
  @ApiOperation({ summary: "Genera el cuadro de eliminación directa" })
  bracket(
    @Param("slug") slug: string,
    @Body() dto: GenerateBracketDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.tournaments.generateBracket(slug, dto, user)
  }
}
