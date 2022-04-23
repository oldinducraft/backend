import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

enum Role {
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
}
