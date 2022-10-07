import { v4 } from "uuid";
import { Server } from "socket.io";
import { Message } from "../types/channel.type";
import { StringRegexOptions } from "joi";

export class PrivChat
{
    public readonly _isBlocked:      boolean = false;
	public			clients:		Map<string, string> = new Map<string, string>();
    constructor    ( private server: Server, public name: string ) {}


	public addClient(clientLogin: string, roomId: string)
	{
		this.clients.set(clientLogin, roomId);
	}

    public sendToUsers(event: string, data: any)
	{
		// add this a fct to send to single user
		// this.server.to(this.id).emit(event, data);
		
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


	
	// a function should be looking for new connections and potential connections
	// need a function to list online persons 
	// 
}