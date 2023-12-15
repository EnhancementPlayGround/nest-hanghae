import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { EnvHealthIndicator } from './env.health';

@Module({
  imports: [TerminusModule, HttpModule],
  providers: [EnvHealthIndicator],
  exports: [EnvHealthIndicator, TerminusModule]
})
export class HealthModule {}
