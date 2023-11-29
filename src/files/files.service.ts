import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, IsNull, Like, Not, Repository } from 'typeorm';
import { FileEntity } from './entities/file.entity';
import { GetAllFilesQueryDto } from './dto/get-all-files';
import { FileType, SortValue } from './types';
import { CreateFileDto } from './dto/create-file.dto';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity)
    private filesRepository: Repository<FileEntity>,
  ) {}

  /* Update Route !!!!!!!!!!!!!!!! */
  async findAll({
    userId,
    filesType = FileType.ALL,
    offset = 0,
    limit = 15,
    sort = SortValue.NO,
    search = '',
    createdAt,
  }: GetAllFilesQueryDto & { userId: number }): Promise<{
    files: FileEntity[];
    count: number;
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
        originalname: Boolean(search) && Like(`%${search}%`),
      },
      relations: { sharedWith: true, owner: true },

      /* Sorting */
      order: {
        /* default */
        createdAt: sort === SortValue.NO ? 'DESC' : undefined,

        originalname: sort !== SortValue.NO && sort,
      },

      /* Pagination */
      skip: offset,
      take: limit,
    };

    const files = await this.filesRepository.find(findOptions);
    const count = await this.filesRepository.count(findOptions);

    return { files, count };
  }

  async create({
    file,
    userId,
    folderId,
  }: {
    file: Express.Multer.File;
    userId: number;
  } & CreateFileDto): Promise<FileEntity> {
    const total = await this.filesRepository.sum('size', {
      owner: { id: userId },
    });

    if ((total + file.size) / 1024 / 1024 > 100) {
      throw new HttpException('Max storage 100MB', HttpStatus.BAD_REQUEST);
    }

    const createdFile = this.filesRepository.create({
      folder: { id: folderId },
      filename: file.filename,
      originalname: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      owner: { id: userId },
    });

    return await this.filesRepository.save(createdFile);
  }

  async softDelete(userId: number, ids: string) {
    const idsArray = ids.split(',');

    const files = await this.filesRepository.find({
      where: {
        owner: { id: userId },
        id: In(idsArray),
      },
    });

    files.forEach(async (file) => {
      await this.filesRepository.update(file, { isFavourite: false });
    });

    await this.filesRepository.softDelete({
      owner: { id: userId },
      id: In(idsArray),
    });

    return true;
  }

  async delete(userId: number, ids: string) {
    const idsArray = ids.split(',');

    await this.filesRepository.delete({
      owner: { id: userId },
      id: In(idsArray),
    });

    return true;
  }

  async getStatistic(userId: number) {
    const filesCount = await this.filesRepository.count({
      where: {
        owner: { id: userId },
      },
    });

    const averageFileSize = await this.filesRepository.average('size', {
      owner: { id: userId },
    });

    const totalFileSize = await this.filesRepository.sum('size', {
      owner: { id: userId },
    });

    return {
      filesCount,
      averageFileSize,
      totalFileSize,
    };
  }
}
