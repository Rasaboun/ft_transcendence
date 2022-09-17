import { Socket } from "socket.io";
import { User } from "src/typeorm";
import { v4 } from "uuid";
import { AuthenticatedSocket } from "../types/channel.type";
import { Session } from "./sessions.type";

export class SessionManager
{
    private         sessions: Map<string, Session> = new  Map<string, Session>;


    initializeSocket(client: AuthenticatedSocket)
    {
		const sessionId = client.handshake.auth.sessionId;
        console.log("auth", client.handshake.auth)
		if (sessionId)
        {
		  const session = this.findSession(sessionId);
          console.log("session", session)
		  if (session)
          {
			client.sessionId = sessionId;
			client.roomId = session.roomId;
			client.login = session.login;
		  }
		}
        else
        {
            client.sessionId = v4();
            client.roomId = v4();
            client.login = client.handshake.auth.login;
            this.saveSession(client.sessionId, {
                connected: true,
                roomId: client.roomId,
                login: client.login,
                })
        }
        client.join(client.roomId);
        client.emit("session", {
            sessionId: client.sessionId,
            roomId: client.roomId,
        })

    }

    public findSession(sessionId: string) { return this.sessions.get(sessionId); }

    public saveSession(sessionId: string, session: Session) { this.sessions.set(sessionId, session); }
}