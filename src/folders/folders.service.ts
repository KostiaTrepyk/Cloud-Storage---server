import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, Like, Repository } from 'typeorm';
import { FolderEntity } from './entities/folder.entity';
import { SortValue } from 'src/files/types';

import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { GetFoldersDto } from './dto/get-folders.dto';
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

        /* FIX TYPE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
        createdAt: createdAt && Like(`%${createdAt}%` as any),

        /* Search by name */
        name: Boolean(search) && Like(`%${search}%`),
      },
      relations: { files: true },

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
  }: CreateFolderDto & { userId: number }): Promise<FolderEntity> {
    const createdFolder = this.foldersRepository.create({
      name: folderName,
      owner: { id: userId },
    });

    return await this.foldersRepository.save(createdFolder);
  }

  async updateFolder({
    userId,
    folderId,
    newFolderName,
  }: UpdateFolderDto & { userId: number }): Promise<boolean> {
    const updateResult = await this.foldersRepository.update(
      { id: folderId, owner: { id: userId } },
      { name: newFolderName },
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
