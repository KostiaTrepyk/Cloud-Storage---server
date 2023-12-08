import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, Repository } from 'typeorm';
import { FolderEntity } from './entities/folder.entity';
import { type FileEntity } from 'src/files/entities/file.entity';

import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { DeleteFoldersDto } from './dto/delete-folders.dto';
import { GetFolderOneDto } from './dto/get-folder-one';

@Injectable()
export class FoldersService {
  constructor(
    @InjectRepository(FolderEntity)
    private foldersRepository: Repository<FolderEntity>,
  ) {}

  async getOneFolder({
    userId,
    folderId = 0,
  }: GetFolderOneDto & {
    userId: number;
  }): Promise<{
    currentFolder: FolderEntity;
    folders: FolderEntity[];
    files: FileEntity[];
  }> {
    const currentFolderFindOptions: FindManyOptions<FolderEntity> = {
      where: {
        id: folderId,
        owner: { id: userId },
      },
    };
    const foldersFindOptions: FindManyOptions<FolderEntity> = {
      where: {
        parrentFolderId: folderId,
        owner: { id: userId },
      },
    };
    const filesFindOptions: FindManyOptions<FolderEntity> = {
      where: {
        owner: { id: userId },
        id: folderId,
      },
      relations: { files: { sharedWith: true } },
    };

    const currentFolder = await this.foldersRepository.findOne(
      currentFolderFindOptions,
    );
    const folders = await this.foldersRepository.find(foldersFindOptions);
    const files =
      (await this.foldersRepository.findOne(filesFindOptions))?.files ?? [];

    return { currentFolder, folders, files };
  }

  async createFolder({
    userId,
    folderName,
    parrentFolderId = 0,
  }: CreateFolderDto & { userId: number }): Promise<FolderEntity> {
    return this.foldersRepository.save({
      name: folderName,
      owner: { id: userId },
      parrentFolderId,
    });
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
