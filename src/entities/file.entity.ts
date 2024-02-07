import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { FolderEntity } from 'src/entities/folder.entity';
import { StorageEntity } from 'src/entities/storage.entity';

@Entity({ name: 'files' })
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  originalname: string;

  @Column()
  size: number;

  @Column()
  mimetype: string;

  @Column({ default: false })
  isFavourite: boolean;

  @ManyToMany(() => UserEntity, (user) => user.sharedFiles, {
    cascade: true,
  })
  @JoinTable()
  sharedWith: UserEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => FolderEntity, (folder) => folder.files, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  parent: FolderEntity;

  @ManyToOne(() => StorageEntity, (storage) => storage.files, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  storage: StorageEntity;

  @ManyToOne(() => UserEntity, (user) => user.files, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  owner: UserEntity;
}
