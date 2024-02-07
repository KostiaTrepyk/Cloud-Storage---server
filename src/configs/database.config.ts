import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { FileEntity } from "src/entities/file.entity";
import { FolderEntity } from 'src/entities/folder.entity';
import { StorageEntity } from 'src/entities/storage.entity';
import { UserEntity } from 'src/entities/user.entity';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
    constructor( private configService: ConfigService){}

    createTypeOrmOptions(connectionName?: string): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
        return {
            type: 'mysql',
            host: this.configService.get<string>('DB.HOST'),
            port: this.configService.get<number>("DB.PORT"),
            username: this.configService.get<string>("DB.USERNAME"),
            password: this.configService.get<string>('DB.PASSWORD'),
            database:this.configService.get<string>('DB.DATABASE'),
            entities: [UserEntity, StorageEntity, FolderEntity, FileEntity],
            synchronize: true,
        }
    }

	
};
