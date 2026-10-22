import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { APP_GUARD } from "@nestjs/core"
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler"
import { AppController } from "./app.controller"
import { AuraModule } from "./aura/aura.module"
import { AuthModule } from "./auth/auth.module"
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard"
import { RolesGuard } from "./common/guards/roles.guard"
import { MatchesModule } from "./matches/matches.module"
import { PrismaModule } from "./prisma/prisma.module"
import { TeamsModule } from "./teams/teams.module"
import { TournamentsModule } from "./tournaments/tournaments.module"
import { UsersModule } from "./users/users.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: [".env", "../../.env"],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 120,
      },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    AuraModule,
    TeamsModule,
    TournamentsModule,
    MatchesModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
