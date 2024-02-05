import { Module } from "@nestjs/common";
import { StoragesHelper } from "./storages.helper";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StorageEntity } from '../entities/storage.entity';

@Module({
	imports: [TypeOrmModule.forFeature([StorageEntity])],
	providers: [StoragesHelper],
	exports: [StoragesHelper],
})
export class StorageHelpersModule {}