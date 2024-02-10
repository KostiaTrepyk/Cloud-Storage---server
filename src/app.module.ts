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
import { ThrottlerConfig } from './configs/throttler.config';

@Module({
	imports: [
		ConfigModule.forRoot(),
		ThrottlerModule.forRootAsync({
			useClass: ThrottlerConfig,
		}),
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
