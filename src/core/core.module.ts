import DatabaseClient from '@/core/DatabaseClient';
import { DistributedLockManager } from '@/core/DistributedLockManager';
import { RedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common'; 
import { HealthCheckService, TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthCheckExecutor } from '@nestjs/terminus/dist/health-check/health-check-executor.service';
import { EnvHealthIndicator } from './EnvHealthIndicator';
@Module({
  imports: [
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT, 10),
        password: process.env.REDIS_PASSWORD,
      },
    }),
    TerminusModule, HttpModule
  ],
  providers: [DatabaseClient, DistributedLockManager, EnvHealthIndicator],
  exports: [DatabaseClient, DistributedLockManager, TerminusModule, EnvHealthIndicator],
})
export class CoreModule {}
