import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger"
import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator"
import { Type } from "class-transformer"
import { TournamentFormat, TournamentStatus } from "@prisma/client"
import { PaginationQueryDto } from "../../common/dto/pagination.dto"

export const TOURNAMENT_CATEGORIES = [
  "deportes",
  "gaming",
  "comunidad",
  "cultura",
  "empresas",
] as const

export const COVER_PATTERNS = ["court", "grid", "arc", "score", "flag", "bracket"] as const

export class CreateTournamentDto {
  @ApiProperty({ example: "Copa Cadejos 3x3", minLength: 4, maxLength: 80 })
  @IsString()
  @MinLength(4)
  @MaxLength(80)
  name!: string

  @ApiPropertyOptional({ example: "Doce equipos, una cancha y cuatro horas de juego." })
  @IsOptional()
  @IsString()
  @MaxLength(180)
  summary?: string

  @ApiProperty({ example: "Torneo de básquet 3x3 con fase de grupos y eliminación directa." })
  @IsString()
  @MinLength(20)
  @MaxLength(3000)
  description!: string

  @ApiProperty({ enum: TOURNAMENT_CATEGORIES, example: "deportes" })
  @IsIn(TOURNAMENT_CATEGORIES)
  category!: string

  @ApiPropertyOptional({ example: "Básquet 3x3" })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  sport?: string

  @ApiPropertyOptional({ enum: TournamentFormat, default: TournamentFormat.SINGLE_ELIMINATION })
  @IsOptional()
  @IsEnum(TournamentFormat)
  format?: TournamentFormat

  @ApiProperty({ example: "Parque Cuscatlán, cancha 2" })
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  location!: string

  @ApiProperty({ example: "San Salvador" })
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  city!: string

  @ApiProperty({ example: "2026-11-07T15:00:00.000Z" })
  @IsDateString()
  startsAt!: string

  @ApiProperty({ example: "2026-11-03T23:59:00.000Z" })
  @IsDateString()
  registrationEndsAt!: string

  @ApiProperty({ example: 16, minimum: 4, maximum: 128 })
  @Type(() => Number)
  @IsInt()
  @Min(4)
  @Max(128)
  maxParticipants!: number

  @ApiPropertyOptional({ example: 2400, minimum: 0, maximum: 10000 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(10000)
  auraPrize?: number

  @ApiPropertyOptional({ type: [String], example: ["Equipos de 3 jugadores.", "Partidos a 21 puntos."] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MaxLength(240, { each: true })
  rules?: string[]

  @ApiPropertyOptional({ enum: COVER_PATTERNS, default: "court" })
  @IsOptional()
  @IsIn(COVER_PATTERNS)
  cover?: string
}

export class UpdateTournamentDto extends PartialType(CreateTournamentDto) {}

export class TournamentsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: TOURNAMENT_CATEGORIES })
  @IsOptional()
  @IsIn(TOURNAMENT_CATEGORIES)
  category?: string

  @ApiPropertyOptional({ enum: TournamentStatus })
  @IsOptional()
  @IsEnum(TournamentStatus)
  status?: TournamentStatus

  @ApiPropertyOptional({ enum: TournamentFormat })
  @IsOptional()
  @IsEnum(TournamentFormat)
  format?: TournamentFormat

  @ApiPropertyOptional({ description: "Búsqueda por nombre, sede o ciudad" })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  q?: string

  @ApiPropertyOptional({ enum: ["date", "aura", "recent"], default: "date" })
  @IsOptional()
  @IsIn(["date", "aura", "recent"])
  sort?: "date" | "aura" | "recent"
}

export class RegisterTournamentDto {
  @ApiPropertyOptional({ description: "Id del equipo con el que se compite" })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  teamId?: string
}

export class GenerateBracketDto {
  @ApiPropertyOptional({ description: "Reemplaza un cuadro existente", default: false })
  @IsOptional()
  force?: boolean
}
