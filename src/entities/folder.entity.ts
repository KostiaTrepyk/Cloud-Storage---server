import {
	Column,
	CreateDateColumn,
	Entity,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { FileEntity } from 'src/entities/file.entity';
import { UserEntity } from 'src/entities/user.entity';
import { StorageEntity } from 'src/entities/storage.entity';

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

	@ManyToMany(() => UserEntity, (user) => user.sharedFolders, {
		cascade: true,
	})
	@JoinTable()
	sharedWith: UserEntity[];
}
