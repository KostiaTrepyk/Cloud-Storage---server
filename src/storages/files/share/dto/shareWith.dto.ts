import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class ShareWithDTO {
  @IsNumber()
  @ApiProperty()
  fileId: number;

  @ApiProperty()
  /* Fix */
  shareWith: number[];
}
