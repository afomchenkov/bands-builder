import { createLogger, format, transports } from 'winston';
const { combine, timestamp, label, printf, prettyPrint } = format;

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

const formatter = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const ignorePrivate = format((info, opts) => {
  if (info.private) { return false; }
  return info;
});

const logger = createLogger({
  levels: logLevels,
  format: combine(
    label({ label: 'server' }),
    timestamp(),
    prettyPrint(),
    ignorePrivate(),
  ),
  transports: [
    new transports.Console({}),
    // new transports.File({ filename: 'error.log', level: 'error' }),
    // new transports.File({ filename: 'combined.log' }),
  ],
  exceptionHandlers: [new transports.File({ filename: 'exceptions.log', dirname: 'logs' })],
  rejectionHandlers: [new transports.File({ filename: 'rejections.log', dirname: 'logs' })],
});

export default logger;
