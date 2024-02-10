import { Body, ClassSerializerInterceptor, Controller, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ShareService } from './share.service';
import { ShareFilesDto } from './dtos/share-files.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UnshareFilesDto } from './dtos/unshare-fIles.dto';
import { ShareFoldersDto } from './dtos/share-folder.dto';
import { UnshareFoldersDto } from './dtos/unshare-folder.dto';
import { User, UserType } from 'src/decorators/user.decorator';

@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('share')
@Controller('share')
export class ShareController {
	constructor(private shareService: ShareService) {}

	@Put('shareFiles')
	async shareFiles(@User() user: UserType, @Body() dto: ShareFilesDto) {
		return await this.shareService.shareFiles(user, dto);
	}

	@Put('unshareFiles')
	async unshareFiles(@User() user: UserType, @Body() dto: UnshareFilesDto) {
		return await this.shareService.unshareFiles(user, dto);
	}

	@Put('shareFolders')
	async shareFolders(@User() user: UserType, @Body() dto: ShareFoldersDto) {
		return await this.shareService.shareFolders(user, dto);
	}

	@Put('unshareFolders')
	async unshareFolders(
		@User() user: UserType,
		@Body() dto: UnshareFoldersDto
	) {
		return await this.shareService.unshareFolders(user, dto);
	}
}
