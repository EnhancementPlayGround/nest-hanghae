import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 검증 데코레이터가 없는 속성을 제거
      forbidNonWhitelisted: true, // whitelist에 없는 속성이 있으면 요청 자체를 거부
      transform: true, // 쿼리 파라미터를 DTO 인스턴스로 변환
      transformOptions: {
        enableImplicitConversion: true, // 타입 자동 변환 활성화
      },
    }),
  );

  await app.listen(3000);
}
bootstrap();
