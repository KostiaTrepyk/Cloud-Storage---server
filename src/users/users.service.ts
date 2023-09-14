import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsSelect, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { FileEntity } from 'src/files/entities/file.entity';

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
        user: { id: userId },
      },
    });

    const averageFileSize = await this.filesRepository.average('size', {
      user: { id: userId },
    });

    const totalFileSize = await this.filesRepository.sum('size', {
      user: { id: userId },
    });

    return {
      user,
      filesCount,
      averageFileSize,
      totalFileSize,
    };
  }

  /** Returns user with password!!! */
  async create(dto: CreateUserDto): Promise<UserEntity> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(dto.password, saltOrRounds);
    const user = this.usersRepository.create({
      ...dto,
      password: hashedPassword,
    });

    return await this.usersRepository.save(user);
  }
}
