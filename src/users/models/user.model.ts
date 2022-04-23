import {User} from '../../database/schemas/users/user.entity';
import {getConnection} from 'typeorm';


export const create = (args: any) => {
	return getConnection()
		.createQueryBuilder()
		.insert()
		.into(User)
		.values(args)
		.execute();
}
