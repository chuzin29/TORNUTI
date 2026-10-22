import { Body, Controller, Get, Param, Patch } from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import { CurrentUser } from "../common/decorators/current-user.decorator"
import { Public } from "../common/decorators/public.decorator"
import { ReportResultDto } from "./dto/report-result.dto"
import { MatchesService } from "./matches.service"

@ApiTags("matches")
@Controller("matches")
export class MatchesController {
  constructor(private readonly matches: MatchesService) {}

  @Public()
  @Get(":id")
  @ApiOperation({ summary: "Detalle público de un partido" })
  findOne(@Param("id") id: string) {
    return this.matches.findOne(id)
  }

  @ApiBearerAuth()
  @Patch(":id/start")
  @ApiOperation({ summary: "Marca un partido como en juego" })
  start(
    @Param("id") id: string,
    @CurrentUser() user: { userId: string; role: string },
  ) {
    return this.matches.start(id, user)
  }

  @ApiBearerAuth()
  @Patch(":id/result")
  @ApiOperation({ summary: "Registra el resultado y avanza al ganador" })
  report(
    @Param("id") id: string,
    @Body() dto: ReportResultDto,
    @CurrentUser() user: { userId: string; role: string },
  ) {
    return this.matches.reportResult(id, dto, user)
  }
}
