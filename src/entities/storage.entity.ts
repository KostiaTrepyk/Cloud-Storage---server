import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FileEntity } from 'src/entities/file.entity';
import { FolderEntity } from 'src/entities/folder.entity';
import { UserEntity } from 'src/entities/user.entity';

@Entity({ name: 'storages' })
export class StorageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  size: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => FolderEntity, (folder) => folder.storage)
  folders: FolderEntity[];

  @OneToMany(() => FileEntity, (file) => file.storage)
  files: FileEntity[];

  @ManyToOne(() => UserEntity, (user) => user.storages, { onDelete: 'CASCADE' })
  owner: UserEntity;
}
