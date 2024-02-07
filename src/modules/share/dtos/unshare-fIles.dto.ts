import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class UnshareFilesDto {
	@ApiProperty({ type: [Number] })
	@IsInt({ each: true })
	fileIds: number[];

	@ApiProperty({ type: [Number] })
	@IsInt({ each: true })
	userIdsToRemove: number[];
}