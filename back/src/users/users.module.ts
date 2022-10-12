import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo, User } from 'src/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PhotoService } from './photo/photo.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Photo]),
    ConfigModule,
  ],
  providers: [UsersService, PhotoService],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
