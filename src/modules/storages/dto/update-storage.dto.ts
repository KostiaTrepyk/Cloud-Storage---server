import { ApiProperty } from '@nestjs/swagger';
import {
	IsAlphanumeric,
	IsInt,
	IsNotEmpty,
	MaxLength,
	MinLength,
} from 'class-validator';

export class UpdateStorageDto {
	@ApiProperty({ example: 1 })
	@IsNotEmpty()
	@IsInt()
	storageId: number;

	@ApiProperty({
		nullable: false,
		minLength: 1,
		maxLength: 30,
		example: 'new storage name',
	})
	@IsAlphanumeric()
	@IsNotEmpty()
	@MinLength(1)
	@MaxLength(30)
	newName: string;
}
