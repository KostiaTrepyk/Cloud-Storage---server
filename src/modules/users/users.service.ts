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
import { UserEntity } from '../../entities/user.entity';
import { GetAllUsersDto } from './dto/get-all-users.dto';
import { FilesService } from 'src/modules/files/files.service';
import { FilesStatistic } from 'src/modules/files/types/FilesStatistic';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserType } from 'src/decorators/user.decorator';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UserEntity)
		private usersRepository: Repository<UserEntity>,
		private filesService: FilesService
	) {}
	/** Fix me */
	async findByEmail(
		email: string,
		select?: FindOptionsSelect<UserEntity>
	): Promise<UserEntity> {
		return await this.usersRepository.findOne({
			where: { email },
			select: {
				id: true,
				fullName: true,
				email: true,
				createdAt: true,
				...select,
			},
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
		user: UserType
	): Promise<{ user: UserEntity; statistic: FilesStatistic }> {
		return {
			user: await this.getUserData(user.id),
			statistic: await this.filesService.getStatistic(user),
		};
	}

	async getAllUsers(
		user: UserType,
		{
			offset = 0,
			limit = 15,
			searchByEmail = '',
			orderBy,
			orderValue,
		}: GetAllUsersDto
	): Promise<{
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
				id: Not(user.id),
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

		return user;
	}

	async updateUser(
		user: UserType,
		{ newEmail, newFullName }: UpdateUserDto
	): Promise<boolean> {
		const updateResult = await this.usersRepository.update(
			{ id: user.id },
			{ email: newEmail, fullName: newFullName }
		);

		if (updateResult.affected === 0) return false;
		return true;
	}

	async deleteUser(user: UserType) {
		const deleteResult = await this.usersRepository.delete({ id: user.id });

		if (deleteResult.affected === 0) return false;

		return true;
	}
}
