import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  // Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors): BadRequestException => {
        return new BadRequestException(
          errors
            .map((error) => {
              return Object.entries(
                error.constraints ?? error.children[0].constraints,
              )
                .map((entry) => entry[1])
                .join();
            })
            .join(', '),
        );
      },
    }),
  );
  // ---- Pipes
  console.log(process.env.PORT);
  await app.listen(5000);
}
bootstrap();
