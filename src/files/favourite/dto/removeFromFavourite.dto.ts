import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber } from 'class-validator';

export class RemoveFromFavouriteDto {
  @ApiProperty()
  @IsNumber()
  @IsInt()
  fileId: number;
}
