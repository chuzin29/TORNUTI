import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsOptional, IsString, IsUrl, MaxLength, MinLength } from "class-validator"

export class UpdateUserDto {
  @ApiPropertyOptional({ example: "Valeria Rivas", minLength: 2, maxLength: 60 })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(60)
  name?: string

  @ApiPropertyOptional({ example: "Base de Las Cadejas. Juego desde 2019.", maxLength: 280 })
  @IsOptional()
  @IsString()
  @MaxLength(280)
  bio?: string

  @ApiPropertyOptional({ example: "https://ejemplo.com/avatar.png" })
  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(300)
  avatarUrl?: string
}
