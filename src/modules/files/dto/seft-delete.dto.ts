import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class SoftDeleteFileDto {
	@ApiProperty({ example: 1, required: true, type: Number })
	@IsInt()
	id: number;
}
