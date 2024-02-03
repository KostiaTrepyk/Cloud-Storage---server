import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoragesModule } from 'src/modules/storages/storages.module';
import { FavouriteModule } from '../../storages/files/favourite/favourite.module';
import { ShareModule } from '../../storages/files/share/share.module';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { FileEntity } from '../storages/entities/file.entity';
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
