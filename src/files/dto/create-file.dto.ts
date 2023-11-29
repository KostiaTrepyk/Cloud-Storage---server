import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateFileDto {
  @ApiProperty({ example: 1, required: true })
  @IsInt()
  folderId: number;
}
