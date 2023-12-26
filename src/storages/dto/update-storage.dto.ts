import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsInt,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateStorageDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  storageId: number;

  @ApiProperty({ example: 'new storage name' })
  @IsAlphanumeric()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(30)
  newName: string;
}
