import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileEntity } from 'src/files/entities/file.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(FileEntity)
    private filesRepository: Repository<FileEntity>,
  ) {}

  async findByEmail(email: string) {
    return this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }

  async findById(userId: number) {
    return this.usersRepository.findOne({
      where: {
        id: userId,
      },
    });
  }

  async getStatistic(userId: number) {
    const thisUser = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
    });

    const { password, ...user } = thisUser;

    const filesCount = await this.filesRepository.count({
      where: {
        user: thisUser,
      },
    });
    const averageFileSize = await this.filesRepository.average('size', {
      user: thisUser,
    });
    const totalFileSize = await this.filesRepository.sum('size', {
      user: thisUser,
    });

    return {
      user,
      filesCount,
      averageFileSize,
      totalFileSize,
    };
  }

  async create(dto: CreateUserDto) {
    return this.usersRepository.save(dto);
  }
}
