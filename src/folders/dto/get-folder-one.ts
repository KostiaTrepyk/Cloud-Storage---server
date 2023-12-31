import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class GetFolderOneDto {
  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  folderId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  storageId: number;
}
