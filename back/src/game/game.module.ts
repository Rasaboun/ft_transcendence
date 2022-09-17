import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { LobbyManager } from './lobby/lobby.manager';

@Module({
    providers: [LobbyManager, GameGateway]
})
export class GameModule {}
