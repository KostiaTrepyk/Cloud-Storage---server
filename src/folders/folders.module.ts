import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoldersController } from './folders.controller';
import { FoldersService } from './folders.service';
import { FolderEntity } from './entities/folder.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FolderEntity])],
  controllers: [FoldersController],
  providers: [FoldersService],
})
export class FoldersModule {}
