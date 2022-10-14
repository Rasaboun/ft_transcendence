import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { MatchModule } from 'src/match/match.module';
import { UsersModule } from 'src/users/users.module';
import { GameGateway } from './game.gateway';
import { LobbyManager } from './lobby/lobby.manager';

@Module({
    imports: [
        UsersModule,
        AuthModule,
        MatchModule,
    ],
    providers: [LobbyManager, GameGateway]
})
export class GameModule {}
