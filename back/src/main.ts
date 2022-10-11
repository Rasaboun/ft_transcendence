import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session'
import * as passport from 'passport'


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors:  true });
  app.useGlobalPipes(new ValidationPipe()) //Don't need to use validation in controller
  app.use(session({
      cookie: {
        maxAge: Number(process.env.COOKIE_LIFETIME_IN_MS),
      },
      name: "FT_TRANSCENDENCE_SESSION",
      secret: process.env.COOKIE_SECRET,
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  // app.enableCors({  
  //   origin: ["http://10.11.10.22:3000", "http://localhost:3000"],
  //   credentials: true,});
  await app.listen(3002);
}
bootstrap();
