import { Body, ClassSerializerInterceptor, Controller, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ShareService } from './share.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { User, UserType } from 'src/decorators/user.decorator';
import { ShareDto } from './dtos/share.dto';
import { UnshareDto } from './dtos/unshare.dto';

@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('share')
@Controller('share')
export class ShareController {
	constructor(private shareService: ShareService) {}

	@Put('share')
	async share(
		@User() user: UserType,
		@Body() dto: ShareDto
	): Promise<{
		sharedFiles: number[];
		sharedFolders: number[];
	}> {
		return await this.shareService.share(user, dto);
	}

	@Put('unshare')
	async unshare(
		@User() user: UserType,
		@Body() dto: UnshareDto
	): Promise<{
		unsharedFiles: number[];
		unsharedFolders: number[];
	}> {
		return await this.shareService.unshare(user, dto);
	}
}
