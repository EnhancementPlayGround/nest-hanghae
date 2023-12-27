import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  AccountProviders,
  ControllerProviders,
  OrderProviders,
  ProductProviders,
} from './Providers';
import { CoreModule } from './core/core.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CoreModule,
  ],
  controllers: [...ControllerProviders],
  providers: [...AccountProviders, ...ProductProviders, ...OrderProviders],
})
export class AppModule {}
