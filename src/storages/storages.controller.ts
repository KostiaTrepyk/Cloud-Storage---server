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
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserId } from 'src/decorators/user-id.decorator';
import { type StorageEntity } from './entities/storage.entity';
import { StoragesService } from './storages.service';

import { CreateStorageDto } from './dto/create-storage.dto';
import { DeleteStorageDto } from './dto/delete-storage.dto';
import { GetAllStoragesDto } from './dto/get-all-storages.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';

@ApiTags('Storages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('storages')
export class StoragesController {
  constructor(private readonly storagesService: StoragesService) {}

  @Get('all')
  async getAllStorages(
    @UserId() userId: number,
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    dto: GetAllStoragesDto,
  ): Promise<StorageEntity[]> {
    return await this.storagesService.getAllStorages({ userId, ...dto });
  }

  @Post('create')
  async createStorage(
    @UserId() userId: number,
    @Body() dto: CreateStorageDto,
  ): Promise<StorageEntity> {
    return await this.storagesService.createStorage({ userId, ...dto });
  }

  @Put('update')
  async updateStorage(
    @UserId() userId: number,
    @Body() dto: UpdateStorageDto,
  ): Promise<boolean> {
    return await this.storagesService.updateStorage({ userId, ...dto });
  }

  @Delete('delete')
  async deleteStorage(
    @UserId() userId: number,
    @Body() dto: DeleteStorageDto,
  ): Promise<boolean> {
    return await this.storagesService.deleteStorage({ userId, ...dto });
  }
}
