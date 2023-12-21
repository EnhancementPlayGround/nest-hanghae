import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { ConfigModule } from '@nestjs/config';
import { ApisModule } from './apis/apis.module';
import { ShareModule } from './share/share.module';

@Module({
  imports: [
    HealthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ApisModule,
    ShareModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
