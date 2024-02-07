import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageEntity } from '../../entities/storage.entity';
import { StoragesController } from './storages.controller';
import { StoragesService } from './storages.service';
import { StorageHelpersModule } from './helpers/storages.helper.module';

@Module({
	imports: [TypeOrmModule.forFeature([StorageEntity])],
	controllers: [StoragesController],
	providers: [StoragesService],
	exports: [StoragesService],
})
export class StoragesModule {}
