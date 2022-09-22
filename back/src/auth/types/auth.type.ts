import { Socket } from "socket.io"
import { Lobby } from "src/game/lobby/lobby"

export type newSessionDto = {
    sessionId: string
    roomId: string,
    login: string,
    expiresAt: number,
    lobbyId?: string,
}

export type AuthenticatedSocket = Socket & {
	sessionId: string,
	roomId: string,
	login: string,
	lobbyId: string,
    lobby: Lobby
}
