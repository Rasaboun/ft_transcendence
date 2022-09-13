import { v4 } from "uuid";
import { Server } from "socket.io";
import { AuthenticatedSocket, ChannelModes, Message } from "../types/channel.type";

export class Channel
{
    public          mode:                   ChannelModes = ChannelModes.Public;
    public          owner:                  string = "";
    public          clients:        	    Map<string, AuthenticatedSocket> = new Map<string, AuthenticatedSocket>();

    constructor    ( private server: Server, public id : string) {}

    public addClient(client: AuthenticatedSocket): void
    {
        this.clients.set(client.id, client);
        client.join(this.id);
        client.data.channel = this;
        console.log(this.id)
        

        console.log("Channel clients ", this.clients.size);
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

    public isPublic(): boolean { return this.mode == ChannelModes.Public }

    public isPrivate(): boolean { return this.mode == ChannelModes.Private }

    public isPasswordProtected(): boolean { return this.mode == ChannelModes.Password }

    public sendMessage(clientId: string, message: string) { this.server.to(this.id).emit("msgToChannel", {sender: clientId, content: message})}

    public sendToUsers(event: string, data: any) { this.server.to(this.id).emit(event, data); }

	public getClientSocket(clientId: string)	{ return this.clients.get(clientId); }
    
    public getNbClients(): number { return this.clients.size; }
}