import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateFolderDto {
  @ApiProperty({ example: 'New Folder', required: true, type: String })
  @IsString()
  folderName: string;
}
