import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  // Pipes

  app.useGlobalPipes(
    new ValidationPipe({
      transform: false,
      whitelist: false,
    }),
  );
  // ---- Pipes
  console.log(process.env.PORT);
  await app.listen(5000);
}

bootstrap();
