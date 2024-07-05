import chalk from 'chalk';
import moment from 'moment';

const tagList: { [key: string]: string } = {
  SYSLOG: chalk.grey('[SYSLOG]'),
  SYSERR: chalk.red('[SYSERR]'),
  SUCCESS: chalk.green('[SUCCESS]'),
  INFO: chalk.blue('[INFO]'),
  DEBUG: chalk.magenta('[DEBUG]'),
  DATA: chalk.yellow('[DATA]'),
  COMMAND: chalk.white('[CMD]')
};

const longestTagLength = Math.max(...Object.values(tagList).map(t => t.length));
const getTag = (tag: keyof typeof tagList): string => `${tagList[tag]}${' '.repeat(longestTagLength - tagList[tag].length)}:`;
const timestamp = (): string => `${chalk.cyan.bold(`[${moment.utc().format('HH:mm:ss')}]`)}`;

const syslog = (str: string): void => console.info(`${timestamp()} ${getTag('SYSLOG')} ${str}`);
const syserr = (str: string): void => console.error(`${timestamp()} ${getTag('SYSERR')} ${str}`);
const success = (str: string): void => console.log(`${timestamp()} ${getTag('SUCCESS')} ${str}`);
const info = (str: string): void => console.info(`${timestamp()} ${getTag('INFO')} ${str}`);
const debug = (str: string): void => console.log(`${timestamp()} ${getTag('DEBUG')} ${str}`);
const data = (str: string): void => console.log(`${timestamp()} ${getTag('DATA')} ${str}`);

const startLog = (identifier: string): void => console.log(`${timestamp()} ${getTag('DEBUG')} ${chalk.greenBright('[START]')} ${identifier}`);
const endLog = (identifier: string): void => console.log(`${timestamp()} ${getTag('DEBUG')} ${chalk.redBright('[ END ]')} ${identifier}`);

const getExecutionTime = (hrtime: [number, number]): string => {
  const timeSinceHrMs = (
    process.hrtime(hrtime)[0] * 1000
    + hrtime[1] / 1000000
  ).toFixed(2);
  return `${chalk.yellowBright(
    (Number.parseFloat(timeSinceHrMs) / 1000).toFixed(2))
    } seconds (${chalk.yellowBright(timeSinceHrMs)} ms)`;
};

const printErr = (err: unknown): void => {
  if (!(err instanceof Error)) {
    console.error(err);
    return;
  }

  console.error(
    !err.stack
      ? chalk.red(err)
      : err.stack
        .split('\n')
        .map((msg, index) => {
          if (index === 0) {
            return chalk.red(msg);
          }

          const isFailedFunctionCall = index === 1;
          const traceStartIndex = msg.indexOf('(');
          const traceEndIndex = msg.lastIndexOf(')');
          const hasTrace = traceStartIndex !== -1;
          const functionCall = msg.slice(
            msg.indexOf('at') + 3,
            hasTrace ? traceStartIndex - 1 : msg.length
          );
          const trace = msg.slice(traceStartIndex, traceEndIndex + 1);

          return `    ${chalk.grey('at')} ${isFailedFunctionCall
            ? `${chalk.redBright(functionCall)} ${chalk.red.underline(trace)}`
            : `${chalk.greenBright(functionCall)} ${chalk.grey(trace)}`
            }`;
        })
        .join('\n')
  );
};

export {
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
