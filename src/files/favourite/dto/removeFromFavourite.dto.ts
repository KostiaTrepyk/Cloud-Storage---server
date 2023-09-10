import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class RemoveFromFavouriteDto {
  @ApiProperty()
  @IsNumber()
  fileId: number;
}
