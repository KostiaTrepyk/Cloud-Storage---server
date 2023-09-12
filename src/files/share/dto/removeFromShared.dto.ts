import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNumber } from 'class-validator';

export class RemoveFromSharedDto {
  @ApiProperty()
  @IsNumber()
  @IsInt()
  fileId: number;

  @ApiProperty()
  /* Fix */
  userIdsToRemove: number[];
}
