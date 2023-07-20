import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'test@gmail.com' })
  email: string;

  @ApiProperty({ example: 'Test' })
  fullName: string;

  @ApiProperty({ example: 'test123' })
  password: string;
}
