import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageEntity } from './entities/storage.entity';
import { StoragesController } from './storages.controller';
import { StoragesService } from './storages.service';
import { StoragesHelper } from './helpers/storages.helper';

@Module({
	imports: [TypeOrmModule.forFeature([StorageEntity])],
	controllers: [StoragesController],
	providers: [StoragesService, StoragesHelper],
	exports: [StoragesService, StoragesHelper],
})
export class StoragesModule {}
