import * as winston from 'winston';
import * as process from 'process';
import * as moment from 'moment-timezone';
import { CloudwatchLoggerAddon } from './CloudwatchLoggerAddon';

const { createLogger, transports } = winston;
const { combine, timestamp, colorize, printf } = winston.format;

export default class Logger {
  private logger: winston.Logger;
  protected now: string;
  private is_production = process.env.NODE_ENV === 'production';

  constructor(
    private readonly subject: string,
    private readonly cloudwatchAddon: CloudwatchLoggerAddon,
  ) {
    this.logger = createLogger({
      level: this.is_production ? 'info' : 'silly',
    });

    this.logger.add(
      new transports.Console({
        format: combine(
          colorize(),
          timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
          }),
          printf((info) => {
            return this.is_production
              ? `[${info.timestamp}] [${process.env.NODE_ENV}] [${info.level}] [${this.subject}] : ${info.message}`
              : `[${info.timestamp}] [${info.level}] [${this.subject}] : ${info.message}`;
          }),
        ),
      }),
    );
  }

  public debug(debugMsg: string, metadata = '') {
    this.logger.debug(debugMsg + '-' + metadata);
  }

  public info(msg: string, metadata = '') {
    this.now = moment().format('YYYY-MM-DD HH:mm:ss');
    this.logger.info(msg + ' - ' + metadata);
    if (this.is_production) {
      const info = {
        timestamp: this.now,
        level: 'info',
        category: this.subject,
        message: msg,
        metadata: metadata,
      };
      this.cloudwatchAddon.sendInfo(info);
    }
  }

  public error(errMsg: Error | string, metadata = '') {
    this.now = moment().format('YYYY-MM-DD HH:mm:ss');
    if (errMsg instanceof Error) {
      const err = errMsg.stack ? errMsg.stack : errMsg.message;
      this.logger.error(
        err + '\n======================================\nmetadata: ' + metadata,
      ); // this will now log the error stack trace
    } else {
      this.logger.error(
        errMsg +
          '\n======================================\nmetadata: ' +
          metadata,
      );
    }
    if (this.is_production) {
      const message = {
        timestamp: this.now,
        level: 'error',
        category: this.subject,
        message: errMsg,
        metadata: metadata,
      };
      this.cloudwatchAddon.sendError(message);
    }
  }

  public warn(warnMsg: string, metadata = '') {
    this.now = moment().format('YYYY-MM-DD HH:mm:ss');
    this.logger.warn(warnMsg);
    if (this.is_production) {
      const message = {
        timestamp: this.now,
        level: 'debug',
        category: this.subject,
        message: warnMsg,
        metadata: metadata,
      };
      this.cloudwatchAddon.sendError(message);
    }
  }
}
