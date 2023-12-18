import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateFileDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ required: false })
  @IsAlphanumeric()
  @IsOptional()
  newOriginalName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  newFolderId?: number;
}
