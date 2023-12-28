import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FileEntity } from 'src/files/entities/file.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { StorageEntity } from 'src/storages/entities/storage.entity';

@Entity()
export class FolderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => FolderEntity, (folder) => folder.parent)
  folders: FolderEntity[]; // Use FolderEntity[] to represent a collection of child folders

  @ManyToOne(() => FolderEntity, (parent) => parent.folders, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  parent: FolderEntity; // Reference to the parent folder

  @OneToMany(() => FileEntity, (file) => file.parent)
  files: FileEntity[];

  @ManyToOne(() => StorageEntity, (storage) => storage.folders, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  storage: StorageEntity;

  @ManyToOne(() => UserEntity, (user) => user.folders, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  owner: UserEntity;
}
