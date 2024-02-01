import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class DeleteFoldersDto {
  @ApiProperty({ example: [1, 2], required: true, type: Array(Number) })
  @IsNumber({}, { each: true })
  foldersIds: number[];
}
