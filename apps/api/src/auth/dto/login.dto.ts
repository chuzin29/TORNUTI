import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator"

export class LoginDto {
  @ApiProperty({ example: "valeria@tornuti.app" })
  @IsEmail()
  @MaxLength(120)
  email!: string

  @ApiProperty({ example: "tornuti123" })
  @IsString()
  @MinLength(1)
  @MaxLength(72)
  password!: string
}
