import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as env from 'env-var';

const DB_CONFIG = env.get('DB_CONFIG').required().asJsonObject() as DatabaseConfiguration;
const DB_RETRY_DELAY = env.get('DB_RETRY_DELAY').required().asIntPositive();
const SYNCHRONIZE = env.get('SYNCHRONIZE').required().asBool();
const KEEP_CONNECTION = env.get('KEEP_CONNECTION').required().asBool();

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
      type: DB_CONFIG.dbtype || 'mysql',
      host: DB_CONFIG.host || 'localhost',
      port: DB_CONFIG.port || 3306,
      username: DB_CONFIG.user ||  'root',
      password: DB_CONFIG.password ||  'root',
      database: DB_CONFIG.database ||  'test',
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: SYNCHRONIZE || true,
      retryDelay: DB_RETRY_DELAY || 10000,
      autoLoadEntities: true,
      keepConnectionAlive: KEEP_CONNECTION || true,
    }),
  ],
})
export class AppModule {}
