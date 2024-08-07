"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const moment_1 = __importDefault(require("moment"));
const tagList = {
    SYSLOG: chalk_1.default.grey('[SYSLOG]'),
    SYSERR: chalk_1.default.red('[SYSERR]'),
    SUCCESS: chalk_1.default.green('[SUCCESS]'),
    INFO: chalk_1.default.blue('[INFO]'),
    DEBUG: chalk_1.default.magenta('[DEBUG]'),
    DATA: chalk_1.default.yellow('[DATA]'),
    COMMAND: chalk_1.default.white('[CMD]')
};
const longestTagLength = Math.max(...Object.values(tagList).map(t => t.length));
const getTag = (tag) => `${tagList[tag]}${' '.repeat(longestTagLength - tagList[tag].length)}:`;
const timestamp = () => `${chalk_1.default.cyan.bold(`[${moment_1.default.utc().format('HH:mm:ss')}]`)}`;
const syslog = (str) => console.info(`${timestamp()} ${getTag('SYSLOG')} ${str}`);
const syserr = (str) => console.error(`${timestamp()} ${getTag('SYSERR')} ${str}`);
const success = (str) => console.log(`${timestamp()} ${getTag('SUCCESS')} ${str}`);
const info = (str) => console.info(`${timestamp()} ${getTag('INFO')} ${str}`);
const debug = (str) => console.log(`${timestamp()} ${getTag('DEBUG')} ${str}`);
const data = (str) => console.log(`${timestamp()} ${getTag('DATA')} ${str}`);
const startLog = (identifier) => console.log(`${timestamp()} ${getTag('DEBUG')} ${chalk_1.default.greenBright('[START]')} ${identifier}`);
const endLog = (identifier) => console.log(`${timestamp()} ${getTag('DEBUG')} ${chalk_1.default.redBright('[ END ]')} ${identifier}`);
const getExecutionTime = (hrtime) => {
    const timeSinceHrMs = (process.hrtime(hrtime)[0] * 1000
        + hrtime[1] / 1000000).toFixed(2);
    return `${chalk_1.default.yellowBright((Number.parseFloat(timeSinceHrMs) / 1000).toFixed(2))} seconds (${chalk_1.default.yellowBright(timeSinceHrMs)} ms)`;
};
const printErr = (err) => {
    if (!(err instanceof Error)) {
        console.error(err);
        return;
    }
    console.error(!err.stack
        ? chalk_1.default.red(err)
        : err.stack
            .split('\n')
            .map((msg, index) => {
            if (index === 0) {
                return chalk_1.default.red(msg);
            }
            const isFailedFunctionCall = index === 1;
            const traceStartIndex = msg.indexOf('(');
            const traceEndIndex = msg.lastIndexOf(')');
            const hasTrace = traceStartIndex !== -1;
            const functionCall = msg.slice(msg.indexOf('at') + 3, hasTrace ? traceStartIndex - 1 : msg.length);
            const trace = msg.slice(traceStartIndex, traceEndIndex + 1);
            return `    ${chalk_1.default.grey('at')} ${isFailedFunctionCall
                ? `${chalk_1.default.redBright(functionCall)} ${chalk_1.default.red.underline(trace)}`
                : `${chalk_1.default.greenBright(functionCall)} ${chalk_1.default.grey(trace)}`}`;
        })
            .join('\n'));
};
const logger = {
    syslog,
    syserr,
    success,
    info,
    debug,
    data,
    startLog,
    endLog,
    timestamp,
    getExecutionTime,
    printErr
};
exports.default = logger;
