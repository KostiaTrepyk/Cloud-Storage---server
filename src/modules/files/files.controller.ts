import {
	Controller,
	Get,
	Post,
	UseInterceptors,
	UploadedFile,
	ParseFilePipe,
	UseGuards,
	Query,
	Delete,
	ValidationPipe,
	Body,
	Put,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt.guard';
import { UserId } from 'src/decorators/user-id.decorator';
import { fileStorage } from './storage';
import { FilesService } from './files.service';
import { FileEntity } from '../../entities/file.entity';
import { GetAllFilesQueryDto } from './dto/get-all-files';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { GetFolderFilesDto } from './dto/get-folder-files.dto';

@ApiTags('Files')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('files')
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@Get('all')
	async findAll(
		@UserId() userId: number,
		@Query(
			new ValidationPipe({
				transform: true,
				transformOptions: { enableImplicitConversion: true },
				forbidNonWhitelisted: true,
			})
		)
		query: GetAllFilesQueryDto
	): Promise<{
		files: FileEntity[];
		count: number;
	}> {
		return await this.filesService.findAll({
			userId,
			...query,
		});
	}

	@Get('folderFiles')
	async findFolderFiles(
		@UserId() userId: number,
		@Query(
			new ValidationPipe({
				transform: true,
				transformOptions: { enableImplicitConversion: true },
				forbidNonWhitelisted: true,
			})
		)
		query: GetFolderFilesDto
	): Promise<FileEntity[]> {
		return await this.filesService.findFolderFiles({
			userId,
			...query,
		});
	}

	@Post('save')
	@UseInterceptors(FileInterceptor('file', { storage: fileStorage }))
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		type: CreateFileDto,
	})
	async create(
		@Body() dto: CreateFileDto,
		@UploadedFile(new ParseFilePipe())
		file: Express.Multer.File,
		@UserId() userId: number
	): Promise<FileEntity> {
		return await this.filesService.create({ file, userId, ...dto });
	}

	@Put()
	async update(@UserId() userId: number, @Body() dto: UpdateFileDto) {
		return await this.filesService.update({ userId, ...dto });
	}

	@Delete('softDelete')
	async softDelete(
		@UserId() userId: number,
		@Query('ids') ids: string
	): Promise<boolean> {
		return await this.filesService.softDelete(userId, ids);
	}

	@Delete('delete')
	async delete(
		@UserId() userId: number,
		@Query('ids') ids: string
	): Promise<boolean> {
		return await this.filesService.delete(userId, ids);
	}
}
