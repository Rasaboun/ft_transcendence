import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { IntraGuard } from './guards/intra.guard';
import JwtTwoFactorAuthGuard from './guards/twofactor.guard';
import { IntraStrategy } from './stategy/intra.strategy';
import { LocalStrategy } from './stategy/local.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1d'}
    }),
    PassportModule,
    HttpModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, IntraStrategy, IntraGuard, JwtTwoFactorAuthGuard, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
