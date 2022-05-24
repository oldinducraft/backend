import express from 'express';
import { Log } from './utils/logger/logging';
import * as env from 'env-var';
import { Database } from './utils/database/database';
const log: Log = new Log();
//TODO get from env var
const httpPort = env.get('PORT').asIntPositive() || 3333;

//TODO set aup dotenv config
class App {
  public express: express.Application;
  private connectDatabase: Database;

  constructor(
    private log: Log,
    private options: { socket: boolean; http: boolean; client: boolean },
  ) {
    this.express = express();
    this.options = options;

    const database = new Database(this.log, 5_000, 30_000);
    this.connectDatabase = database;
  }

  public db(tableName: string) {
    return this.connectDatabase.main(tableName);
  }

  public startServer(): any {
    if (!!this.options.http) {
      this.express
        .listen(httpPort, () => {
          this.log.info({ message: `Started on port :${httpPort}` });
        })
        .on('error', (error: Error) => {
          this.log.error({
            message: 'Start up failed',
            stack: error.stack || '',
          });
        });
    }

    if (!!this.options.socket) {
      this.log.info({ message: `test log socket` });
    }

    if (!!this.options.client) {
      this.log.info({ message: `test log client` });
    }
  }
}

const app = new App(log, { socket: false, http: true, client: false });

app.startServer();
