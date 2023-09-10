import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AddToFavouriteDto {
  @ApiProperty()
  @IsNumber()
  fileId: number;
}
