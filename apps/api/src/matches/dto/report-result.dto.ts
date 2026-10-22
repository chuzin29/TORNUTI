import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsInt, Max, Min } from "class-validator"

export class ReportResultDto {
  @ApiProperty({ example: 21, minimum: 0, maximum: 999 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(999)
  score1!: number

  @ApiProperty({ example: 18, minimum: 0, maximum: 999 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(999)
  score2!: number
}
