"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
const winston_1 = require("winston");
const winston_syslog_1 = require("winston-syslog");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { name } = require(`${process.cwd()}/package.json`);
let logInstance;
// const _LOG_DEFAULT_LEVEL: string = env
//   .get('LOG_DEFAULT_LEVEL')
//   .required()
//   .asEnum(['info', 'debug', 'error']);
// const _SYSTEM_LOG: boolean = env.get('SYSTEM_LOG').required().asBool();
const _LOG_DEFAULT_LEVEL = 'info';
const _SYSTEM_LOG = true;
class Log {
    constructor() {
        this.errorStackFormat = (0, winston_1.format)((info) => {
            if (info.error instanceof Error) {
                return Object.assign({}, info, {
                    stack: info.error.stack,
                    message: info.error.message,
                });
            }
            return info;
        });
        if (logInstance) {
            this.log = logInstance;
            this.log.debug('Log instance init');
            return;
        }
        try {
            const logFormat = winston_1.format.printf((info) => `${info.timestamp.gray} :${name || 'unknown'}:-> |${info.level} ${info.oc} |:-> ${info.message} - ${JSON.stringify(info.metadata)}${info.metadata.stack ? `\n${info.metadata.stack}` : ''}`);
            const stdFormat = winston_1.format.combine(winston_1.format.errors({ stack: true }), this.errorStackFormat(), winston_1.format.colorize(), winston_1.format.timestamp({
                format: 'ddd MMM DD h:mm:ss',
            }), winston_1.format.metadata({
                fillExcept: [
                    'message',
                    'level',
                    'timestamp',
                    'error',
                    'process',
                    'os',
                    'exception',
                    'date',
                ],
            }), logFormat);
            const sysLogConf = {
                app_name: name,
                facility: 'user',
                protocol: 'unix',
                path: '/dev/log',
            };
            const logTransport = [
                new winston_1.transports.Console({
                    format: stdFormat,
                    handleExceptions: true,
                    level: _LOG_DEFAULT_LEVEL,
                }),
                ...(_SYSTEM_LOG ? [new winston_syslog_1.Syslog(sysLogConf)] : []),
            ];
            logInstance = (0, winston_1.createLogger)({
                transports: logTransport,
                exitOnError: false,
            });
            this.log = logInstance;
            this.log.debug('Log instance created');
            this.log.on('error', (e) => {
                console.log(e, '|logging.ts||Log| ERROR');
            });
        }
        catch (e) {
            throw new Error('|logging.ts||Log| Logger init failed');
        }
    }
    debug(data) {
        const logArgs = this.serializeArgs(data);
        this.log.debug(logArgs);
    }
    error(data) {
        const logArgs = this.serializeArgs(data);
        this.log.error(logArgs);
    }
    info(data) {
        const logArgs = this.serializeArgs(data);
        this.log.info(logArgs);
    }
    serializeArgs(args) {
        const { message, stack, stringify = true, addRaw = true } = args, details = __rest(args, ["message", "stack", "stringify", "addRaw"]);
        const normalizeStack = stack && stack.replace(/[\n\r]+/g, ' | ');
        const normalizeDetails = JSON.stringify(details);
        return {
            message,
            stack: normalizeStack,
            details: stringify
                ? normalizeDetails
                : Object.assign(Object.assign({}, details), { raw: !stringify && normalizeDetails.length > 100 && addRaw
                        ? normalizeDetails
                        : undefined }),
        };
    }
}
exports.Log = Log;
//# sourceMappingURL=logging.js.map