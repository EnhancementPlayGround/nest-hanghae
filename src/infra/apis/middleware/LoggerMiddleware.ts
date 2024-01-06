import Logger from '@/core/logger/Logger';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: Logger) {}

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.info(`Request URL: ${req.originalUrl}`);

    if (Object.keys(req.body).length) {
      this.logger.info(`Request Body: ${JSON.stringify(req.body)}`);
    }
    if (Object.keys(req.query).length) {
      this.logger.info(`Query Parameters: ${JSON.stringify(req.query)}`);
    }
    if (Object.keys(req.params).length) {
      this.logger.info(`Route Parameters: ${JSON.stringify(req.params)}`);
    }

    const oldWrite = res.write;
    const oldEnd = res.end;
    const chunks: Buffer[] = [];

    res.write = function (chunk: any) {
      chunks.push(Buffer.from(chunk));
      return oldWrite.apply(res, arguments as any);
    };

    res.end = function (chunk: any) {
      if (chunk) {
        chunks.push(Buffer.from(chunk));
      }
      const responseBody = Buffer.concat(chunks).toString('utf8');
      this.logger.info(`Response Body: ${responseBody}`);

      return oldEnd.apply(res, arguments as any);
    };

    next();
  }
}
