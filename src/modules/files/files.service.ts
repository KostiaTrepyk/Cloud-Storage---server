import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, IsNull, Like, Not, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { FileEntity } from '../../entities/file.entity';
import { FileType, SortValue } from './types/types';
import { FilesStatistic } from './types/FilesStatistic';

import { GetAllFilesQueryDto } from './dto/get-all-files';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { GetFolderFilesDto } from './dto/get-folder-files.dto';
import { StoragesHelper } from 'src/modules/storages/helpers/storages.helper';
import { UserType } from 'src/decorators/user.decorator';

@Injectable()
export class FilesService {
	constructor(
		@InjectRepository(FileEntity)
		private filesRepository: Repository<FileEntity>,
		private storagesHelper: StoragesHelper
	) {}

	async findFolderFiles(
		user: UserType,
		{ folderId, storageId }: GetFolderFilesDto
	): Promise<FileEntity[]> {
		return await this.filesRepository.find({
			where: {
				owner: { id: user.id },
				storage: { id: storageId },
				parent: Boolean(folderId) ? { id: folderId } : IsNull(),
			},
			relations: { sharedWith: true },
		});
	}

	async findAll(
		user: UserType,
		{
			filesType = FileType.ALL,
			offset = 0,
			limit = 15,
			sort = SortValue.NO,
			search = '',
			createdAt,
		}: GetAllFilesQueryDto
	): Promise<{
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
				owner: { id: user.id },

				mimetype: Like(`%${mimetype}%`),
				/* FIX TYPE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
				createdAt: createdAt && Like(`%${createdAt}%` as any),

				/* Trash */
				deletedAt:
					filesType === FileType.TRASH ? Not(IsNull()) : IsNull(),

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

	async create(
		user: UserType,
		{
			file,
			storageId,
			folderId,
		}: {
			file: Express.Multer.File;
		} & CreateFileDto
	): Promise<FileEntity> {
		const remainingSpace = await this.storagesHelper.remainingSpace(
			storageId
		);

		if (remainingSpace < file.size) {
			throw new HttpException('Storage space', HttpStatus.BAD_REQUEST);
		}

		const createdFile = this.filesRepository.create({
			parent: Boolean(Number(folderId)) ? { id: folderId } : null,
			filename: file.filename,
			originalname: file.originalname.split('.').slice(0, -1).join('.'),
			size: file.size,
			mimetype: file.mimetype,
			storage: { id: storageId },
			owner: { id: user.id },
		});

		try {
			return await this.filesRepository.save(createdFile);
		} catch (error) {
			throw new HttpException(
				'Can not save file!',
				HttpStatus.BAD_REQUEST
			);
		}
	}

	async update(
		user: UserType,
		{ id, newOriginalName, newFolderId, isFavourite }: UpdateFileDto
	): Promise<boolean> {
		const partialEntity: QueryDeepPartialEntity<FileEntity> = {};
		if (newOriginalName !== undefined) {
			partialEntity.originalname = newOriginalName;
		}
		if (newFolderId !== undefined) {
			partialEntity.parent = { id: newFolderId };
		}
		if (isFavourite !== undefined) {
			partialEntity.isFavourite = isFavourite;
		}

		const result = await this.filesRepository.update(
			{ id, owner: { id: user.id } },
			partialEntity
		);

		if (result.affected == 0) return false;

		return true;
	}

	async softDelete(user: UserType, ids: string): Promise<boolean> {
		const idsArray = ids.split(',');

		const files = await this.filesRepository.find({
			where: {
				owner: { id: user.id },
				id: In(idsArray),
			},
		});

		files.forEach(async (file) => {
			await this.filesRepository.update(
				{ id: file.id },
				{ isFavourite: false }
			);
		});

		await this.filesRepository.softDelete({
			owner: { id: user.id },
			id: In(idsArray),
		});

		return true;
	}

	async delete(user: UserType, ids: string): Promise<boolean> {
		const idsArray = ids.split(',');

		await this.filesRepository.delete({
			owner: { id: user.id },
			id: In(idsArray),
		});

		return true;
	}

	async getStatistic(user: UserType): Promise<FilesStatistic> {
		const filesCount = await this.filesRepository.count({
			where: {
				owner: { id: user.id },
			},
		});

		const averageFileSize = await this.filesRepository.average('size', {
			owner: { id: user.id },
		});

		const totalFileSize = await this.filesRepository.sum('size', {
			owner: { id: user.id },
		});

		return {
			filesCount,
			averageFileSize,
			totalFileSize,
		};
	}
}
