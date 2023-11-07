import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsSelect,
  Not,
  Repository,
} from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { FileEntity } from 'src/files/entities/file.entity';
import { GetAllUsersDto } from './dto/get-all-users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(FileEntity)
    private filesRepository: Repository<FileEntity>,
  ) {}

  /** FIX */
  async findByEmail(
    email: string,
    select?: FindOptionsSelect<UserEntity>,
  ): Promise<UserEntity> {
    return await this.usersRepository.findOne({
      where: {
        email,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        createdAt: true,
        files: true,
        sharedFiles: true,
        password: false,
        ...select,
      },
    });
  }

  /** FIX */
  async findById(
    userId: number,
    select?: FindOptionsSelect<UserEntity>,
  ): Promise<UserEntity> {
    return await this.usersRepository.findOne({
      where: {
        id: userId,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        createdAt: true,
        files: true,
        sharedFiles: true,
        password: false,
        ...select,
      },
    });
  }

  async getStatistic(userId: number) {
    const user = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
    });

    const filesCount = await this.filesRepository.count({
      where: {
        owner: { id: userId },
      },
    });

    const averageFileSize = await this.filesRepository.average('size', {
      owner: { id: userId },
    });

    const totalFileSize = await this.filesRepository.sum('size', {
      owner: { id: userId },
    });

    return {
      user,
      filesCount,
      averageFileSize,
      totalFileSize,
    };
  }

  async getAllUsers({
    userId,
    page = 1,
    limit = 15,
    searchByEmail,
    orderBy,
    orderValue,
  }: GetAllUsersDto & { userId: number }) {
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
        email: searchByEmail,
      },
      relations: { sharedFiles: true },
      order,

      /* Pagination */
      skip: (page - 1) * limit,
      take: limit,
    };

    const count = await this.usersRepository.count(findOptions);
    const users = await this.usersRepository.find(findOptions);
    const isLastPage = count - page * limit <= 0;

    return { page, count, isLastPage, users };
  }

  async create(dto: CreateUserDto): Promise<UserEntity> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(dto.password, saltOrRounds);

    const user = this.usersRepository.save({
      ...dto,
      password: hashedPassword,
    });

    return user;
  }
}
