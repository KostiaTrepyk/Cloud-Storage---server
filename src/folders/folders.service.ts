import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FolderEntity } from './entities/folder.entity';
import { CreateFolderDto } from './dto/create-folder.dto';

@Injectable()
export class FoldersService {
  constructor(
    @InjectRepository(FolderEntity)
    private foldersRepository: Repository<FolderEntity>,
  ) {}

  async getFolders() {}

  async createFolder({
    userId,
    folderName,
  }: CreateFolderDto & { userId: number }): Promise<FolderEntity> {
    const createdFolder = this.foldersRepository.create({
      name: folderName,
      owner: { id: userId },
    });

    return await this.foldersRepository.save(createdFolder);
  }

  async updateFolder() {}

  async deleteFolder() {}
}
