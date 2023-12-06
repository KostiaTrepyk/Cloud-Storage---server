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

@Entity()
export class FolderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  /* root === 0 */
  @Column()
  parrentFolderId?: number;

  @OneToMany(() => FileEntity, (file) => file.folder)
  items: (FileEntity | FolderEntity)[];

  @ManyToOne(() => UserEntity, (user) => user.folders, { onDelete: 'CASCADE' })
  owner: UserEntity;
}
