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
			client.userId = session.userId;
			client.username = session.username;
		  }
		}
        else
        {
            client.sessionId = v4();
            client.userId = v4();
            client.username = client.handshake.auth.username;
            this.saveSession(client.sessionId, {
                connected: true,
                userId: client.userId,
                username: client.username,
                })
        }
        client.join(client.userId);
        client.emit("session", {
            sessionId: client.sessionId,
            userId: client.userId,
        })

    }

    public findSession(sessionId: string) { return this.sessions.get(sessionId); }

    public saveSession(sessionId: string, session: Session) { this.sessions.set(sessionId, session); }
}