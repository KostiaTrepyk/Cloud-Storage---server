import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FileEntity } from '../entities/file.entity';
import { UserId } from 'src/decorators/user-id.decorator';
import { ShareService } from './share.service';
import { ShareWithDTO } from './dto/shareWith.dto';
import { RemoveFromSharedDto } from './dto/removeFromShared.dto';

@ApiTags('Share files')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('files/share')
export class ShareController {
  constructor(private readonly shareService: ShareService) {}

  @Get()
  async findAllShared(
    @UserId() userId: number,
  ): Promise<{ files: FileEntity[]; count: number }> {
    return await this.shareService.findAllShared(userId);
  }

  @Put('add')
  async share(@UserId() userId: number, @Body() dto: ShareWithDTO) {
    return await this.shareService.share({ userId, ...dto });
  }

  @Put('remove')
  async removeFromShared(
    @UserId() userId: number,
    @Body() dto: RemoveFromSharedDto,
  ) {
    return await this.shareService.removeFromShared({ userId, ...dto });
  }
}
