import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class GetFolderOneDto {
  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  folderId: number;
}
