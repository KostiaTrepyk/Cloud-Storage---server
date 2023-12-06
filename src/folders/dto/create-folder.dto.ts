import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateFolderDto {
  @ApiProperty({ example: 'New Folder', required: true, type: String })
  @IsString()
  folderName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  parrentFolderId: number;
}
