import { Controller, Delete, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FoldersService } from './folders.service';

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
  async createFolder() {
    return await this.foldersService.createFolder();
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
