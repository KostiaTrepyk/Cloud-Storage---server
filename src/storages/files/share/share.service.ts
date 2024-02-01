import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, MoreThan, Repository } from 'typeorm';
import { FileEntity } from '../../entities/file.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { ShareWithDTO } from './dto/shareWith.dto';
import { RemoveFromSharedDto } from './dto/removeFromShared.dto';
import { removeDublicates } from 'helpers/removeDublicates';

@Injectable()
export class ShareService {
  constructor(
    @InjectRepository(FileEntity)
    private filesRepository: Repository<FileEntity>,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async findAllShared(
    userId: number,
  ): Promise<{ files: FileEntity[]; count: number }> {
    const where: FindOptionsWhere<FileEntity> = {
      owner: { id: userId },
      sharedWith: MoreThan(0),
    };

    const count = await this.filesRepository.count({ where });
    const files = await this.filesRepository.find({
      where,
      relations: { sharedWith: true, owner: true },
    });

    return { files, count };
  }

  async share({
    userId,
    fileId,
    shareWith,
  }: { userId: number } & ShareWithDTO) {
    if (shareWith.includes(userId))
      throw new HttpException(
        "You can't share the file with yourself.",
        HttpStatus.BAD_REQUEST,
      );

    const usersToShareWith = await this.usersRepository.find({
      where: { id: In(shareWith) },
    });

    const thisFile = await this.filesRepository.findOne({
      where: { id: fileId, owner: { id: userId } },
      relations: { sharedWith: true, owner: true },
    });

    if (!thisFile)
      throw new HttpException(
        'The file does not exist or cannot be accessed.',
        HttpStatus.BAD_REQUEST,
      );

    thisFile.sharedWith = removeDublicates(
      thisFile.sharedWith,
      usersToShareWith,
    );

    return await this.filesRepository.save(thisFile);
  }

  async removeFromShared({
    userId,
    fileId,
    userIdsToRemove,
  }: { userId: number } & RemoveFromSharedDto) {
    const usersToRemove = await this.usersRepository.find({
      where: { id: In(userIdsToRemove) },
    });

    const thisFile = await this.filesRepository.findOne({
      where: { id: fileId, owner: { id: userId } },
      relations: { sharedWith: true, owner: true },
    });

    if (!thisFile) {
      throw new HttpException(
        'The file does not exist or cannot be accessed',
        HttpStatus.BAD_REQUEST,
      );
    }

    thisFile.sharedWith = thisFile.sharedWith.filter((user) => {
      for (let i = 0; i < usersToRemove.length; i++) {
        if (usersToRemove[i].id === user.id) return false;
      }
      return true;
    });

    return await this.filesRepository.save(thisFile);
  }
}
