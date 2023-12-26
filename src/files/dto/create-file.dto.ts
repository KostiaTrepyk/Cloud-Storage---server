import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class CreateFileDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  @IsInt()
  folderId: number;

  @ApiProperty({ example: 1, required: true })
  @IsNumber()
  @IsInt()
  storageId: number;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
