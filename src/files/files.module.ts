import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { FileEntity } from './entities/file.entity';
import { FavouriteModule } from './favourite/favourite.module';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity]), FavouriteModule],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
