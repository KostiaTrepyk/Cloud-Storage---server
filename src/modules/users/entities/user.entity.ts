import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FileEntity } from 'src/modules/storages/entities/file.entity';
import { FolderEntity } from 'src/modules/storages/entities/folder.entity';
import { StorageEntity } from 'src/modules/storages/entities/storage.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => StorageEntity, (storage) => storage.owner)
  storages: StorageEntity[];

  @OneToMany(() => FolderEntity, (folder) => folder.owner)
  folders: FolderEntity[];

  @OneToMany(() => FileEntity, (file) => file.owner)
  files: FileEntity[];

  @ManyToMany(() => FileEntity, (file) => file.sharedWith, {
    onDelete: 'CASCADE',
  })
  sharedFiles: FileEntity[];
}
