import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { FilesModule } from './modules/files/files.module';
import { AuthModule } from './modules/auth/auth.module';
import { FoldersModule } from './modules/folders/folders.module';
import { StoragesModule } from './modules/storages/storages.module';
import { DatabaseConfig } from './configs/database.config';

@Module({
	imports: [
		ConfigModule.forRoot(),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useClass: DatabaseConfig,
		}),
		AuthModule,
		UsersModule,
		StoragesModule,
		FoldersModule,
		FilesModule,
	],
	controllers: [],
	providers: [DatabaseConfig],
})
export class AppModule {}
