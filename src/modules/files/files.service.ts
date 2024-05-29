import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, IsNull, Like, Not, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { FileEntity } from '../../entities/file.entity';
import { FileType, SortValue } from './types/types';
import { FilesStatistic } from './types/FilesStatistic';

import { GetAllFilesQueryDto } from './dto/get-all-files.dto';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { GetFolderFilesDto } from './dto/get-folder-files.dto';
import { StoragesHelper } from 'src/modules/storages/helpers/storages.helper';
import { UserType } from 'src/decorators/user.decorator';
import { DeleteFileDto } from './dto/delete-file.dto';
import { SoftDeleteFileDto } from './dto/seft-delete.dto';

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

		const files = await this.filesRepository.find(findOptions).catch(() => {
			throw new HttpException('Can not get files.', HttpStatus.CONFLICT);
		});

		return { files, count: files.length };
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
			throw new HttpException('Can not save file!', HttpStatus.CONFLICT);
		}
	}

	async update(
		user: UserType,
		{ id, newOriginalName, newFolderId, isFavourite }: UpdateFileDto
	): Promise<boolean> {
		// Validate input data
		if (!id) {
			throw new HttpException(
				'File ID is required.',
				HttpStatus.BAD_REQUEST
			);
		}

		// Ensure at least one field to update is provided
		if (
			newOriginalName === undefined &&
			newFolderId === undefined &&
			isFavourite === undefined
		) {
			throw new HttpException(
				'At least one field to update is required.',
				HttpStatus.BAD_REQUEST
			);
		}

		// Ensure file exists and user is the owner
		const file = await this.filesRepository.findOne({
			where: { id },
			relations: { owner: true },
		});

		if (!file) {
			throw new HttpException('File not found', HttpStatus.NOT_FOUND);
		}
		if (file.owner.id !== user.id) {
			throw new HttpException(
				'You are not the owner of the file.',
				HttpStatus.FORBIDDEN
			);
		}

		// Prepare partial entity
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

		// Update file
		const result = await this.filesRepository
			.update({ id, owner: { id: user.id } }, partialEntity)
			.catch(() => {
				throw new HttpException(
					'Failed to update file.',
					HttpStatus.INTERNAL_SERVER_ERROR
				);
			});

		// Check if any rows were affected
		if (result.affected === 0)
			throw new HttpException(
				'No changes were made.',
				HttpStatus.CONFLICT
			);

		return true;
	}

	async softDelete(
		user: UserType,
		{ id }: SoftDeleteFileDto
	): Promise<boolean> {
		if (!id) {
			throw new HttpException(
				'File id is required.',
				HttpStatus.BAD_REQUEST
			);
		}

		const file = await this.filesRepository.findOne({ where: { id } });

		if (!file) {
			throw new HttpException('File is not found.', HttpStatus.NOT_FOUND);
		}

		const { affected } = await this.filesRepository
			.softDelete({
				owner: { id: user.id },
				id,
			})
			.catch(() => {
				throw new HttpException(
					'Failed to delete file.',
					HttpStatus.INTERNAL_SERVER_ERROR
				);
			});

		if (affected === 0) {
			throw new HttpException(
				'No changes were made.',
				HttpStatus.CONFLICT
			);
		}

		return true;
	}

	async delete(user: UserType, { id }: DeleteFileDto): Promise<boolean> {
		if (!id) {
			throw new HttpException(
				'File id is required.',
				HttpStatus.BAD_REQUEST
			);
		}

		const file = await this.filesRepository.findOne({ where: { id } });

		if (!file) {
			throw new HttpException('File is not found.', HttpStatus.NOT_FOUND);
		}

		const { affected } = await this.filesRepository
			.delete({
				owner: { id: user.id },
				id,
			})
			.catch(() => {
				throw new HttpException(
					'Failed to delete file.',
					HttpStatus.INTERNAL_SERVER_ERROR
				);
			});

		if (affected === 0) {
			throw new HttpException(
				'No changes were made.',
				HttpStatus.CONFLICT
			);
		}

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
