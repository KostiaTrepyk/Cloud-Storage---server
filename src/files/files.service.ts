import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
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
  }> {
    const qb = this.fileRepository.createQueryBuilder('file');

    qb.where('file.userId = :userId', { userId });

    /* Search by mimetype */
    if (filesType === FileType.PHOTOS) {
      qb.andWhere('file.mimetype LIKE :type', { type: '%image%' });
    } else if (filesType === FileType.APPLICATIONS) {
      qb.andWhere('file.mimetype LIKE :type', { type: '%application%' });
    } else if (filesType === FileType.TRASH) {
      qb.withDeleted().andWhere('file.deletedAt IS NOT NULL');
    }

    /* Sorting */
    if (sort !== 'NO') {
      qb.addOrderBy('originalname', sort);
    } else {
      /* Sort by creation time */
      qb.addOrderBy('createdAt', 'DESC');
    }

    /* Search by originalname */
    if (search) {
      qb.andWhere('file.originalname LIKE :search', {
        search: `%${search}%`,
      });
    }

    /* Search by creation date */
    if (createdAt) {
      qb.andWhere('file.createdAt LIKE :createdAt', {
        createdAt: `%${createdAt}%`,
      });
    }

    /* Pagination */
    qb.skip((page - 1) * limit);
    qb.take(limit);

    const count = await qb.getCount();
    const isLastPage = count - page * limit <= 0;
    const files = await qb.getMany();

    return { files, count, isLastPage };
  }

  async create(file: Express.Multer.File, userId: number): Promise<FileEntity> {
    return await this.fileRepository.save({
      filename: file.filename,
      originalname: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      user: { id: userId },
    });
  }

  async remove(userId: number, ids: string): Promise<UpdateResult> {
    const idsArray = ids.split(',');

    const qb = this.fileRepository.createQueryBuilder('file');

    qb.where('id IN (:...ids) AND userId = :userId', {
      ids: idsArray,
      userId,
    });

    return await qb.softDelete().execute();
  }
}
