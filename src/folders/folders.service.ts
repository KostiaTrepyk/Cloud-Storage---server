import { Injectable } from '@nestjs/common';
import { FolderEntity } from './entities/folder.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FoldersService {
  constructor(
    @InjectRepository(FolderEntity)
    private foldersRepository: Repository<FolderEntity>,
  ) {}

  getFolders() {}

  createFolder() {}

  updateFolder() {}

  deleteFolder() {}
}
