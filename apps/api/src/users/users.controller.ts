import { Body, Controller, Get, Param, Patch } from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import { CurrentUser } from "../common/decorators/current-user.decorator"
import { Public } from "../common/decorators/public.decorator"
import { UpdateUserDto } from "./dto/update-user.dto"
import { UsersService } from "./users.service"

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @ApiBearerAuth()
  @Get("me/teams")
  @ApiOperation({ summary: "Equipos del usuario autenticado" })
  myTeams(@CurrentUser("userId") userId: string) {
    return this.users.myTeams(userId)
  }

  @ApiBearerAuth()
  @Patch("me")
  @ApiOperation({ summary: "Actualiza el perfil propio" })
  updateMe(@CurrentUser("userId") userId: string, @Body() dto: UpdateUserDto) {
    return this.users.updateMe(userId, dto)
  }

  @Public()
  @Get(":handle")
  @ApiOperation({ summary: "Perfil público por handle o id" })
  profile(@Param("handle") handle: string) {
    return this.users.findPublicProfile(handle)
  }
}
