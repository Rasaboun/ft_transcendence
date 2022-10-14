import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from './typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MatchModule } from './match/match.module';
import { ChatModule } from './chat/chat.module';
import { GameModule } from './game/game.module';
import { MulterModule } from '@nestjs/platform-express';
import { JwtStrategy } from './auth/stategy/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_ADDR,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: entities,
      synchronize: true,
  }),
  MulterModule.register({
    dest: process.env.UPLOAD_PATH,
  }),
  MatchModule,
  AuthModule,
  ChatModule,
  GameModule
  ],
  providers: [JwtStrategy],
  
})
export class AppModule{}