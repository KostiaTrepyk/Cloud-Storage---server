import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, IsNull, Like, Not, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { StoragesService } from 'src/storages/storages.service';
import { FileEntity } from '../entities/file.entity';
import { FileType, SortValue } from './types';
import { FilesStatistic } from './types/FilesStatistic';

import { GetAllFilesQueryDto } from './dto/get-all-files';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { GetFolderFilesDto } from './dto/get-folder-files.dto';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity)
    private filesRepository: Repository<FileEntity>,

    private storagesService: StoragesService,
  ) {}

  async findFolderFiles({
    userId,
    folderId,
    storageId,
  }: GetFolderFilesDto & { userId: number }): Promise<FileEntity[]> {
    return await this.filesRepository.find({
      where: {
        owner: { id: userId },
        storage: { id: storageId },
        parent: Boolean(folderId) ? { id: folderId } : IsNull(),
      },
      relations: { sharedWith: true },
    });
  }

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
      relations: { sharedWith: true, storage: true, parent: true },

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
    storageId,
    folderId,
  }: {
    file: Express.Multer.File;
    userId: number;
  } & CreateFileDto): Promise<FileEntity> {
    const storageData = await this.storagesService.getStorageData({
      userId,
      storageId,
    });

    if (
      (storageData.remainingSpace + file.size) / 1024 / 1024 >
      storageData.storage.size
    ) {
      throw new HttpException('Storage space', HttpStatus.BAD_REQUEST);
    }

    const createdFile = this.filesRepository.create({
      parent: Boolean(Number(folderId)) ? { id: folderId } : null,
      filename: file.filename,
      originalname: file.originalname.split('.').slice(0, -1).join('.'),
      size: file.size,
      mimetype: file.mimetype,
      storage: { id: storageId },
      owner: { id: userId },
    });

    try {
      return await this.filesRepository.save(createdFile);
    } catch (error) {
      throw new HttpException('Can not save file!', HttpStatus.BAD_REQUEST);
    }
  }

  async update({
    id,
    userId,
    newOriginalName,
    newFolderId,
  }: UpdateFileDto & { userId: number }): Promise<boolean> {
    const partialEntity: QueryDeepPartialEntity<FileEntity> = {};
    if (newOriginalName) partialEntity.originalname = newOriginalName;
    if (newFolderId) partialEntity.parent = { id: newFolderId };

    const result = await this.filesRepository.update(
      {
        id,
        owner: { id: userId },
      },
      partialEntity,
    );

    if (result.affected == 0) return false;

    return true;
  }

  async softDelete(userId: number, ids: string): Promise<boolean> {
    const idsArray = ids.split(',');

    const files = await this.filesRepository.find({
      where: {
        owner: { id: userId },
        id: In(idsArray),
      },
    });

    files.forEach(async (file) => {
      await this.filesRepository.update(
        { id: file.id },
        { isFavourite: false },
      );
    });

    await this.filesRepository.softDelete({
      owner: { id: userId },
      id: In(idsArray),
    });

    return true;
  }

  async delete(userId: number, ids: string): Promise<boolean> {
    const idsArray = ids.split(',');

    await this.filesRepository.delete({
      owner: { id: userId },
      id: In(idsArray),
    });

    return true;
  }

  async getStatistic(userId: number): Promise<FilesStatistic> {
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
