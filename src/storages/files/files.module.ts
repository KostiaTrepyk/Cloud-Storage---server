import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoragesModule } from 'src/storages/storages.module';
import { FavouriteModule } from './favourite/favourite.module';
import { ShareModule } from './share/share.module';
import { UserEntity } from 'src/users/entities/user.entity';
import { FileEntity } from '../entities/file.entity';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity, UserEntity]),
    StoragesModule,
    FavouriteModule,
    ShareModule,
  ],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
