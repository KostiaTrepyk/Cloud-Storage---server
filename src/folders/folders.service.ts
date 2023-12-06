import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, Like, Repository } from 'typeorm';
import { FolderEntity } from './entities/folder.entity';
import { SortValue } from 'src/files/types';

import { GetFoldersDto } from './dto/get-folders.dto';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { DeleteFoldersDto } from './dto/delete-folders.dto';

@Injectable()
export class FoldersService {
  constructor(
    @InjectRepository(FolderEntity)
    private foldersRepository: Repository<FolderEntity>,
  ) {}

  async getFolders({
    userId,
    limit = 20,
    offset = 0,
    search = '',
    sort = SortValue.NO,
    parrentFolderId,
    createdAt,
  }: GetFoldersDto & {
    userId: number;
  }): Promise<{
    folders: FolderEntity[];
    count: number;
  }> {
    const findOptions: FindManyOptions<FolderEntity> = {
      where: {
        owner: { id: userId },

        parrentFolderId,

        /* FIX TYPE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
        createdAt: createdAt && Like(`%${createdAt}%` as any),

        /* Search by name */
        name: Boolean(search) && Like(`%${search}%`),
      },
      relations: { items: true },

      /* Sorting */
      order: {
        /* default */
        createdAt: sort === SortValue.NO ? 'DESC' : undefined,

        name: sort !== SortValue.NO && sort,
      },

      /* Pagination */
      skip: offset,
      take: limit,
    };

    const folders = await this.foldersRepository.find(findOptions);
    const count = await this.foldersRepository.count(findOptions);

    return { folders, count };
  }

  async createFolder({
    userId,
    folderName,
    parrentFolderId = 0,
  }: CreateFolderDto & { userId: number }): Promise<FolderEntity> {
    const createdFolder = this.foldersRepository.create({
      name: folderName,
      owner: { id: userId },
      parrentFolderId,
    });

    return await this.foldersRepository.save(createdFolder);
  }

  async updateFolder({
    userId,
    folderId,
    newFolderName,
    newParrentFolderId,
  }: UpdateFolderDto & { userId: number }): Promise<boolean> {
    const updateResult = await this.foldersRepository.update(
      { id: folderId, owner: { id: userId } },
      { name: newFolderName, parrentFolderId: newParrentFolderId },
    );

    return Boolean(updateResult.affected);
  }

  async deleteFolders({
    userId,
    foldersIds,
  }: DeleteFoldersDto & { userId: number }): Promise<boolean> {
    const deleteResult = await this.foldersRepository.delete({
      owner: { id: userId },
      id: In(foldersIds),
    });

    return Boolean(deleteResult.affected);
  }
}
