import { Socket } from "socket.io"
import { Lobby } from "src/game/lobby/lobby"
export type AuthenticatedSocket = Socket & {
	roomId: string,
	login: string,
	lobbyId: string,
    lobby: Lobby
}

export type TokenPayload = { 
    login: string,
    roomId: string,
};