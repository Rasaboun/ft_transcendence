import { ForbiddenException, forwardRef, Inject, NotFoundException } from "@nestjs/common";
import { AuthenticatedSocket } from "src/sessions/sessions.type";
import { Interval } from "@nestjs/schedule";
import { Server } from "socket.io";
import { WebSocketServer } from "@nestjs/websockets";

import { Message } from "../types/channel.type";
import { PrivChat } from "./privChat";
import { ActionOnUser, ChannelClient } from "../types/channel.type";
import { PrivChatService } from "./chat.service";
import { User } from "src/typeorm";
import { PrivChatNewMessageDto } from "../types/privChat.types";
import { map } from "rxjs";


export class PrivChatManager
{
	constructor(
        @Inject(forwardRef(() => PrivChatService))
        private privChatService: PrivChatService) {}

	@WebSocketServer()
	public server: Server;
	// array of private chat or users, only thing that counts is the users online
	private readonly onlineChats: Array<PrivChat> = new Array<PrivChat>();

	public async initPrivChat(){
		const privChatInDb = await this.privChatService.findAll()
		for (let i = 0; privChatInDb.length; i++)
		{
			const currPrivChat = new PrivChat(this.server, )
		}
	}
	public initializeSocket(client: AuthenticatedSocket): void
	{
		client.data.privChat = null;
	}

	public terminateSocket(client: AuthenticatedSocket): void
	{
		client.data.privChat?.terminateConnection(client);
		// todo remove an element clean from an array
		var i2 = 0;
		for (var i = 0; i < this.socketList.length - 1; i++)
		{
			if (this.socketList[i] == client)
				this.socketList.at(i) == this.socketList.at(++i2);
			i2++;
		}
		this.socketList.pop()
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
	public async sendMessage(client: AuthenticatedSocket, senderId: number, recieverId: number, mess: string)
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
		this.privChatService.sendMessage({"Sender" : senderId, "Reciever": recieverId, "mess": {"senderId": senderId, "mess": mess}})
		chat.sendMessage(client.roomId, senderId, mess);
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

	public listUsers()
	{
		return (this.socketList.toString());
	}
}