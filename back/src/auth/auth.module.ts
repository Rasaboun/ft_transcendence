import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session, User } from 'src/typeorm';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './stategy/jwt.strategy';
import { LocalStrategy } from './stategy/local.strategy';
@Module({
  imports: [
    TypeOrmModule.forFeature([Session]),
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '600s'}
    }),
    PassportModule,
    HttpModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
