import { Injectable } from '@nestjs/common';
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

  async findAll(): Promise<FileEntity[]> {
    return await this.fileRepository.find({ where: { isFavourite: true } });
  }

  async addToFavourite({ fileId }: AddToFavouriteDto) {
    return await this.fileRepository.update(
      { id: fileId },
      {
        isFavourite: true,
      },
    );
  }

  async removeFromFavourite({ fileId }: RemoveFromFavouriteDto) {
    return await this.fileRepository.update(
      { id: fileId },
      {
        isFavourite: false,
      },
    );
  }
}
