import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileEntity } from '../../../modules/storages/entities/file.entity';
import { AddToFavouriteDto } from './dto/addToFavourite.dto';
import { RemoveFromFavouriteDto } from './dto/removeFromFavourite.dto';

@Injectable()
export class FavouriteService {
  constructor(
    @InjectRepository(FileEntity)
    private fileRepository: Repository<FileEntity>,
  ) {}

  async findAll(
    userId: number,
  ): Promise<{ files: FileEntity[]; count: number }> {
    const count = await this.fileRepository.count({
      where: { isFavourite: true, owner: { id: userId } },
    });

    const files = await this.fileRepository.find({
      where: { isFavourite: true, owner: { id: userId } },
      relations: { sharedWith: true, owner: true },
    });

    return { files, count };
  }

  async addToFavourite(userId: number, { fileId }: AddToFavouriteDto) {
    const thisFile = await this.fileRepository.findOne({
      where: { id: fileId },
    });

    if (thisFile.deletedAt !== null)
      throw new HttpException('This File is deleted.', HttpStatus.BAD_REQUEST);

    const totalFavouriteFiles: number = await this.fileRepository.count({
      where: {
        isFavourite: true,
        owner: { id: userId },
      },
    });

    if (totalFavouriteFiles >= 25) {
      throw new HttpException(
        'You can not have more that 25 favourite files.',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      await this.fileRepository.update(
        { id: fileId },
        {
          isFavourite: true,
          owner: { id: userId },
        },
      );
    } catch (error) {
      return false;
    }

    return true;
  }

  async removeFromFavourite(
    userId: number,
    { fileId }: RemoveFromFavouriteDto,
  ) {
    try {
      await this.fileRepository.update(
        { id: fileId },
        {
          isFavourite: false,
          owner: { id: userId },
        },
      );
    } catch (error) {
      return false;
    }
    return true;
  }
}
