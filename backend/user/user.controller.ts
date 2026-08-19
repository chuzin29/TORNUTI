import { Controller, Get, Post, Body, Param, UseGuards } from "@nestjs/common"
import { UserService } from "./user.service"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @get("profile/:id")
  async profile(@Param("id") id: string) {
    return this.userService.findById(id)
  }

  @post("aura/:amount")
  async updateAura(
    @Param("amount") amount: number,
    @Request() req
  ) {
    return this.userService.updateAura(req.user.userId, amount)
  }