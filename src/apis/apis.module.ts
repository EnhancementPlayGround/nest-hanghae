import { Module } from '@nestjs/common';
import ProductController from './product.controller';
import { HealthController } from './health.controller';
import { HealthModule } from '@/health/health.module';
import AccountController from './account.controller';
import OrderController from './order.controller';

@Module({
  imports: [HealthModule],
  controllers: [
    ProductController,
    HealthController,
    AccountController,
    OrderController,
  ],
})
export class ApisModule {}
