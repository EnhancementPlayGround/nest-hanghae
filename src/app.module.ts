import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  AccountProviders,
  ControllerProviders,
  OrderProviders,
  ProductProviders,
} from './Providers';
import { CoreModule } from './core/core.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CoreModule,
    CqrsModule,
  ],
  controllers: [...ControllerProviders],
  providers: [...AccountProviders, ...ProductProviders, ...OrderProviders],
})
export class AppModule {}
