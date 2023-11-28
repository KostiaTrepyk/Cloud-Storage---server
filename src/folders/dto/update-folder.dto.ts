import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class UpdateFolderDto {
  @ApiProperty({ example: 'updated Folder' })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  newFolderName: string;

  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  folderId: number;
}
