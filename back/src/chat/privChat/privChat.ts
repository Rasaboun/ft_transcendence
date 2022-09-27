import { v4 } from "uuid";
import { Server } from "socket.io";
import { Message } from "../types/channel.type";

export class PrivChat
{
    public readonly _isBlocked:      boolean = false;
    public _SenderConnected:      boolean = false;
    public _RecieverConnected:      boolean = false;

    constructor    ( private _server: Server,
			public _senderId : string,
			public _recieverId: string,
			public _messList: Message[] = [],
		) {
			//todo add a function to check the connection status of id's
			this._SenderConnected = true;
			this._RecieverConnected = true;
		//check if previous message saved ... if already exists etc
	}

    public sendToUsers(event: string, data: any)
	{
		// add this a fct to send to single user
		// this.server.to(this.id).emit(event, data);
	}

	public joinChannel()
	{

	}

	public sendMessage(client: string, senderId: string, mess: string)
	{
		// get the privChat entity to gt first senderandreciever and transform it into a string

		this._server.to(client).emit("privMessageToReciever", {sender: senderId, messCont: mess});
	}

	public setSenderConnected(status: boolean)
	{
		this._SenderConnected = status;
	}

	public setRecieverConnected(status: boolean)
	{
		this._RecieverConnected = status;
	}
	// a function should be looking for new connections and potential connections
	// need a function to list online persons 
	// 
}