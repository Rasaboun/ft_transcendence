import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { Session } from 'src/typeorm';
import { UsersModule } from 'src/users/users.module';
import { GameGateway } from './game.gateway';
import { LobbyManager } from './lobby/lobby.manager';

@Module({
    imports: [
        TypeOrmModule.forFeature([Session]),
        UsersModule,
        AuthModule,
    ],
    providers: [LobbyManager, GameGateway]
})
export class GameModule {}
