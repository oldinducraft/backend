import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from '../database/schemas/users/user.entity';
import {UserController} from './user.controller';
import {UserService} from './user.service';

@Module({
  imports: [AuthModule,
  TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
