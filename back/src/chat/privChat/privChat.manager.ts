import { ForbiddenException, forwardRef, Inject, NotFoundException } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import { WebSocketServer } from "@nestjs/websockets";
import { Message } from "../chat.type";
import { PrivChat } from "./privChat";
import { ActionOnUser, AuthenticatedSocket, ChannelClient } from "../types/channel.type";
import { PrivChatService } from "./chat.service";
import { User } from "src/typeorm";
import { newChatDto } from "../dto/chat.dto";

export class PrivChatManager
{
	
	constructor(
        @Inject(forwardRef(() => PrivChatService))
        private privChatService: PrivChatService) {}

	@WebSocketServer()
	public server;
	// array of private chat or users, only thing that counts is the users online
	private readonly onlineChats: Array<PrivChat> = new Array<PrivChat>();

	public initializeSocket(client: AuthenticatedSocket): void
	{
		client.data.privChat = null;
	}

	public terminateSocket(client: AuthenticatedSocket): void
	{
		client.data.privChat?.terminateConnection(client);
	}

	///
	// chat operations
	///
	public async createPrivChat(chatSocket: AuthenticatedSocket, idSender: number, idReciever: number): Promise<PrivChat>
	{
		let chat = new PrivChat(this.server, idSender, idReciever);
		var messList: Message[] = [{"senderId": idSender, "mess": ""}];
		try {
			this.privChatService.createNewChat({"UserIdFirstSender":idSender, "UserIdFirstReciever": idReciever, "mess": messList});
		} catch (error)
		{
			throw Error("Chat creation did not work");
		}
		return (chat);
		//todo need to check if the user is connected to the website
	}

	public chatInList(senderId: number, recieverId: number)
	{
		for (var i in this.onlineChats)
		{
			if ((this.onlineChats[i]._senderId == senderId && this.onlineChats[i]._recieverId == recieverId) 
				|| (this.onlineChats[i]._recieverId == senderId && this.onlineChats[i]._senderId == recieverId))
			{
				return (this.onlineChats[i]);
			}
		}
		return (null);
	}

	public async chatExists(senderId: number, recieverId: number)
	{
		return (this.privChatService.findOneBySenderReciever(senderId, recieverId) != null);
	}

	public async loadChatObj(client: AuthenticatedSocket,senderId: number, recieverId: number): Promise<PrivChat>
	{
		if (!this.chatExists(senderId, recieverId))
			return (null);
		var ret_val: PrivChat = null;
		try {
			this.createPrivChat(client, senderId, recieverId);
			this.loadMessages(senderId, recieverId).then((result) => {
				ret_val._messList  = result;
			}) 
			ret_val._senderId = senderId;
			ret_val._recieverId = recieverId;
		}
		catch(error)
		{
			throw Error("Could not create private chat")
		}	
		return ret_val;
	}

	public async loadMessages(senderId: number, recieverId: number): Promise<Message[]>
	{
		if (this.chatExists(senderId, recieverId))
		{
			var messageList: Message[] = await this.privChatService.getMessageList(senderId, recieverId);
			return (messageList);
		}
		return ([]);
	}

	///
	// message opearation
	///
	public async sendMessage(senderId: number, recieverId: number, mess: string)
	{
		// case the two id are the same
		let chat: PrivChat;  
		if ((chat = this.chatInList(senderId, recieverId)) == null)
		{
			if (!this.chatExists(senderId, recieverId))
			{
				this.privChatService.createNewChat({"UserIdFirstSender": senderId, "UserIdFirstReciever": recieverId, "mess": []});
			}
			var messageList: Message[] = await this.loadMessages(senderId, recieverId);
			chat = new PrivChat(this.server, senderId, recieverId, messageList);
			this.onlineChats.push(chat);
		}
		chat.sendMessage(senderId, recieverId, mess);
	}	

	public getOpennedPrivChat(clientId: number): Array<PrivChat>
	{
		var ret_val: Array<PrivChat> = [];
		for (var i in this.onlineChats)
		{
			if (this.onlineChats[i]._senderId == clientId || this.onlineChats[i]._recieverId == clientId)
				ret_val.push(this.onlineChats[i]);
		}
		return (ret_val);
	}

	public getConnectedUsers()
	{
		// means that we should get map or array of all connected user from the beginning on
		// means the array should constantly check for disconnection

	}


}