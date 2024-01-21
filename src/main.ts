import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [/localhost/, /127\.0\.0\.1/, /192\.168\.\d{1,3}\.\d{1,3}/],
  });
  await app.listen(3000);
}

bootstrap();
