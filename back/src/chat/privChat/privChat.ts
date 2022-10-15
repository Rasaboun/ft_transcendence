import { Server } from "socket.io";
import { Message } from "../types/channel.type";

export class PrivChat
{
    public readonly _isBlocked:      boolean = false;
	public			clients:		Map<string, string> = new Map<string, string>();
    constructor    ( private server: Server, public name: string ) {}


	public addClient(clientLogin: string, roomId: string)
	{
		this.clients.set(clientLogin, roomId);
	}

	public getOtherLogin(callerLogin: string)
	{
		let res: string;
		this.clients.forEach((roomId, login) => {
			if (login != callerLogin)
				res = login;
		})
		return res;
	}

    public sendMessage(msg: Message) { this.server.to(this.name).emit("msgToPrivChat", msg)}

	public getRoomId(login: string)
	{
		return this.clients.get(login);
	}
	
	public isClient(login: string)
	{
		return this.clients.get(login) == undefined ? false : true;
	}

}