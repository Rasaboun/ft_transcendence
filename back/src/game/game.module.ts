import { Module } from '@nestjs/common';
import { SessionManager } from 'src/sessions/sessions.manager';
import { GameGateway } from './game.gateway';
import { LobbyManager } from './lobby/lobby.manager';

@Module({
    providers: [LobbyManager, GameGateway, SessionManager]
})
export class GameModule {}
