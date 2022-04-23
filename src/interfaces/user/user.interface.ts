import * as joi from '@hapi/joi';
import 'joi-extract-type'

export const createUserArgs = joi.object({
	username: joi.string().required(),
	password: joi.string().required(),
	dateOfBerth: joi.date().required(),
	email: joi.string().required(),
})

export type CreateUserArgs = joi.extractType<typeof createUserArgs>
