import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateFolderDto {
  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  folderId: number;

  @ApiProperty({ example: 'updated Folder', required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  newFolderName: string;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  newParrentFolderId: number;
}
