import { v4 } from "uuid";
import { Server } from "socket.io";
import { AuthenticatedSocket, ChannelInfo, ChannelModes, Message } from "../types/channel.type";

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
        

        console.log("Channel clients ", this.clients.size);
    }

    public removeClient(clientId: string)
    {
        let clientSocket: AuthenticatedSocket = this.clients.get(clientId);
        clientSocket.data.channel = null;
        clientSocket.leave(this.id);
        this.clients.delete(clientId);
    }

    public clientsId(): string[]
    {
        let clientsIdArray: string[] = [];

        this.clients.forEach((client, id) => {
            clientsIdArray.push(id);
        })
        return clientsIdArray;
    }

    public getInfo(): ChannelInfo
    {
        const res: ChannelInfo = {
            channelId: this.id,
            mode: this.mode,
            nbClients: this.getNbClients(),
            owner: this.owner,
        }
        return res;
    }

	public changeMode(newChannelMode: ChannelModes)
	{
		this.mode = newChannelMode;
	
		this.sendToUsers("channelModeChanged", {channelName: this.id, mode: newChannelMode})
	}

    public isPublic(): boolean { return this.mode == ChannelModes.Public }

    public isPrivate(): boolean { return this.mode == ChannelModes.Private }

    public isPasswordProtected(): boolean { return this.mode == ChannelModes.Password }

    public updateClient(clientId: string, socket: AuthenticatedSocket)
    {
        if (this.clients.get(clientId) == null)
            return ;
        this.clients.set(clientId, socket);   
        socket.join(this.id);
    }

    public sendMessage(clientId: string, message: string) { this.server.to(this.id).emit("msgToChannel", {sender: clientId, content: message})}

    public sendToUsers(event: string, data: any) { this.server.to(this.id).emit(event, data); }

	public getClientSocket(clientId: string)	{ return this.clients.get(clientId); }
    
    public getNbClients(): number { return this.clients.size; }
}