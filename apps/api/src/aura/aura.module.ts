import { Module } from "@nestjs/common"
import { AuraController } from "./aura.controller"
import { AuraService } from "./aura.service"

@Module({
  controllers: [AuraController],
  providers: [AuraService],
  exports: [AuraService],
})
export class AuraModule {}
