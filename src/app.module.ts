import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AccountProviders, ControllerProviders, OrderProviders, ProductProviders } from './Providers';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [...ControllerProviders],
  providers: [
    ...AccountProviders,
    ...ProductProviders,
    ...OrderProviders
  ],
})
export class AppModule {}
