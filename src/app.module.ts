import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as env from 'env-var';
import {UserModule} from './users/user.module';
//
// const DB_CONFIG = env.get('DB_CONFIG').required().asJsonObject() as DatabaseConfiguration;
// const DB_RETRY_DELAY = env.get('DB_RETRY_DELAY').asIntPositive();
// const SYNCHRONIZE = env.get('SYNCHRONIZE').asBool();
// const KEEP_CONNECTION = env.get('KEEP_CONNECTION').asBool();
const KEEP_CONNECTION = process.env

console.log(KEEP_CONNECTION);

interface DatabaseConfiguration {
  client: string;
  host: string;
  port: number;
  user: string;
  database: string;
  password?: string;
  dbtype: "mysql" | "mariadb" | "postgres";
}

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'old_home',
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: true,
      retryDelay: 10000,
      autoLoadEntities: true,
      keepConnectionAlive: true,
    }),
    UserModule,
  ],
})
export class AppModule {}
