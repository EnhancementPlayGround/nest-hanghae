import { Module } from '@nestjs/common';
import ProductController from './product.controller';
import { HealthController } from './health.controller';
import AccountController from './account.controller';
import OrderController from './order.controller';
import { EnvHealthIndicator } from './indecators/EnvHealthIndicator';

@Module({
  imports: [],
  providers: [EnvHealthIndicator],
  controllers: [
    ProductController,
    HealthController,
    AccountController,
    OrderController,
  ],
})
export class ApisModule {}
