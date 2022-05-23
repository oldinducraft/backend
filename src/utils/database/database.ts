import knex from 'knex';
// import { Log } from '../logger/logging';

// const log: Log = new Log();

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
