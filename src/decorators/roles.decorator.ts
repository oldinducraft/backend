import { SetMetadata } from '@nestjs/common';
import { Role } from '../database/schemas/users/roles.entity';
export const ROLE_KEY = 'roles'

export const Roles = (...args: Role[]) => SetMetadata(ROLE_KEY, args);
