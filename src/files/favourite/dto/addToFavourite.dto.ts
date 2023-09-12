import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber } from 'class-validator';

export class AddToFavouriteDto {
  @ApiProperty()
  @IsNumber()
  @IsInt()
  fileId: number;
}
