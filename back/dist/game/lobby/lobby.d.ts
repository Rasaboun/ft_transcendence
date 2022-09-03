import { Server } from "socket.io";
import { AuthenticatedSocket, GameData, GameState, Player } from "../game.type";
import { GameInstance } from "../game.instance";
export declare class Lobby {
    private server;
    readonly id: string;
    nbPlayers: number;
    state: GameState;
    readonly inviteMode: boolean;
    readonly gameInstance: GameInstance;
    clients: Map<string, AuthenticatedSocket>;
    constructor(server: Server);
    addClient(client: AuthenticatedSocket): void;
    startGame(): void;
    removeClient(client: AuthenticatedSocket): void;
    clear(): void;
    playersId(): string[];
    sendUpdate(event: string, data: any): void;
    needUpdate(event: string, data: GameData): void;
    sendToUsers(event: string, data: any): void;
    getUser(client: AuthenticatedSocket): Player;
}
