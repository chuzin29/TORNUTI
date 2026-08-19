import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Observable } from "rxjs"

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return false
    }

    const token = authHeader.split(" ")[1]
    try {
      const payload = this.jwtService.verify(token)
      request.user = payload
      return true
    } catch (err) {
      return false
    }
  }
}