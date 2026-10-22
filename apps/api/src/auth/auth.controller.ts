import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import { Throttle } from "@nestjs/throttler"
import { CurrentUser } from "../common/decorators/current-user.decorator"
import { Public } from "../common/decorators/public.decorator"
import { AuthService } from "./auth.service"
import { LoginDto } from "./dto/login.dto"
import { RegisterDto } from "./dto/register.dto"

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post("register")
  @ApiOperation({ summary: "Crea una cuenta y devuelve un JWT" })
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto)
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @HttpCode(200)
  @Post("login")
  @ApiOperation({ summary: "Inicia sesión y devuelve un JWT" })
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto)
  }

  @ApiBearerAuth()
  @Get("me")
  @ApiOperation({ summary: "Perfil del usuario autenticado" })
  me(@CurrentUser("userId") userId: string) {
    return this.auth.me(userId)
  }
}
