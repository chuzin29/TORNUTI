import { Injectable, UnauthorizedException } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { Strategy } from "passport-local"
import { PassportStrategy } from "@nestjs/passport"

@Injectable()
export class LocalAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: "email",
      passwordField: "password",
    })
  }

  async validate(email: string, password: string) {
    const user = await this.authService.validateUser(email, password)
    if (!user) {
      throw new UnauthorizedException("Credenciales inválidas")
    }
    return user
  }
}