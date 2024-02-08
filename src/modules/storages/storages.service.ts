import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { type FindManyOptions, type Repository } from 'typeorm';
import { StorageEntity } from '../../entities/storage.entity';

import { type CreateStorageDto } from './dto/create-storage.dto';
import { type DeleteStorageDto } from './dto/delete-storage.dto';
import { type GetAllStoragesDto } from './dto/get-all-storages.dto';
import { type UpdateStorageDto } from './dto/update-storage.dto';
import { UserType } from 'src/decorators/user.decorator';

@Injectable()
export class StoragesService {
	constructor(
		@InjectRepository(StorageEntity)
		private storagesRepository: Repository<StorageEntity>
	) {}

	async getAllStorages(
		user: UserType,
		dto: GetAllStoragesDto
	): Promise<StorageEntity[]> {
		const findOptoins: FindManyOptions<StorageEntity> = {
			where: { owner: { id: user.id } },
			relations: { files: true },
		};

		const storages = await this.storagesRepository.find(findOptoins);

		const result = [];

		for (let id = 0; id < storages.length; id++) {
			const storage = storages[id];

			const totalFilesSize =
				storage.files.reduce((acc, file) => acc + file.size, 0) /
				1024 /
				1024;
			const remainingSpace = storage.size - totalFilesSize;

			const { files, ...rest } = storage;

			result.push({ ...rest, remainingSpace });
		}

		return result;
	}

	async createStorage(
		user: UserType,
		{ name }: CreateStorageDto
	): Promise<StorageEntity> {
		const counts = await this.storagesRepository.count({
			where: { owner: { id: user.id } },
		});

		if (counts >= 2) throw new HttpException('', HttpStatus.FORBIDDEN);

		const createdStorage = await this.storagesRepository.save({
			name,
			size: 100 * 1024 * 1024, // 100 MB
			owner: { id: user.id },
		});

		return createdStorage;
	}

	async updateStorage(
		user: UserType,
		{ storageId, newName }: UpdateStorageDto
	): Promise<boolean> {
		const res = await this.storagesRepository.update(
			{ id: storageId, owner: { id: user.id } },
			{ name: newName }
		);

		return Boolean(res.affected);
	}

	async deleteStorage(
		user: UserType,
		{ storageId }: DeleteStorageDto
	): Promise<boolean> {
		const res = await this.storagesRepository.delete({
			id: storageId,
			owner: { id: user.id },
		});

		return Boolean(res.affected);
	}
}
