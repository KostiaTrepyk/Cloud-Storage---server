import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StorageEntity } from '../../../entities/storage.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StoragesHelper {
	constructor(
		@InjectRepository(StorageEntity)
		private storagesRepository: Repository<StorageEntity>
	) {}

	async remainingSpace(storageId: number): Promise<number> {
		const { files, ...storage } = await this.storagesRepository.findOne({
			where: { id: storageId },
			relations: { files: true },
		});

		const totalFilesSize = files.reduce((acc, file) => acc + file.size, 0);
		const remainingSpace = storage.size - totalFilesSize;

		return remainingSpace;
	}
}

