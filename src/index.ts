import express from 'express';
import { Log } from './utils/logger/logging';
import * as env from 'env-var';
const log: Log = new Log();
//TODO get from env var
const httpPort = env.get('PORT').asIntPositive() || 4000;

//TODO set aup dotenv config
class App {
  public express: express.Application;

  constructor(
    private log: Log,
    private options: { socket: boolean; http: boolean; client: boolean },
  ) {
    this.express = express();
    this.options = options;
  }

  // private mountDB() {}

  public startServer(): any {
    if (!!this.options.http) {
      this.log.info({ message: `test log http` });
    }

    if (!!this.options.socket) {
      this.log.info({ message: `test log socket` });
    }

    if (!!this.options.client) {
      this.log.info({ message: `test log client` });
    }

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
}

const app = new App(log, { socket: false, http: true, client: false });

app.startServer();
