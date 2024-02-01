import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesModule } from '../files/files.module';
import { FolderEntity } from '../entities/folder.entity';
import { FoldersController } from './folders.controller';
import { FoldersService } from './folders.service';

@Module({
  imports: [TypeOrmModule.forFeature([FolderEntity]), FilesModule],
  controllers: [FoldersController],
  providers: [FoldersService],
})
export class FoldersModule {}
