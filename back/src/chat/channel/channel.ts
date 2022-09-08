import { v4 } from "uuid";
import { Server } from "socket.io";
import { AuthenticatedSocket, Message } from "../types/channel.type";

export class Channel
{
    public readonly id: string = v4()
    public readonly isPrivate:      boolean = false;
    private         password:       string;

    public          clients:        	Map<string, AuthenticatedSocket> = new Map<string, AuthenticatedSocket>();

    constructor    ( private server: Server) {}

    public addClient(client: AuthenticatedSocket): void
    {
        this.clients.set(client.id, client);
        client.join(this.id);
        client.data.channel = this;
        console.log(this.id)

        console.log("Channel clients ", this.clients.size)
    }

    public removeClient(client: AuthenticatedSocket)
    {
        client.data.channel = null;
        client.leave(this.id);
        this.clients.delete(client.id);
    }

    public clientsId(): string[]
    {
        let clientsIdArray: string[] = [];

        this.clients.forEach((client, id) => {
            clientsIdArray.push(id);
        })
        return clientsIdArray;
    }

    public sendMessage(clientId: string, message: string) { this.server.to(this.id).emit("msgToChannel", {sender: clientId, content: message})}

    public sendToUsers(event: string, data: any) { this.server.to(this.id).emit(event, data); }

	public getUser(client: AuthenticatedSocket)	{ return this.clients.get(client.id); }
    
    public getNbClients(): number { return this.clients.size; }
}