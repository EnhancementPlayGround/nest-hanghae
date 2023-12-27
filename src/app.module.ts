import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApisModule } from './apis/apis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ApisModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
