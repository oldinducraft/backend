import { createLogger, format, Logger, transports } from 'winston';
import { Syslog } from 'winston-syslog';
import * as Transport from 'winston-transport';
// import * as env from 'env-var';

import { CustomLogger, LogArgs, LogFormat } from './';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { name } = require(`${process.cwd()}/package.json`);

let logInstance: Logger;

// const _LOG_DEFAULT_LEVEL: string = env
//   .get('LOG_DEFAULT_LEVEL')
//   .required()
//   .asEnum(['info', 'debug', 'error']);

// const _SYSTEM_LOG: boolean = env.get('SYSTEM_LOG').required().asBool();

const _LOG_DEFAULT_LEVEL = 'info';
const _SYSTEM_LOG = true;

export class Log implements CustomLogger {
  public log!: Logger;

  constructor() {
    if (logInstance) {
      this.log = logInstance;
      this.log.debug('Log instance init');
      return;
    }
    try {
      const logFormat = format.printf(
        (info) =>
          `${info.timestamp} |${info.level}|:-> :${name || 'unknown'}:-> ${
            info.message
          } - ${JSON.stringify(info.metadata)}${
            info.metadata.stack ? `\n${info.metadata.stack}` : ''
          }`,
      );

      const stdFormat = format.combine(
        format.errors({ stack: true }),
        this.errorStackFormat(),
        format.colorize(),
        format.timestamp({
          format: 'ddd MMM DD h:mm:ss',
        }),
        format.metadata({
          fillExcept: [
            'process',
            'os',
            'exception',
            'timestamp',
            'date',
            'level',
            'error',
            'message',
          ],
        }),
        logFormat,
      );

      const sysLogConf = {
        app_name: name,
        facility: 'user',
        protocol: 'unix',
        path: '/dev/log',
      };

      const logTransport: Transport[] = [
        new transports.Console({
          format: stdFormat,
          handleExceptions: true,
          level: _LOG_DEFAULT_LEVEL,
        }),
        ...(_SYSTEM_LOG ? [new Syslog(sysLogConf)] : []),
      ];
      logInstance = createLogger({
        transports: logTransport,
        exitOnError: false,
      });

      this.log = logInstance;
      this.log.debug('|logging.ts||Log| Log instance created');

      this.log.on('error', (e) => {
        console.log(e, '|logging.ts||Log| ERROR');
      });
    } catch (e) {
      throw new Error('|logging.ts||Log| Logger init failed');
    }
  }

  public debug(data: LogFormat): void {
    const logArgs = this.serializeLogInfo(data);
    this.log.debug(logArgs);
  }

  public error(data: LogFormat & { stack: string }): void {
    const logArgs = this.serializeLogInfo(data);
    this.log.error(logArgs);
  }

  public info(data: LogFormat): void {
    const logArgs = this.serializeLogInfo(data);
    this.log.info(logArgs);
  }

  public warn(data: LogFormat): void {
    const logArgs = this.serializeLogInfo(data);
    this.log.warn(logArgs);
  }

  private errorStackFormat = format((info) => {
    if (info.error instanceof Error) {
      return Object.assign({}, info, {
        stack: info.error.stack,
        message: info.error.message,
      });
    }
    return info;
  });

  private serializeLogInfo(args: LogFormat & { stack?: string }): LogArgs {
    const {
      message,
      stack,
      stringify = true,
      addRaw = true,
      ...details
    } = args;
    const normalizeStack = stack && stack.replace(/[\n\r]+/g, ' | ');
    const normalizeDetails = JSON.stringify(details);

    return {
      message,
      stack: normalizeStack,
      details: stringify
        ? normalizeDetails
        : {
            ...details,
            raw:
              !stringify && normalizeDetails.length > 100 && addRaw
                ? normalizeDetails
                : undefined,
          },
    };
  }
}
