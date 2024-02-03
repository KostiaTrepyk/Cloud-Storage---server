import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt.guard';
import { UserId } from 'src/decorators/user-id.decorator';
import { FoldersService } from './folders.service';
import { FolderEntity } from '../storages/entities/folder.entity';
import { type FileEntity } from 'src/modules/storages/entities/file.entity';

import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { DeleteFoldersDto } from './dto/delete-folders.dto';
import { GetFolderOneDto } from './dto/get-folder-one';

@ApiTags('Folders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('folders')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Get('one')
  async getFolder(
    @UserId() userId: number,
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    dto: GetFolderOneDto,
  ): Promise<{
    currentFolder: FolderEntity;
    folders: FolderEntity[];
    files: FileEntity[];
  }> {
    return await this.foldersService.getOneFolder({ userId, ...dto });
  }

  @Post()
  async createFolder(
    @UserId() userId: number,
    @Body() dto: CreateFolderDto,
  ): Promise<FolderEntity> {
    return await this.foldersService.createFolder({ userId, ...dto });
  }

  @Put()
  async updateFolder(
    @UserId() userId: number,
    @Body() dto: UpdateFolderDto,
  ): Promise<boolean> {
    return await this.foldersService.updateFolder({ userId, ...dto });
  }

  @Delete()
  async deleteFolders(
    @UserId() userId: number,
    @Body() dto: DeleteFoldersDto,
  ): Promise<boolean> {
    return await this.foldersService.deleteFolders({ userId, ...dto });
  }
}
