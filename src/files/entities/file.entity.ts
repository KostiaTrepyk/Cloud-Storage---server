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
import { UserEntity } from 'src/users/entities/user.entity';
import { FolderEntity } from 'src/folders/entities/folder.entity';

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
    onDelete: 'CASCADE',
  })
  folder: FolderEntity;

  @ManyToOne(() => UserEntity, (user) => user.files, { onDelete: 'CASCADE' })
  owner: UserEntity;
}
