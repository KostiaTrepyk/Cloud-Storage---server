import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FileEntity } from 'src/files/entities/file.entity';
import { UserEntity } from 'src/users/entities/user.entity';

@Entity()
export class FolderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => FileEntity, (file) => file.folder)
  files: FileEntity[];

  @ManyToOne(() => UserEntity, (user) => user.folders)
  owner: UserEntity;
}
