import { Controller, Post, Body, Request, UseGuards } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { LocalAuthGuard } from "./local.auth.guard"

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @post("register")
  async register(
    @Body("email") email: string,
    @Body("password") password: string,
    @Body("name") name: string
  ) {
    return this.authService.register(email, password, name)
  }

  @post("login")
  async login(
    @Body("email") email: string,
    @Body("password") password: string
  ) {
    return this.authService.login(email, password)
  }
}