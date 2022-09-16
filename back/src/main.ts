import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session'
import * as passport from 'passport'
import { TypeORMSession } from './typeorm';
import { TypeormStore } from 'connect-typeorm/out';
import { NestApplication, } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import * as cors from 'cors'
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server } from 'socket.io';
import { createServer } from 'http';
import bodyParser from 'body-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const sessionRepo = app
    .get(AppModule)
    .getDataSource()
    .getRepository(TypeORMSession);

  app.useGlobalPipes(new ValidationPipe()) //Don't need to use validation in controller
  app.use(session({
      cookie: {
        maxAge: Number(process.env.COOKIE_LIFETIME_IN_MS),
      },
      name: "FT_TRANSCENDENCE_SESSION",
      secret: process.env.COOKIE_SECRET,
      resave: false,
      saveUninitialized: false,
      store: new TypeormStore().connect(sessionRepo),
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  
  await app.listen(3002);
}
bootstrap();
