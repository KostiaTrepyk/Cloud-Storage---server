import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';
import { UserEntity } from './users/entities/user.entity';
import { FileEntity } from './files/entities/file.entity';
import { AuthModule } from './auth/auth.module';
import { FoldersModule } from './folders/folders.module';
import { FolderEntity } from './folders/entities/folder.entity';
import { StoragesModule } from './storages/storages.module';
import { StorageEntity } from './storages/entities/storage.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5000,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [UserEntity, StorageEntity, FolderEntity, FileEntity],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    StoragesModule,
    FoldersModule,
    FilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
