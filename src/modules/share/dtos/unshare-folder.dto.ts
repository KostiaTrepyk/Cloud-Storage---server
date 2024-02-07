import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class UnshareFoldersDto {
	@ApiProperty({ type: [Number] })
	@IsInt({ each: true })
	folderIds: number[];

	@ApiProperty({ type: [Number] })
	@IsInt({ each: true })
	userIdsToRemove: number[];
}