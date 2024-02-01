import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class GetFolderFilesDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @IsNotEmpty()
  folderId: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  storageId: number;
}
