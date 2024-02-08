import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, IsNull, Repository } from 'typeorm';
import { FolderEntity } from '../../entities/folder.entity';
import { type FileEntity } from 'src/entities/file.entity';

import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { DeleteFoldersDto } from './dto/delete-folders.dto';
import { GetFolderOneDto } from './dto/get-folder-one';
import { FilesService } from 'src/modules/files/files.service';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { UserType } from 'src/decorators/user.decorator';

@Injectable()
export class FoldersService {
	constructor(
		@InjectRepository(FolderEntity)
		private foldersRepository: Repository<FolderEntity>,
		private filesService: FilesService
	) {}

	async getOneFolder(
		user: UserType,
		{ folderId = 0, storageId }: GetFolderOneDto
	): Promise<{
		currentFolder: FolderEntity;
		folders: FolderEntity[];
		files: FileEntity[];
	}> {
		const currentFolderFindOptions: FindManyOptions<FolderEntity> = {
			where: {
				id: folderId,
				storage: { id: storageId },
				owner: { id: user.id },
			},
		};
		const foldersFindOptions: FindManyOptions<FolderEntity> = {
			where: {
				parent: Boolean(folderId) ? { id: folderId } : IsNull(),
				storage: { id: storageId },
				owner: { id: user.id },
			},
			relations: { sharedWith: true },
		};
		const [currentFolder, folders, files] = await Promise.all([
			await this.foldersRepository.findOne(currentFolderFindOptions),
			await this.foldersRepository.find(foldersFindOptions),
			await this.filesService.findFolderFiles(user, {
				folderId,
				storageId,
			}),
		]);

		return { currentFolder, folders, files };
	}

	async createFolder(
		user: UserType,
		{ folderName, storageId, parentFolderId = 0 }: CreateFolderDto
	): Promise<FolderEntity> {
		const parent = await this.foldersRepository.findOne({
			where: { id: parentFolderId ?? 0, owner: { id: user.id } },
		});

		return await this.foldersRepository.save({
			name: folderName,
			owner: { id: user.id },
			parent,
			storage: { id: storageId },
		});
	}

	async updateFolder(
		user: UserType,
		{ folderId, newFolderName, newParentFolderId }: UpdateFolderDto
	): Promise<boolean> {
		const partialEntity: QueryDeepPartialEntity<FolderEntity> = {};
		if (newFolderName) partialEntity.name = newFolderName;
		if (newParentFolderId) partialEntity.parent = { id: newParentFolderId };

		const updateResult = await this.foldersRepository.update(
			{ id: folderId, owner: { id: user.id } },
			partialEntity
		);

		return Boolean(updateResult.affected);
	}

	async deleteFolders(
		user: UserType,
		{ foldersIds }: DeleteFoldersDto
	): Promise<boolean> {
		const deleteResult = await this.foldersRepository.delete({
			owner: { id: user.id },
			id: In(foldersIds),
		});

		return Boolean(deleteResult.affected);
	}
}
