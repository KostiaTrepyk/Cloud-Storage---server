import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { FileEntity } from 'src/entities/file.entity';
import { FolderEntity } from 'src/entities/folder.entity';
import { UserEntity } from 'src/entities/user.entity';
import { UnshareFilesDto } from './dtos/unshare-fIles.dto';
import { ShareFilesDto } from './dtos/share-files.dto';
import { UnshareFoldersDto } from './dtos/unshare-folder.dto';
import { ShareFoldersDto } from './dtos/share-folder.dto';

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

	async shareFiles(
		userId: number,
		{ fileIds, userIdsToShareWith }: ShareFilesDto
	): Promise<{ sharedWith: number[] }> {
		const filesToShare = await this.filesRepository.find({
			where: { id: In(fileIds), owner: { id: userId } },
			relations: { sharedWith: true },
		});

		const usersToShare = await this.usersRepository.find({
			where: { id: In(userIdsToShareWith) },
		});

		const result = await Promise.all(
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

		return { sharedWith: result };
	}

	async unshareFiles(
		userId: number,
		{ fileIds, userIdsToRemove }: UnshareFilesDto
	): Promise<boolean> {
		const filesToUnshare = await this.filesRepository.find({
			where: { id: In(fileIds), owner: { id: userId } },
			relations: { sharedWith: true },
		});
		const usersToUnshare = await this.usersRepository.find({
			where: { id: In(userIdsToRemove) },
		});

		await Promise.all(
			filesToUnshare.map(async (file) => {
				const newUsers = file.sharedWith.filter((sharedWith) =>
					usersToUnshare.includes(sharedWith)
				);

				await this.filesRepository.save({
					id: file.id,
					sharedWith: newUsers,
				});
			})
		);

		return true;
	}

	async shareFolders(
		userId: number,
		{ folderIds, userIdsToShareWith }: ShareFoldersDto
	): Promise<{ sharedWith: number[] }> {
		const fodlersToShare = await this.foldersRepository.find({
			where: { id: In(folderIds), owner: { id: userId } },
			relations: { sharedWith: true },
		});

		const usersToShare = await this.usersRepository.find({
			where: { id: In(userIdsToShareWith) },
		});

		const result = await Promise.all(
			fodlersToShare.map(async (fodler) => {
				await this.foldersRepository.save({
					id: fodler.id,
					sharedWith: Array.from(
						new Set([...usersToShare, ...fodler.sharedWith])
					),
				});
				return fodler.id;
			})
		);

		return { sharedWith: result };
	}

	async unshareFolders(
		userId: number,
		{ folderIds, userIdsToRemove }: UnshareFoldersDto
	): Promise<boolean> {
		const foldersToUnshare = await this.foldersRepository.find({
			where: { id: In(folderIds), owner: { id: userId } },
			relations: { sharedWith: true },
		});
		const usersToUnshare = await this.usersRepository.find({
			where: { id: In(userIdsToRemove) },
		});

		await Promise.all(
			foldersToUnshare.map(async (folder) => {
				const newUsers = folder.sharedWith.filter((sharedWith) =>
					usersToUnshare.includes(sharedWith)
				);

				await this.foldersRepository.save({
					id: folder.id,
					sharedWith: newUsers,
				});
			})
		);

		return true;
	}
}
