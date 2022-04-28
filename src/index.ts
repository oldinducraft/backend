import express, { Express } from 'express';
import { Log } from './utils/logger/logging';

const log = new Log();

const port = 3000;
const app: Express = express();

app.listen(port, () => {
  log.info({ message: 'LOG TEST' });
});
