import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { FileEntity } from 'src/entities/file.entity';
import { FolderEntity } from 'src/entities/folder.entity';
import { UserEntity } from 'src/entities/user.entity';
import { UserType } from 'src/decorators/user.decorator';
import { ShareDto } from './dtos/share.dto';
import { UnshareDto } from './dtos/unshare.dto';

@Injectable()
export class ShareService {
	constructor(
		@InjectRepository(UserEntity)
		private usersRepository: Repository<UserEntity>,
		@InjectRepository(FileEntity)
		private filesRepository: Repository<FileEntity>,
		@InjectRepository(FolderEntity)
		private foldersRepository: Repository<FolderEntity>
	) {}

	async share(
		user: UserType,
		dto: ShareDto
	): Promise<{ sharedFiles: number[]; sharedFolders: number[] }> {
		const defaultValues = {
			folderIds: [],
			fileIds: [],
			userIdsToShareWith: [],
		};
		const { folderIds, fileIds, userIdsToShareWith } = {
			...defaultValues,
			...dto,
		};

		const [foldersToShare, filesToShare, usersToShare] = await Promise.all([
			await this.foldersRepository.find({
				where: { id: In(folderIds), owner: { id: user.id } },
				relations: { sharedWith: true },
			}),
			await this.filesRepository.find({
				where: { id: In(fileIds), owner: { id: user.id } },
				relations: { sharedWith: true },
			}),
			await this.usersRepository.find({
				where: { id: In(userIdsToShareWith) },
			}),
		]);

		const sharedFiles = await Promise.all(
			filesToShare.map(async (file) => {
				await this.filesRepository.save({
					id: file.id,
					sharedWith: Array.from(
						new Set([...usersToShare, ...file.sharedWith])
					),
				});
				return file.id;
			})
		);

		const sharedFolders = await Promise.all(
			foldersToShare.map(async (folder) => {
				await this.foldersRepository.save({
					id: folder.id,
					sharedWith: Array.from(
						new Set([...usersToShare, ...folder.sharedWith])
					),
				});
				return folder.id;
			})
		);

		return { sharedFiles, sharedFolders };
	}

	async unshare(
		user: UserType,
		dto: UnshareDto
	): Promise<{ unsharedFiles: number[]; unsharedFolders: number[] }> {
		const defaultValues = {
			folderIds: [],
			fileIds: [],
			userIdsToRemove: [],
		};
		const { folderIds, fileIds, userIdsToRemove } = {
			...defaultValues,
			...dto,
		};

		const [foldersToUnshare, filesToUnshare, usersToUnshare] =
			await Promise.all([
				await this.foldersRepository.find({
					where: { id: In(folderIds), owner: { id: user.id } },
					relations: { sharedWith: true },
				}),
				await this.filesRepository.find({
					where: { id: In(fileIds), owner: { id: user.id } },
					relations: { sharedWith: true },
				}),
				await this.usersRepository.find({
					where: { id: In(userIdsToRemove) },
				}),
			]);

		const unsharedFiles = await Promise.all(
			filesToUnshare.map(async (file) => {
				const newUsers = file.sharedWith.filter((sharedWith) =>
					usersToUnshare.includes(sharedWith)
				);

				await this.filesRepository.save({
					id: file.id,
					sharedWith: newUsers,
				});

				return file.id;
			})
		);

		const unsharedFolders = await Promise.all(
			foldersToUnshare.map(async (folder) => {
				const newUsers = folder.sharedWith.filter((sharedWith) =>
					usersToUnshare.includes(sharedWith)
				);

				await this.foldersRepository.save({
					id: folder.id,
					sharedWith: newUsers,
				});
				return folder.id;
			})
		);

		return { unsharedFiles, unsharedFolders };
	}
}
