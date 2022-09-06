import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm';
import { UsersService } from 'src/users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { IntraStrategy } from './stategy/intra.stategy';
import { SessionSerializer } from './utils/serialiazer';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    HttpModule,
  ],
  controllers: [AuthController ],
  providers: [AuthService, UsersService, IntraStrategy, SessionSerializer],
  exports: [AuthService],
})
export class AuthModule {}
