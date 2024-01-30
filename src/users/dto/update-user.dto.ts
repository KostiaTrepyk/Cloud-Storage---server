import { ApiProperty } from "@nestjs/swagger";
import { IsAlphanumeric, IsEmail, IsOptional, MaxLength, MinLength } from "class-validator";

export class UpdateUserDto {
	@ApiProperty({
		example: 'test@gmail.com',
		required: false,
		minLength: 8,
		maxLength: 40,
	})
	@IsEmail()
	@MinLength(8)
	@MaxLength(40)
	@IsOptional()
	newEmail: string;

	@ApiProperty({
		example: 'Full Name',
		required: false,
		minLength: 5,
		maxLength: 40,
	})
	@MinLength(5)
	@MaxLength(40)
	@IsAlphanumeric()
	@IsOptional()
	newFullName: string;
}
