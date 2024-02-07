import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from 'src/entities/file.entity';
import { FolderEntity } from 'src/entities/folder.entity';
import { UserEntity } from 'src/entities/user.entity';
import { ShareController } from './share.controller';
import { ShareService } from './share.service';

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity, FolderEntity, FileEntity])],
	controllers: [ShareController],
	providers: [ShareService],
	exports: [],
})
export class ShareModule {}
