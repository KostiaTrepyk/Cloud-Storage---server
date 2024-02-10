import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt.guard';
import { User, UserType } from 'src/decorators/user.decorator';
import { StoragesService } from './storages.service';
import { type StorageEntity } from '../../entities/storage.entity';

import { CreateStorageDto } from './dto/create-storage.dto';
import { DeleteStorageDto } from './dto/delete-storage.dto';
import { GetAllStoragesDto } from './dto/get-all-storages.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Storages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('storages')
export class StoragesController {
	constructor(private readonly storagesService: StoragesService) {}

	@Get('all')
	async getAllStorages(
		@User() user: UserType,
		@Query(
			new ValidationPipe({
				transform: true,
				transformOptions: { enableImplicitConversion: true },
				forbidNonWhitelisted: true,
			})
		)
		dto: GetAllStoragesDto
	): Promise<StorageEntity[]> {
		return await this.storagesService.getAllStorages(user, dto);
	}

	@Post('create')
	async createStorage(
		@User() user: UserType,
		@Body() dto: CreateStorageDto
	): Promise<StorageEntity> {
		return await this.storagesService.createStorage(user, dto);
	}

	@Put('update')
	async updateStorage(
		@User() user: UserType,
		@Body() dto: UpdateStorageDto
	): Promise<boolean> {
		return await this.storagesService.updateStorage(user, dto);
	}

	@Delete('delete')
	async deleteStorage(
		@User() user: UserType,
		@Body() dto: DeleteStorageDto
	): Promise<boolean> {
		return await this.storagesService.deleteStorage(user, dto);
	}
}
