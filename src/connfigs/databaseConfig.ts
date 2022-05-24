import knex, { Knex } from 'knex';

export interface DatabaseConfig {
  client: string;
  host: string;
  port: number;
  user: string;
  database: string;
  password?: string;
  poolMin?: number;
  poolMax?: number;
  logSlowQueries?: boolean;
  dbPerformanceLoggingThreshold: number;
  debug?: boolean;
}

knex.QueryBuilder.extend('QueryOptimization', function (queryComment: string) {
  this.select(this.client.raw(`/*+ ${queryComment} */ 1`));
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore accessing private prop
  this._statements.reverse();
  return this;
});

knex.QueryBuilder.extend('QueryTimeout', function (timeoutInMs: number) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore not declared in type definition
  return this.hintComment(`MAX_EXECUTION_TIME(${timeoutInMs})`);
});

export interface ExtendedKnex extends Knex {
  QueryBuilder: knex.QueryBuilder & {
    QueryOptimization(queryComment: string): ExtendedKnex['QueryBuilder'];
    QueryTimeout(timeoutInMs: number): ExtendedKnex['QueryBuilder'];
  };
}
