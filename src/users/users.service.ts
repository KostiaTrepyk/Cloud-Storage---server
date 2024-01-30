import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import {
	FindManyOptions,
	FindOptionsOrder,
	FindOptionsSelect,
	Like,
	Not,
	Repository,
} from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { GetAllUsersDto } from './dto/get-all-users.dto';
import { StoragesService } from 'src/storages/storages.service';
import { FilesService } from 'src/files/files.service';
import { FilesStatistic } from 'src/files/types/FilesStatistic';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UserEntity)
		private usersRepository: Repository<UserEntity>,
		private storagesService: StoragesService,
		private filesService: FilesService
	) {}
	async findByEmail(
		email: string,
		select?: FindOptionsSelect<UserEntity>
	): Promise<UserEntity> {
		return await this.usersRepository.findOne({
			where: { email },
			select,
		});
	}

	async getUserData(userId: number): Promise<UserEntity> {
		const user = await this.usersRepository.findOne({
			where: {
				id: userId,
			},
		});

		return user;
	}

	async getUserDataWithStatistic(
		userId: number
	): Promise<{ user: UserEntity; statistic: FilesStatistic }> {
		return {
			user: await this.getUserData(userId),
			statistic: await this.filesService.getStatistic(userId),
		};
	}

	async getAllUsers({
		userId,
		offset = 0,
		limit = 15,
		searchByEmail = '',
		orderBy,
		orderValue,
	}: GetAllUsersDto & { userId: number }): Promise<{
		count: number;
		users: UserEntity[];
	}> {
		let order: FindOptionsOrder<UserEntity> = null;
		if (orderBy === 'Creation' && orderValue) {
			order = { createdAt: orderValue };
		}
		if (orderBy === 'SharedWith' && orderValue) {
			order = { sharedFiles: { id: orderValue } };
		}

		const findOptions: FindManyOptions<UserEntity> = {
			where: {
				id: Not(userId),
				email: Boolean(searchByEmail) && Like(searchByEmail),
			},
			relations: { sharedFiles: true },
			order,

			skip: offset,
			take: limit,
		};

		const count = await this.usersRepository.count(findOptions);
		const users = await this.usersRepository.find(findOptions);

		return { count, users };
	}

	async create(dto: CreateUserDto): Promise<UserEntity> {
		const saltOrRounds = 10;
		const hashedPassword = await bcrypt.hash(dto.password, saltOrRounds);

		const user = await this.usersRepository.save({
			...dto,
			password: hashedPassword,
		});

		const storage = await this.storagesService.createStorage({
			name: 'Storage',
			userId: user.id,
		});

		return user;
	}

	async updateUser({
		userId,
		newEmail,
		newFullName,
	}: UpdateUserDto & { userId: number }): Promise<boolean> {
		const updateResult = await this.usersRepository.update(
			{ id: userId },
			{ email: newEmail, fullName: newFullName }
		);

		if (updateResult.affected === 0) return false;
		return true;
	}

	async deleteUser(userId: number) {
		const deleteResult = await this.usersRepository.delete({ id: userId });

		if (deleteResult.affected === 0) return false;

		return true;
	}
}
