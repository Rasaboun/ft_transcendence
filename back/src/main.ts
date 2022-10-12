import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors:  true });

  app.useGlobalPipes(new ValidationPipe()) //Don't need to use validation in controller
  // app.enableCors({  
  //   origin: ["http://10.11.10.22:3000", "http://localhost:3000"],
  //   credentials: true,});
  app.use(cookieParser())
  await app.listen(3002);
}
bootstrap();
