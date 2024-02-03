import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Test 1234', minLength: 5, maxLength: 40 })
  @MinLength(5)
  @MaxLength(40)
  @IsString()
  fullName: string;

  @ApiProperty({ example: 'test@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'QWEasd123', minLength: 8, maxLength: 40 })
  @MinLength(8)
  @MaxLength(40)
  @IsString()
  password: string;
}
