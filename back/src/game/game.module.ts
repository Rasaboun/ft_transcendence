import { Module } from '@nestjs/common';
import { SessionModule } from 'src/sessions/sessions.module';
import { SessionService } from 'src/sessions/sessions.service';
import { GameGateway } from './game.gateway';
import { LobbyManager } from './lobby/lobby.manager';

@Module({
    imports: [
        SessionModule,
    ],
    providers: [LobbyManager, GameGateway]
})
export class GameModule {}
