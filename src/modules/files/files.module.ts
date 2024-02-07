import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from '../../entities/file.entity';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { StorageHelpersModule } from '../storages/helpers/storages.helper.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([FileEntity]),
		StorageHelpersModule,
	],
	controllers: [FilesController],
	providers: [FilesService],
	exports: [FilesService],
})
export class FilesModule {}
