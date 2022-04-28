"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const env = __importStar(require("env-var"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { name } = require(`${process.cwd()}/package.json`);
let logInstance;
const _LOG_DEFAULT_LEVEL = env
    .get('LOG_DEFAULT_LEVEL')
    .required()
    .asEnum(['info', 'debug', 'error']);
const _SYSTEM_LOG = env.get('SYSTEM_LOG').required().asBool();
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
            const logFormat = winston_1.format.printf((info) => `${info.timestamp.gray} :${name || 'unknown'}:-> |${info.level} ${info.oc.green} |:-> ${info.message} - ${JSON.stringify(info.metadata)}${info.metadata.stack ? `\n${info.metadata.stack}` : ''}`);
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