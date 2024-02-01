import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from '../../entities/file.entity';
import { FavouriteController } from './favourite.controller';
import { FavouriteService } from './favourite.service';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  controllers: [FavouriteController],
  providers: [FavouriteService],
})
export class FavouriteModule {}
