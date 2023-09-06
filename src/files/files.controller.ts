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
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserId } from 'src/decorators/user-id.decorator';
import { fileStorage } from './storage';
import { FilesService } from './files.service';
import { FileEntity, FileType } from './entities/file.entity';

@ApiTags('files')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  /* FIX type error */
  @Get()
  async findAll(
    @UserId() userId: number,
    @Query('type') fileType: FileType,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<FileEntity[]> {
    if (!userId || !fileType || !page || !limit)
      throw new HttpException('BAD REQUEST', HttpStatus.BAD_REQUEST);

    return await this.filesService.findAll({
      userId,
      fileType,
      page,
      limit,
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
  ) {
    return this.filesService.create(file, userId);
  }

  @Delete()
  remove(@UserId() userId: number, @Query('ids') ids: string) {
    // file?ids=1,2,6,7,0
    return this.filesService.remove(userId, ids);
  }
}
