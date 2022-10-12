import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo, User } from 'src/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PhotoService } from './photo/photo.service';
import { LocalAuthGuard } from 'src/auth/guards/local.guard';
import JwtAuthGuard from 'src/auth/guards/jwt.strategy.guard';
import { JwtStrategy } from 'src/auth/stategy/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Photo]),
    ConfigModule,
  ],
  providers: [UsersService, PhotoService, JwtStrategy],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
