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

	@Column()
	email: string;

	@Column()
	nickname: string;

	@Column({ default: true })
	isActive: boolean;

	@Column()
	password: string;

	@ManyToOne((type) => Roles, (role) => role.users)
	role: Roles;

	@CreateDateColumn()
	createdDate: Date;

	@UpdateDateColumn()
	updatedDate: Date;
}
