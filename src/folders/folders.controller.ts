import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FoldersService } from './folders.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UserId } from 'src/decorators/user-id.decorator';
import { FolderEntity } from './entities/folder.entity';

@ApiTags('Folders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('folders')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Get()
  async getFolders() {
    return await this.foldersService.getFolders();
  }

  @Post()
  async createFolder(
    @UserId() userId: number,
    @Body() dto: CreateFolderDto,
  ): Promise<FolderEntity> {
    return await this.foldersService.createFolder({ userId, ...dto });
  }

  @Put()
  async updateFolder() {
    return await this.foldersService.updateFolder();
  }

  @Delete()
  async deleteFolder() {
    return await this.foldersService.deleteFolder();
  }
}
