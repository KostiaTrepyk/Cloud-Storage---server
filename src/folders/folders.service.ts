import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, IsNull, Repository } from 'typeorm';
import { FolderEntity } from './entities/folder.entity';
import { type FileEntity } from 'src/files/entities/file.entity';

import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { DeleteFoldersDto } from './dto/delete-folders.dto';
import { GetFolderOneDto } from './dto/get-folder-one';
import { FilesService } from 'src/files/files.service';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class FoldersService {
  constructor(
    @InjectRepository(FolderEntity)
    private foldersRepository: Repository<FolderEntity>,
    private filesService: FilesService,
  ) {}

  async getOneFolder({
    userId,
    folderId = 0,
    storageId,
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
        storage: { id: storageId },
        owner: { id: userId },
      },
    };
    const foldersFindOptions: FindManyOptions<FolderEntity> = {
      where: {
        parent: Boolean(folderId) ? { id: folderId } : IsNull(),
        storage: { id: storageId },
        owner: { id: userId },
      },
    };

    const currentFolder = await this.foldersRepository.findOne(
      currentFolderFindOptions,
    );
    const folders = await this.foldersRepository.find(foldersFindOptions);
    const files = await this.filesService.findFolderFiles({
      userId,
      folderId,
      storageId,
    });

    return { currentFolder, folders, files };
  }

  async createFolder({
    userId,
    folderName,
    storageId,
    parentFolderId = 0,
  }: CreateFolderDto & { userId: number }): Promise<FolderEntity> {
    const parent = await this.foldersRepository.findOne({
      where: { id: parentFolderId ?? 0, owner: { id: userId } },
    });

    return await this.foldersRepository.save({
      name: folderName,
      owner: { id: userId },
      parent,
      storage: { id: storageId },
    });
  }

  async updateFolder({
    userId,
    folderId,
    newFolderName,
    newParentFolderId,
  }: UpdateFolderDto & { userId: number }): Promise<boolean> {
    const partialEntity: QueryDeepPartialEntity<FolderEntity> = {};
    if (newFolderName) partialEntity.name = newFolderName;
    if (newParentFolderId) partialEntity.parent = { id: newParentFolderId };

    const updateResult = await this.foldersRepository.update(
      { id: folderId, owner: { id: userId } },
      partialEntity,
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
