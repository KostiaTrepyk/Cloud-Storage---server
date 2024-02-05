import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoragesModule } from 'src/modules/storages/storages.module';
import { FavouriteModule } from '../../storages/files/favourite/favourite.module';
import { ShareModule } from '../../storages/files/share/share.module';
import { FileEntity } from '../storages/entities/file.entity';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { StorageHelpersModule } from '../storages/helpers/storages.helper.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([FileEntity]),
		StorageHelpersModule,
		FavouriteModule,
		ShareModule,
	],
	controllers: [FilesController],
	providers: [FilesService],
	exports: [FilesService],
})
export class FilesModule {}
