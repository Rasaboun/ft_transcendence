import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from 'src/typeorm';
import { UsersModule } from 'src/users/users.module';
import { GameController } from './game.controller';
import { GameService } from './game.service';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Game])
  ],
  controllers: [GameController],
  providers: [GameService]
})
export class GameModule {}
