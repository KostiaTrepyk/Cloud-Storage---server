import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
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

  async getUserData(userId: number) {
    const user = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
    });

    return user;
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

      /* Pagination */
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

    const user = this.usersRepository.save({
      ...dto,
      password: hashedPassword,
    });

    return user;
  }
}
