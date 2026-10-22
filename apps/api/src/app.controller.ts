import { Controller, Get, ServiceUnavailableException } from "@nestjs/common"
import { ApiOperation, ApiTags } from "@nestjs/swagger"
import { Public } from "./common/decorators/public.decorator"
import { PrismaService } from "./prisma/prisma.service"

@ApiTags("health")
@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @Get("health")
  @ApiOperation({ summary: "Estado del servicio" })
  async health() {
    const database = await this.prisma.isHealthy()
    return {
      status: database ? "ok" : "degraded",
      service: "tornuti-api",
      version: "1.0.0",
      database: database ? "up" : "down",
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    }
  }

  @Public()
  @Get("health/ready")
  @ApiOperation({ summary: "Readiness probe: exige base de datos disponible" })
  async ready() {
    const database = await this.prisma.isHealthy()
    if (!database) throw new ServiceUnavailableException("La base de datos no responde")
    return { status: "ready", timestamp: new Date().toISOString() }
  }
}
