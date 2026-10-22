import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator"

export class RegisterDto {
  @ApiProperty({ example: "Valeria Rivas", minLength: 2, maxLength: 60 })
  @IsString()
  @MinLength(2)
  @MaxLength(60)
  name!: string

  @ApiProperty({ example: "valeria@tornuti.app" })
  @IsEmail()
  @MaxLength(120)
  email!: string

  @ApiProperty({ example: "tornuti123", minLength: 8, maxLength: 72 })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password!: string
}
