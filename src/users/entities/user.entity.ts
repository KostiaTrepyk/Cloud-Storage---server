import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FileEntity } from 'src/files/entities/file.entity';
import { FolderEntity } from 'src/folders/entities/folder.entity';

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

  @OneToMany(() => FolderEntity, (folder) => folder.owner)
  folders: FolderEntity[];

  @ManyToMany(() => FileEntity, (file) => file.sharedWith)
  sharedFiles: FileEntity[];

  @OneToMany(() => FileEntity, (file) => file.owner)
  files: FileEntity[];
}
