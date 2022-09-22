import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { Lobby } from "src/game/lobby/lobby";
import { User } from "src/typeorm";
import { v4 } from "uuid";
import { AuthenticatedSocket, Session } from "./sessions.type";

@Injectable()
export class SessionService
{
    private         sessions: Map<string, Session> = new  Map<string, Session>;

    constructor() { };

    initializeSocket(client: AuthenticatedSocket)
    {
        console.log(client.handshake.auth.login)
		const sessionId = client.handshake.auth.sessionId;
		if (sessionId)
        {
		  const session = this.findSession(sessionId);
		  if (session)
          {
			client.sessionId = sessionId;
			client.roomId = session.roomId;
			client.login = session.login;
            client.lobby = session.lobby;
		  }
		}
        else 
        {
            client.sessionId = v4();
            client.roomId = v4();
            client.login = client.handshake.auth.login;
            client.lobby = null;
            this.saveSession(client.sessionId, {
                connected: true,
                roomId: client.roomId,
                login: client.login,
                lobby: client.lobby,
                })
        }
        client.join(client.roomId);
        client.emit("session", {
            sessionId: client.sessionId,
            roomId: client.roomId,
        })

    }

    public findSession(sessionId: string) { return this.sessions.get(sessionId); }

    public updateSessionLobby(sessionId: string, newLobby: Lobby | null)
    {
        let session = this.findSession(sessionId);
        if (session == undefined)
            return ;
        session.lobby = newLobby;
        this.saveSession(sessionId, session);
    }

    public saveSession(sessionId: string, session: Session) { this.sessions.set(sessionId, session); }
}