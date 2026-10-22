import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator"

export const TEAM_CATEGORIES = [
  "deportes",
  "gaming",
  "comunidad",
  "cultura",
  "empresas",
] as const

export class CreateTeamDto {
  @ApiProperty({ example: "Las Cadejas", minLength: 2, maxLength: 50 })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name!: string

  @ApiPropertyOptional({ example: "Nadie corre sola." })
  @IsOptional()
  @IsString()
  @MaxLength(90)
  motto?: string

  @ApiPropertyOptional({ example: "Equipo de básquet 3x3 del barrio.", maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string

  @ApiProperty({ enum: TEAM_CATEGORIES, example: "deportes" })
  @IsIn(TEAM_CATEGORIES)
  category!: string

  @ApiPropertyOptional({ example: "San Salvador" })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  city?: string

  @ApiPropertyOptional({ example: "https://ejemplo.com/escudo.png" })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  logoUrl?: string
}

export class TeamsQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(60)
  q?: string

  @ApiPropertyOptional({ enum: TEAM_CATEGORIES })
  @IsOptional()
  @IsIn(TEAM_CATEGORIES)
  category?: string

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  page?: number

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  limit?: number
}

export class AddTeamMemberDto {
  @ApiProperty({ description: "Id del usuario que se une al equipo" })
  @IsString()
  userId!: string
}

export class InviteMembersDto {
  @ApiProperty({ type: [String], description: "Ids de usuarios" })
  @IsArray()
  @ArrayMaxSize(30)
  @IsString({ each: true })
  userIds!: string[]
}
