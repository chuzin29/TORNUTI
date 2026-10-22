import { Module } from "@nestjs/common"
import { TournamentsController } from "./tournaments.controller"
import { TournamentsService } from "./tournaments.service"

@Module({
  controllers: [TournamentsController],
  providers: [TournamentsService],
  exports: [TournamentsService],
})
export class TournamentsModule {}
