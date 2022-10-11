import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import entities from './typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { DataSource } from "typeorm"
import { MatchModule } from './match/match.module';
import { ChatModule } from './chat/chat.module';
import { GameModule } from './game/game.module';
import { PrivChat } from './chat/privChat/privChat';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
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
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService]
})
export class AppModule{
    constructor(private dataSource: DataSource) {}
  
    getDataSource() {
      return this.dataSource;
    }
}