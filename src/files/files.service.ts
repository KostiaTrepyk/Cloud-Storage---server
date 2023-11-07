import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, IsNull, Like, Not, Repository } from 'typeorm';
import { FileEntity } from './entities/file.entity';
import { GetAllFilesQueryDto } from './dto/getAllFiles.dto';
import { FileType, SortValue } from './types';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity)
    private fileRepository: Repository<FileEntity>,
  ) {}

  async findAll({
    userId,
    filesType = FileType.ALL,
    page = 1,
    limit = 15,
    sort = SortValue.NO,
    search,
    createdAt,
  }: GetAllFilesQueryDto & { userId: number }): Promise<{
    files: FileEntity[];
    count: number;
    isLastPage: boolean;
    page: number;
  }> {
    const mimetype: string =
      filesType === FileType.APPLICATIONS
        ? '%application%'
        : filesType === FileType.PHOTOS
        ? '%image%'
        : '';

    const findOptions: FindManyOptions<FileEntity> = {
      where: {
        owner: { id: userId },

        mimetype: Like(`%${mimetype}%`),
        /* FIX TYPE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
        createdAt: createdAt && Like(`%${createdAt}%` as any),

        /* Trash */
        deletedAt: filesType === FileType.TRASH ? Not(IsNull()) : IsNull(),

        /* Search by original name */
        originalname: search && Like(`%${search}%`),
      },
      relations: { sharedWith: true, owner: true },

      /* Sorting */
      order: {
        /* default */
        createdAt: sort === SortValue.NO ? 'DESC' : undefined,

        originalname: sort !== SortValue.NO && sort,
      },

      /* Pagination */
      skip: (page - 1) * limit,
      take: limit,
    };

    const files = await this.fileRepository.find(findOptions);
    const count = await this.fileRepository.count(findOptions);
    const isLastPage = count - page * limit <= 0;

    return { files, count, isLastPage, page };
  }

  async create(file: Express.Multer.File, userId: number): Promise<FileEntity> {
    const total = await this.fileRepository.sum('size', {
      owner: { id: userId },
      deletedAt: null,
    });

    if ((total + file.size) / 1024 / 1024 > 100) {
      throw new HttpException('Max storage 100MB', HttpStatus.BAD_REQUEST);
    }

    return await this.fileRepository.save({
      filename: file.filename,
      originalname: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      owner: { id: userId },
    });
  }

  /** FIX */
  async remove(userId: number, ids: string) {
    const idsArray = ids.split(',');

    try {
      /* Remove from favourite */
      await this.fileRepository.update(
        { id: In(idsArray) },
        { isFavourite: false },
      );
      await this.fileRepository.softDelete({ id: In(idsArray) });
    } catch (error) {
      return false;
    }

    return true;
  }
}
