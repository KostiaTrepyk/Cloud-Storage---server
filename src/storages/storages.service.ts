import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { type FindManyOptions, type Repository } from 'typeorm';
import { StorageEntity } from './entities/storage.entity';

import { type CreateStorageDto } from './dto/create-storage.dto';
import { type DeleteStorageDto } from './dto/delete-storage.dto';
import { type GetAllStoragesDto } from './dto/get-all-storages.dto';
import { type UpdateStorageDto } from './dto/update-storage.dto';

@Injectable()
export class StoragesService {
  constructor(
    @InjectRepository(StorageEntity)
    private storagesRepository: Repository<StorageEntity>,
  ) {}

  async getAllStorages({
    userId,
  }: GetAllStoragesDto & { userId: number }): Promise<StorageEntity[]> {
    const findOptoins: FindManyOptions<StorageEntity> = {
      where: { owner: { id: userId } },
      relations: { files: true },
    };

    const storages = await this.storagesRepository.find(findOptoins);

    const result = [];

    for (let id = 0; id < storages.length; id++) {
      const storage = storages[id];

      const totalFilesSize =
        storage.files.reduce((acc, file) => acc + file.size, 0) / 1024 / 1024;
      const remainingSpace = storage.size - totalFilesSize;

      const { files, ...rest } = storage;

      result.push({ ...rest, remainingSpace });
    }

    return result;
  }

  async createStorage({
    name,
    userId,
  }: CreateStorageDto & { userId: number }): Promise<StorageEntity> {
    const createdStorage = await this.storagesRepository.save({
      name: name,
      size: 512,
      owner: { id: userId },
    });

    return createdStorage;
  }

  async updateStorage({
    userId,
    storageId,
    newName,
  }: UpdateStorageDto & { userId: number }): Promise<boolean> {
    const res = await this.storagesRepository.update(
      { id: storageId, owner: { id: userId } },
      { name: newName },
    );

    return Boolean(res.affected);
  }

  async deleteStorage({
    userId,
    storageId,
  }: DeleteStorageDto & { userId: number }): Promise<boolean> {
    const res = await this.storagesRepository.delete({
      id: storageId,
      owner: { id: userId },
    });

    return Boolean(res.affected);
  }

  async getStorageData({
    userId,
    storageId,
  }: {
    userId: number;
    storageId: number;
  }): Promise<{ storage: StorageEntity; remainingSpace: number }> {
    const storage = await this.storagesRepository.findOne({
      where: {
        id: storageId,
        owner: { id: userId },
      },
      relations: { files: true, folders: true },
    });

    const totalFilesSize =
      storage.files.reduce((acc, file) => acc + file.size, 0) / 1024 / 1024;
    const remainingSpace = storage.size - totalFilesSize;

    return { storage, remainingSpace };
  }
}
