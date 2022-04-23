import {
	Column,
	CreateDateColumn,
	Entity, ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Roles } from './roles.entity';


@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	email: string;

	@Column({ unique: true })
	username: string;

	@Column({ default: true })
	isActive: boolean;

	@Column()
	password: string;

	@Column()
	dateOfBerth: Date;

	@ManyToOne((type) => Roles, (role) => role.users)
	role: Roles;

	@CreateDateColumn()
	createdDate: Date;

	@UpdateDateColumn()
	updatedDate: Date;
}
