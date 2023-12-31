import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class LoggingExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(LoggingExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const logFormat = `Request URL: ${request.url}, Method: ${request.method}, Status Code: ${status}, Error: ${exception}`;

    this.logger.error(logFormat);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error:
        exception instanceof HttpException
          ? exception.getResponse()
          : 'Internal Server Error',
    });
  }
}
