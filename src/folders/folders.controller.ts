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
import { FoldersService } from './folders.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UserId } from 'src/decorators/user-id.decorator';
import { FolderEntity } from './entities/folder.entity';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { GetFoldersDto } from './dto/get-folders.dto';

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
  async deleteFolder() {
    return await this.foldersService.deleteFolder();
  }
}
