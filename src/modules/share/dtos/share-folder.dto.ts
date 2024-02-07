import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class ShareFoldersDto {
    @ApiProperty({ type: [Number] })
	@IsInt({ each: true })
	folderIds: number[];

	@ApiProperty({ type: [Number] })
	@IsInt({ each: true })
	userIdsToShareWith: number[];
}