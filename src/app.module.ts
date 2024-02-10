import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { UsersModule } from './modules/users/users.module';
import { FilesModule } from './modules/files/files.module';
import { AuthModule } from './modules/auth/auth.module';
import { FoldersModule } from './modules/folders/folders.module';
import { StoragesModule } from './modules/storages/storages.module';
import { DatabaseConfig } from './configs/database.config';
import { ShareModule } from './modules/share/share.module';
import { APP_GUARD } from '@nestjs/core';

@Module({
	imports: [
		ConfigModule.forRoot(),
		ThrottlerModule.forRoot([
			{
				ttl: 60000,
				limit: 30,
			},
		]),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useClass: DatabaseConfig,
		}),
		AuthModule,
		UsersModule,
		StoragesModule,
		FoldersModule,
		FilesModule,
		ShareModule,
	],
	providers: [
		DatabaseConfig,
		{ provide: APP_GUARD, useClass: ThrottlerGuard },
	],
})
export class AppModule {}
