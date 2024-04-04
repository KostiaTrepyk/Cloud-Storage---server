import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FileType, SortValue } from '../types/types';

export class GetAllFilesQueryDto {
  @ApiProperty({ example: FileType.ALL, enum: FileType, required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsIn(Object.values(FileType))
  filesType: FileType;

  @ApiProperty({ example: 0, minimum: 0, required: false })
  @Min(0)
  @IsOptional()
  @IsInt()
  offset: number;

  @ApiProperty({ example: 15, minimum: 10, maximum: 50, required: false })
  @Min(10)
  @Max(100)
  @IsOptional()
  @IsInt()
  limit: number;

  /* Fix Swagger? */
  @ApiProperty({ example: SortValue.NO, required: false, enum: SortValue })
  @IsOptional()
  @IsString()
  @IsIn(Object.values(SortValue))
  sort: SortValue;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search: string;

  @ApiProperty({ example: '2023-09-07', required: false })
  @IsOptional()
  @IsString()
  createdAt: string;
}
