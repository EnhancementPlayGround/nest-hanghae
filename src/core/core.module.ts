import DatabaseClient from '@/core/DatabaseClient';
import { DistributedLockManager } from '@/core/distributed-lock/DistributedLockManager';
import { RedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { EnvHealthIndicator } from './health/EnvHealthIndicator';
import { DistributedLockDecorator } from './distributed-lock/DistributedLockInterceptor';
import { DiscoveryModule } from '@nestjs/core';
import { CloudwatchLoggerAddon } from './logger/CloudwatchLoggerAddon';
import { CloudWatchLogsClient } from '@aws-sdk/client-cloudwatch-logs';
import Logger from './logger/Logger';
import AnalyticsManager from './external-apis/AnalyticsManager';

@Module({
  imports: [
    DiscoveryModule,
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT, 10),
        password: process.env.REDIS_PASSWORD,
      },
    }),
    TerminusModule,
    HttpModule,
  ],
  providers: [
    {
      provide: DatabaseClient,
      useFactory: (logger: Logger) => {
        return new DatabaseClient(logger);
      },
      inject: [Logger],
    },
    DistributedLockManager,
    EnvHealthIndicator,
    DistributedLockDecorator,
    {
      provide: CloudwatchLoggerAddon,
      useFactory: () => {
        const cloudWatchClient = new CloudWatchLogsClient({
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          },
          region: process.env.CLOUDWATCH_REGION,
        });
        const cloudwatchConfig = {
          groupName: process.env.CLOUDWATCH_GROUP,
          stream_info: process.env.CLOUDWATCH_STREAM_INFO,
          stream_error: process.env.CLOUDWATCH_STREAM_ERROR,
        };
        return new CloudwatchLoggerAddon(cloudWatchClient, cloudwatchConfig);
      },
      inject: [],
    },
    Logger,
    AnalyticsManager
  ],
  exports: [
    DatabaseClient,
    DistributedLockManager,
    TerminusModule,
    EnvHealthIndicator,
    DistributedLockDecorator,
    Logger,
    AnalyticsManager
  ],
})
export class CoreModule {}
