import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileEntity } from '../entities/file.entity';
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
      where: { isFavourite: true, user: { id: userId } },
    });

    const files = await this.fileRepository.find({
      where: { isFavourite: true, user: { id: userId } },
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
        user: { id: userId },
      },
    });

    if (totalFavouriteFiles >= 25) {
      throw new HttpException(
        'You can not have more that 25 favourite files.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.fileRepository.update(
      { id: fileId },
      {
        isFavourite: true,
        user: { id: userId },
      },
    );
  }

  async removeFromFavourite(
    userId: number,
    { fileId }: RemoveFromFavouriteDto,
  ) {
    return await this.fileRepository.update(
      { id: fileId },
      {
        isFavourite: false,
        user: { id: userId },
      },
    );
  }
}
