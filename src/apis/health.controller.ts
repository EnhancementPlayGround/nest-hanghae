import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck } from '@nestjs/terminus';
import { EnvHealthIndicator } from '../health/env.health';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private env: EnvHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([() => this.env.isHealthy()]);
  }
}
