import { Logger } from 'winston';
import { CustomLogger, LogFormat } from './';
export declare class Log implements CustomLogger {
    log: Logger;
    constructor();
    debug(data: LogFormat): void;
    error(data: LogFormat & {
        stack: string;
    }): void;
    info(data: LogFormat): void;
    private errorStackFormat;
    private serializeArgs;
}
