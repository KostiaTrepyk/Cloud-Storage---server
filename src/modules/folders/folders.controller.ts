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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt.guard';
import { FoldersService } from './folders.service';
import { FolderEntity } from '../../entities/folder.entity';

import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { DeleteFoldersDto } from './dto/delete-folders.dto';
import { GetFolderOneDto } from './dto/get-folder-one';
import { User, UserType } from 'src/decorators/user.decorator';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Folders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('folders')
export class FoldersController {
	constructor(private readonly foldersService: FoldersService) {}

	@Get('one')
	async getFolder(
		@User() user: UserType,
		@Query(
			new ValidationPipe({
				transform: true,
				transformOptions: { enableImplicitConversion: true },
				forbidNonWhitelisted: true,
			})
		)
		dto: GetFolderOneDto
	): Promise<{
		currentFolder: FolderEntity;
		folders: FolderEntity[];
	}> {
		return await this.foldersService.getOneFolder(user, dto);
	}

	@Get('sharedFolders')
	async getSharedFolders(
		@User() user: UserType,
		@Query(
			new ValidationPipe({
				transform: true,
				transformOptions: { enableImplicitConversion: true },
				forbidNonWhitelisted: true,
			})
		)
		dto: any
	) {
		return await this.foldersService.getSharedFolders(user, dto);
	}

	@Post()
	async createFolder(
		@User() user: UserType,
		@Body() dto: CreateFolderDto
	): Promise<FolderEntity> {
		return await this.foldersService.createFolder(user, dto);
	}

	@Put()
	async updateFolder(
		@User() user: UserType,
		@Body() dto: UpdateFolderDto
	): Promise<boolean> {
		return await this.foldersService.updateFolder(user, dto);
	}

	@Delete()
	async deleteFolders(
		@User() user: UserType,
		@Body() dto: DeleteFoldersDto
	): Promise<boolean> {
		return await this.foldersService.deleteFolders(user, dto);
	}
}
