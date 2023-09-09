import {
  IsDate,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { FileType } from '../entities/file.entity';
import { SortValue } from '../types';
import { ApiProperty } from '@nestjs/swagger';

/** Fix  */
export class GetAllFilesQueryDto {
  /* Fix  */
  @ApiProperty({ example: 'All', enum: FileType })
  @IsNotEmpty()
  filesType: FileType;

  @ApiProperty({ example: 1, minimum: 1, required: false })
  @Min(1)
  @IsOptional()
  @IsNumber()
  page: number;

  @ApiProperty({ example: 15, minimum: 10, maximum: 50, required: false })
  @Min(10)
  @Max(50)
  @IsOptional()
  @IsNumber()
  limit: number;

  /* Fix Swagger? */
  @ApiProperty({ example: 'NO', required: false, enum: SortValue })
  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC', 'NO'])
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
