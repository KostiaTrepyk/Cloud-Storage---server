import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class DeleteStorageDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  storageId: number;
}
