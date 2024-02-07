import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ShareService } from './share.service';
import { ShareFilesDto } from './dtos/share-files.dto';
import { UserId } from 'src/decorators/user-id.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UnshareFilesDto } from './dtos/unshare-fIles.dto';
import { ShareFoldersDto } from './dtos/share-folder.dto';
import { UnshareFoldersDto } from './dtos/unshare-folder.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('share')
@Controller('share')
export class ShareController {
	constructor(private shareService: ShareService) {}

	@Put('shareFiles')
	async shareFiles(@UserId() userId: number, @Body() dto: ShareFilesDto) {
		return await this.shareService.shareFiles(userId, dto);
	}

	@Put('unshareFiles')
	async unshareFiles(@UserId() userId: number, @Body() dto: UnshareFilesDto) {
		return await this.shareService.unshareFiles(userId, dto);
	}

	@Put('shareFolders')
	async shareFolders(@UserId() userId: number, @Body() dto: ShareFoldersDto) {
		return await this.shareService.shareFolders(userId, dto);
	}

	@Put('unshareFolders')
	async unshareFolders(
		@UserId() userId: number,
		@Body() dto: UnshareFoldersDto
	) {
		return await this.shareService.unshareFolders(userId, dto);
	}
}
