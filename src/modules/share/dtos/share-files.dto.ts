import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class ShareFilesDto {
	@ApiProperty({ type: [Number] })
	@IsInt({ each: true })
	fileIds: number[];

	@ApiProperty({ type: [Number] })
	@IsInt({ each: true })
	userIdsToShareWith: number[];
}
