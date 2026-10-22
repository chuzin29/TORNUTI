import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Prisma } from "@prisma/client"
import * as bcrypt from "bcryptjs"
import { PrismaService } from "../prisma/prisma.service"
import { LoginDto } from "./dto/login.dto"
import { RegisterDto } from "./dto/register.dto"
import { JwtPayload } from "./jwt-payload"
import { slugify } from "../common/utils/slug"

const publicUserSelect = {
  id: true,
  email: true,
  name: true,
  handle: true,
  bio: true,
  avatarUrl: true,
  role: true,
  aura: true,
  createdAt: true,
} satisfies Prisma.UserSelect

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase()
    const existing = await this.prisma.user.findUnique({ where: { email } })
    if (existing) throw new ConflictException("El correo ya está registrado")

    const baseHandle = slugify(dto.name) || slugify(email.split("@")[0])
    const handle = await this.uniqueHandle(baseHandle)
    const password = await bcrypt.hash(dto.password, 12)

    const user = await this.prisma.user.create({
      data: {
        email,
        password,
        name: dto.name.trim(),
        handle,
        role: "PLAYER",
        statistics: { create: {} },
      },
      select: publicUserSelect,
    })

    return this.issueToken(user)
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase()
    const user = await this.prisma.user.findUnique({ where: { email } })

    if (!user) throw new UnauthorizedException("Correo o contraseña incorrectos")

    const valid = await bcrypt.compare(dto.password, user.password)
    if (!valid) throw new UnauthorizedException("Correo o contraseña incorrectos")

    const safeUser = await this.prisma.user.findUniqueOrThrow({
      where: { id: user.id },
      select: publicUserSelect,
    })

    return this.issueToken(safeUser)
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        ...publicUserSelect,
        statistics: true,
      },
    })

    if (!user) throw new UnauthorizedException("La sesión ya no es válida")
    return user
  }

  private async issueToken(user: { id: string; email: string; role: JwtPayload["role"] }) {
    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role }
    const token = await this.jwt.signAsync(payload)
    return { token, user }
  }

  private async uniqueHandle(base: string) {
    let candidate = base
    let suffix = 2
    while (await this.prisma.user.findUnique({ where: { handle: candidate } })) {
      candidate = `${base}-${suffix}`
      suffix += 1
    }
    return candidate
  }
}
