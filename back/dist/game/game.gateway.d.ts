import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { LobbyManager } from './lobby/lobby.manager';
import { AuthenticatedSocket, Player } from './game.type';
export declare class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private lobbyManager;
    constructor(lobbyManager: LobbyManager);
    server: any;
    afterInit(server: Server): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: AuthenticatedSocket): void;
    createLobby(client: AuthenticatedSocket): void;
    joiningQueue(client: AuthenticatedSocket, player: Player): void;
    spectateGame(client: AuthenticatedSocket, lobbyId: string): void;
    getActiveGames(client: AuthenticatedSocket): void;
    launchGame(client: AuthenticatedSocket): void;
    handlePlayerPosition(client: AuthenticatedSocket, newPos: number): void;
}
