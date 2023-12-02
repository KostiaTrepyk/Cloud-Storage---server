import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber } from 'class-validator';

export class CreateFileDto {
  @ApiProperty({ example: 1, required: true })
  @IsNumber()
  @IsInt()
  folderId: number;
}
