import { v4 } from "uuid";
import { Server } from "socket.io";
import { ChannelInfo, ChannelModes, ClientInfo, Message } from "../types/channel.type";

export class Channel
{
    public          mode:                   ChannelModes = ChannelModes.Public;
    public          owner:                  string = "";
    public          clients:        	    Map<string, string> = new Map<string, string>();

    constructor    ( private server: Server, public id : string) {}

    public addClient(username: string, roomId: string | null): void
    {
        this.clients.set(username, roomId);
    }

    public removeClient(clientId: string)
    {
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
    public getInfo(clients?: ClientInfo[]): ChannelInfo

    {
        const res: ChannelInfo = {
            channelId: this.id,
            clients: clients,
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
    
    public sendToClient(clientId: string, event: string, data?: any)
    {
        const roomId = this.clients.get(clientId);

        if (!roomId)
            return ;
        this.server.to(roomId).emit(event, data);
    }


    public async sendToUsers(event: string, data: any, exclude?: string)
    {
        this.clients.forEach((roomId, client) => {
            if (roomId != null && roomId != exclude)
                this.server.to(roomId).emit(event, data);
        })
    }

    public updateClient(username: string, roomId: string) {  this.clients.set(username, roomId); }

    public isClient(clientId: string): boolean { return this.clients.has(clientId); }

    public isPublic(): boolean { return this.mode == ChannelModes.Public }

    public isPrivate(): boolean { return this.mode == ChannelModes.Private }

    public isPasswordProtected(): boolean { return this.mode == ChannelModes.Password }

    public sendMessage(msg: Message) { this.server.to(this.id).emit("msgToChannel", msg)}


	public getClientRoomId(clientId: string) { return this.clients.get(clientId); }

    public getNbClients(): number { return this.clients.size; }
}