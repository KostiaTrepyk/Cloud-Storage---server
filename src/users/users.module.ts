import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserEntity } from './entities/user.entity';
import { FilesModule } from 'src/files/files.module';
import { StoragesModule } from 'src/storages/storages.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), StoragesModule, FilesModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
