import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity, FileType } from './entities/file.entity';
import { Repository } from 'typeorm';
import { GetAllFilesQueryDto } from './dto/getAllFiles.dto';
import { SortValue } from './types';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity)
    private fileRepository: Repository<FileEntity>,
  ) {}

  async findAll({
    userId,
    filesType,
    page = 1,
    limit = 15,
    sort = SortValue.NO,
    search,
    createdAt,
  }: GetAllFilesQueryDto & { userId: number }) {
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

    return qb.getMany();
  }

  async create(file: Express.Multer.File, userId: number) {
    return await this.fileRepository.save({
      filename: file.filename,
      originalname: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      user: { id: userId },
    });
  }

  async remove(userId: number, ids: string) {
    const idsArray = ids.split(',');

    const qb = this.fileRepository.createQueryBuilder('file');

    qb.where('id IN (:...ids) AND userId = :userId', {
      ids: idsArray,
      userId,
    });

    return qb.softDelete().execute();
  }
}
