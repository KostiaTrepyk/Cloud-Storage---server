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
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserId } from 'src/decorators/user-id.decorator';
import { FoldersService } from './folders.service';
import { FolderEntity } from './entities/folder.entity';

import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { GetFoldersDto } from './dto/get-folders.dto';
import { DeleteFoldersDto } from './dto/delete-folders.dto';

@ApiTags('Folders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('folders')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Get()
  async getFolders(
    @UserId() userId: number,
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    dto: GetFoldersDto,
  ): Promise<{
    folders: FolderEntity[];
    count: number;
  }> {
    return await this.foldersService.getFolders({ userId, ...dto });
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