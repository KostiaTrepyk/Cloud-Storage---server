import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FileType, SortValue } from '../types';

export class GetAllFilesQueryDto {
  @ApiProperty({ example: FileType.ALL, enum: FileType })
  @IsNotEmpty()
  @IsIn(Object.values(FileType))
  filesType: FileType;

  @ApiProperty({ example: 1, minimum: 1, required: false })
  @Min(1)
  @IsOptional()
  @IsNumber()
  @IsInt()
  page: number;

  @ApiProperty({ example: 15, minimum: 10, maximum: 50, required: false })
  @Min(10)
  @Max(50)
  @IsOptional()
  @IsNumber()
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
