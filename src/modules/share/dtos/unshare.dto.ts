import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional } from "class-validator";

export class UnshareDto {
	@ApiProperty({ type: [Number] })
	@IsInt({ each: true })
	userIdsToRemove: number[];

	@ApiProperty({ type: [Number], required: false })
	@IsInt({ each: true })
	@IsOptional()
	folderIds: number[];

	@ApiProperty({ type: [Number], required: false })
	@IsInt({ each: true })
	@IsOptional()
	fileIds: number[];
}