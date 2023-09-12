import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from '../entities/file.entity';
import { ShareService } from './share.service';
import { ShareController } from './share.controller';
import { UserEntity } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity, UserEntity])],
  controllers: [ShareController],
  providers: [ShareService],
})
export class ShareModule {}
