import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { FileEntity } from './entities/file.entity';
import { FavouriteModule } from './favourite/favourite.module';
import { ShareModule } from './share/share.module';
import { UserEntity } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity, UserEntity]),
    FavouriteModule,
    ShareModule,
  ],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService]
})
export class FilesModule {}
