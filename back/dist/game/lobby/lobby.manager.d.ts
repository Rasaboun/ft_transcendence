import { AuthenticatedSocket } from "../game.type";
import { Lobby } from "./lobby";
export declare class LobbyManager {
    server: any;
    private readonly lobbies;
    private readonly avalaibleLobbies;
    constructor();
    initializeSocket(client: AuthenticatedSocket): void;
    terminateSocket(client: AuthenticatedSocket): void;
    createLobby(): Lobby;
    joinQueue(client: AuthenticatedSocket): void;
    destroyLobby(lobbyId: string): void;
    joinLobby(lobbyId: string, client: AuthenticatedSocket): void;
    getActiveLobbies(): {
        lobbyId: string;
        playersId: string[];
    }[];
    private lobbiesCleaner;
}
