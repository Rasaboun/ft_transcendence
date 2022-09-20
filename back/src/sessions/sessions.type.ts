import { Socket } from "socket.io"
import { ReservedOrUserEventNames } from "socket.io/dist/typed-events"
import { Lobby } from "src/game/lobby/lobby"

export type Session = {
    roomId: string,
    login: string,
    connected: boolean,
    lobby?: Lobby,
}

export type AuthenticatedSocket = Socket & {
	sessionId: string,
	roomId: string,
	login: string,
	lobby: Lobby,
}
