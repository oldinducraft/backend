import { Injectable } from '@nestjs/common';
import { CreateUserArgs } from '../interfaces/user/user.interface';


//TODO create folder with interfaces for responses and ARGS

@Injectable()
export class UserService {
	constructor() {}

	async create(data: CreateUserArgs) {

	}
}
