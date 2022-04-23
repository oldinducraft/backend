import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {User} from './user.entity';

export enum Role {
	Admin = 1,
	Manager = 2,
	User = 3,
	Restricted = 4
}

@Entity()
export class Roles {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	role: Role

	@OneToMany((type) => User, (user) => user.role)
	users: User[]


}
