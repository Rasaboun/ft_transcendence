import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors:  true });
  app.useGlobalPipes(new ValidationPipe()) //Don't need to use validation in controller
  app.enableCors({  
    origin: "*",});
  app.use(cookieParser());

  await app.listen(3002);
}
bootstrap();