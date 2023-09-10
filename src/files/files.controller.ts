import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  UseGuards,
  Query,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserId } from 'src/decorators/user-id.decorator';
import { fileStorage } from './storage';
import { FilesService } from './files.service';
import { FileEntity } from './entities/file.entity';
import { GetAllFilesQueryDto } from './dto/getAllFiles.dto';
import { UpdateResult } from 'typeorm';

@ApiTags('Files')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  async findAll(
    @UserId() userId: number,
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    query: GetAllFilesQueryDto,
  ): Promise<{
    files: FileEntity[];
    count: number;
    isLastPage: boolean;
  }> {
    return await this.filesService.findAll({
      userId,
      ...query,
    });
  }

  @Post()
  @UseInterceptors(FileInterceptor('file', { storage: fileStorage }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }) /* 5MB */,
        ],
      }),
    )
    file: Express.Multer.File,
    @UserId() userId: number,
  ): Promise<FileEntity> {
    return await this.filesService.create(file, userId);
  }

  @Delete()
  async remove(
    @UserId() userId: number,
    @Query('ids') ids: string,
  ): Promise<UpdateResult> {
    // file?ids=1,2,6,7,0
    return await this.filesService.remove(userId, ids);
  }
}
