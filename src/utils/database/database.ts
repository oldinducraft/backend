/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/ban-types */
import knex, { Knex } from 'knex';
import * as env from 'env-var';
import {
  DatabaseConfig,
  ExtendedKnex,
  KnexConnection,
} from '../../configs/databaseConfig';
import { Log } from '../logger/logging';
import { promisify } from 'util';

export class Database implements KnexConnection {
  public main!: ExtendedKnex;
  private queryData: {
    [key: string]: {
      method: string;
      sql: string;
      startTime: number;
      finished: boolean;
    };
  } = {};

  private debug: boolean;

  constructor(
    private log: Log,
    private loggingThreshold: DatabaseConfig['loggingThreshold'] | 10_000,
    public readonly QUERY_TIMEOUT: number,
  ) {
    this.log.info({ message: '|database| INIT database' });
    this.QUERY_TIMEOUT = QUERY_TIMEOUT || 5_000;
    const DB_CONFIG = env
      .get('DB_CONFIG')
      .required()
      .asJsonObject() as DatabaseConfig;

    this.debug = DB_CONFIG.debug;

    try {
      const saveLog = (config: DatabaseConfig) =>
        config && {
          ...config,
          password: '***',
        };

      this.log.info({
        message: '|database| creating database connection',
        DB_CONFIG: saveLog(DB_CONFIG),
      });

      this.main = this.createDbConnection(DB_CONFIG) as ExtendedKnex;

      this.logOnThreshold(this.main);
    } catch (error: any) {
      this.log.error({
        message: '|database| creating database connection failed',
        stack: error.stack || '',
      });
    }
  }

  private createDbConnection(config: DatabaseConfig) {
    return knex({
      debug: config.debug,
      client: config.client,
      connection: {
        host: config.host,
        user: config.user,
        port: config.port,
        password: config.password,
        database: config.database,
      },
      pool: {
        min: config.poolMin,
        max: config.poolMax,
        afterCreate: Database.createInitCallback(this.log, this.QUERY_TIMEOUT),
      },
    });
  }

  private logOnThreshold(connection: ExtendedKnex) {
    if (this.debug) {
      this.log.warn({
        message: `|database| Database in debug mode, current slow query threshold -> ${this.loggingThreshold}`,
      });
      connection
        .on('query', this.onQuery)
        .on('query-response', this.checkQuerySpeed);
    }
  }

  //fuck it
  private onQuery(query: any): void {
    const quid = query.__knexQueryUid;
    this.queryData[quid] = {
      method: query.method,
      sql: query.sql,
      startTime: new Date().getTime(),
      finished: false,
    };
  }

  private checkQuerySpeed(query: Knex): void {
    // @ts-ignore
    const quid = query.__knexQueryUid;

    if (!!this.loggingThreshold) {
      if (this.queryData[quid]) {
        const diff = new Date().getTime() - this.queryData[quid].startTime;
        if (diff > this.loggingThreshold) {
          const perfLog = {
            diff,
            method: this.queryData[quid].method,
            sql: this.queryData[quid].sql,
            // @ts-ignore
            bindings: query.bindings,
          };

          // warn as, if we don't want to see it, we
          this.log.warn({
            message: `|database||checkQuerySpeed| Slow query`,
            perfLog,
          });
        }

        delete this.queryData[quid];
      }
    }
  }

  static createInitCallback(log: Log, timeout: number) {
    return async (
      connection: Knex.Client & { promise?: Function },
      done: Function,
    ) => {
      try {
        connection.promise = promisify(connection.query);
        await connection.promise(
          `SET SESSION max_execution_time = ${timeout};`,
        );
        const queryTimeout = await connection.promise(
          `SHOW VARIABLES LIKE '%max_execution_time%'`,
        );
        log.info({
          message: `|database||createInitCallback| Timeout is set to -> ${queryTimeout}`,
        });
        return done(undefined, connection);
      } catch (error: any) {
        log.error({
          message: '|database||createInitCallback| go fuck yourself database',
          stack: error.stack || '',
        });
        return done(error, connection);
      }
    };
  }
}
