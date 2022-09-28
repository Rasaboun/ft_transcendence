import { ForbiddenException, forwardRef, Inject, NotFoundException } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import { Server } from "socket.io";
import { WebSocketServer } from "@nestjs/websockets";
import { AuthenticatedSocket } from "src/auth/types/auth.type";
import { Message, MessageTypes } from "../types/channel.type";
import { PrivChat } from "./privChat";
import { ActionOnUser, ChannelClient } from "../types/channel.type";
import { PrivChatService } from "./chat.service";
import { User } from "src/typeorm";
import { PrivChatNewMessageDto } from "../types/privChat.types";
import { map } from "rxjs";
import { UsersService } from "src/users/users.service";

export class PrivChatManager
{
	constructor(
        @Inject(forwardRef(() => PrivChatService))
        private privChatService: PrivChatService,
		@Inject(forwardRef(() => UsersService))
        private userService: UsersService,) {}

	@WebSocketServer()
	public server: Server;
	// array of private chat or users, only thing that counts is the users online
	private readonly onlineChats: Array<PrivChat> = new Array<PrivChat>();

	public async initPrivChat()
	{
		const privChatInDb = await this.privChatService.findAll()
		for (let i = 0; privChatInDb.length; i++)
		{
			const currPrivChat = new PrivChat(this.server,
								privChatInDb[i].UserIdFirstSender,
								privChatInDb[i].UserIdFirstReciever,
								privChatInDb[i].mess);
			this.onlineChats.push(currPrivChat);
		}
	}

	private async privateChatExists(senderId: number , recieverId: number)
	{
		try {
			//check in list
			// check in bsd
			this.onlineChats.forEach(element => {
				if ((element._recieverId == recieverId && element._senderId == senderId) ||
					element._senderId == recieverId && element._senderId == recieverId)	
				{
					return element;
				}	
			});
			if (this.privChatService.findOneBySenderReciever(senderId, recieverId) != undefined)
			{
				// add the chat in the list if it is already registered
				var e: any = await this.privChatService.findOneBySenderReciever(senderId, recieverId)
				var s: PrivChat = new PrivChat(this.server, e.userIdFirstSender, e.userIdFirstReciever, e.mess);
				this.onlineChats.push(s)
				return s;
			}
		}
		catch( error )
		{
			throw new ForbiddenException(error);	
		}
		return undefined;
	}

	public async createPrivateChat(senderId: number, recieverId: number, firstMess: string)
	{
		if (this.privateChatExists(senderId, recieverId))	
			throw new ForbiddenException("Cannot create a chat that already exists");
		try {
			var senderUser: User = await this.userService.findOneById(senderId);
			var recieverUser: User = await this.userService.findOneById(recieverId);
			
			var messStruct: Message = {
				"sender": {"login": senderUser.intraLogin, "username": senderUser.username},
				"reciever": {"login": recieverUser.intraLogin, "username": recieverUser.username},
				"content": firstMess,
				"type": MessageTypes.Message,
				};
			this.privChatService.createNewChat({"Sender": senderId, 
			"Reciever": recieverId, "mess": [messStruct, ]})
			const chat = new PrivChat(this.server, senderId, recieverId, [messStruct, ]);	
			this.onlineChats.push(chat);
		}
		catch (error)
		{
			throw error;	
		}
	}

	/*
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
	*/

	///
	// chat operations
	///
	public async loadMessages(senderId: number, recieverId: number): Promise<Message[]>
	{
		if (this.privateChatExists(senderId, recieverId))
		{
			var messageList: Message[] = await this.privChatService.getMessageList(senderId, recieverId);
			return (messageList);
		}
		return ([]);
	}

	public async joinPrivChat(client: AuthenticatedSocket, intraLogin: string)
	{
		try {
			var recieverId: number = (await this.userService.findOneByIntraLogin(intraLogin)).id;
			console.log(this.server);
			this.server.to(client.roomId).emit("privMessageList", (await this.loadMessages(client.dbId, recieverId)).toString())
		}
		catch (error)
		{
			console.log(error);
		}
	}

	///
	// message opearation
	///
	public async sendMessage(client: AuthenticatedSocket, senderId: number, recieverId: number, mess: string)
	{
		// case the two id are the same
		let chat: PrivChat;  
		if ((this.privateChatExists(senderId, recieverId)) == undefined)
		{
			try {
				this.createPrivateChat(senderId, recieverId, mess);
			}
			catch (error)
			{
				throw error;
			}
		}
		var senderUser: User = await this.userService.findOneById(senderId);
		var recieverUser: User = await this.userService.findOneById(recieverId);
		var messStruct: Message = {
			"sender": {"login": senderUser.intraLogin, "username": senderUser.username},
			"reciever": {"login": recieverUser.intraLogin, "username": recieverUser.username},
			"content": mess,
			"type": MessageTypes.Message,
			};	
		chat.sendMessage(client.roomId, senderId, mess);
		this.privChatService.sendMessage(messStruct);
		return (messStruct);
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

	/*public listUsers()
	{
		return (this.socketList.toString());
	}
	*/
}