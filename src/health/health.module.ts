import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';
import { EnvHealthIndicator } from './env.health';

@Module({
  imports: [TerminusModule, HttpModule],
  providers: [EnvHealthIndicator],
  controllers: [HealthController],
})
export class HealthModule {}
