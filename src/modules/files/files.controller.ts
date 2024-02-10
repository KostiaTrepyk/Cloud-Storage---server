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
	ClassSerializerInterceptor,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt.guard';
import { User, UserType } from 'src/decorators/user.decorator';
import { fileStorage } from './storage';
import { FilesService } from './files.service';
import { FileEntity } from '../../entities/file.entity';
import { GetAllFilesQueryDto } from './dto/get-all-files';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { GetFolderFilesDto } from './dto/get-folder-files.dto';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Files')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('files')
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@Get('all')
	async findAll(
		@User() user: UserType,
		@Query(
			new ValidationPipe({
				transform: true,
				transformOptions: { enableImplicitConversion: true },
				forbidNonWhitelisted: true,
			})
		)
		dto: GetAllFilesQueryDto
	): Promise<{
		files: FileEntity[];
		count: number;
	}> {
		return await this.filesService.findAll(user, dto);
	}

	@Get('folderFiles')
	async findFolderFiles(
		@User() user: UserType,
		@Query(
			new ValidationPipe({
				transform: true,
				transformOptions: { enableImplicitConversion: true },
				forbidNonWhitelisted: true,
			})
		)
		dto: GetFolderFilesDto
	): Promise<FileEntity[]> {
		return await this.filesService.findFolderFiles(user, dto);
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
		@User() user: UserType
	): Promise<FileEntity> {
		return await this.filesService.create(user, { file, ...dto });
	}

	@Put()
	async update(@User() user: UserType, @Body() dto: UpdateFileDto) {
		return await this.filesService.update(user, dto);
	}

	@Delete('softDelete')
	async softDelete(
		@User() user: UserType,
		@Query('ids') dto: string
	): Promise<boolean> {
		return await this.filesService.softDelete(user, dto);
	}

	@Delete('delete')
	async delete(
		@User() user: UserType,
		@Query('ids') ids: string
	): Promise<boolean> {
		return await this.filesService.delete(user, ids);
	}
}
