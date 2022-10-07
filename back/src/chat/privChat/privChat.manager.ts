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
								privChatInDb[i].firstUserLogin,
								privChatInDb[i].secondUserLogin);
			this.onlineChats.push(currPrivChat);
		}
	}

	private async privateChatExists(senderId: string , recieverId: string)
	{
		try {
			//check in list
			// check in bsd
			var e: any;
			this.onlineChats.forEach(element => {
				if ((element._recieverId == recieverId && element._senderId == senderId) ||
					element._senderId == recieverId && element._senderId == recieverId)	
				{
					return element;
				}	
			});
			if ((e = await this.privChatService.findOneBySenderReciever(senderId, recieverId)) != undefined)
			{
				console.log("return of findOneBySenderReciever : " + e)
				// add the chat in the list if it is already registered
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

	public async createPrivateChat(firstUserLogin: string, secondUserLogin: string, firstMess: string)
	{
		if (this.privateChatExists(firstUserLogin, secondUserLogin))	
			throw new ForbiddenException("Cannot create a chat that already exists");
		try {
			var firstUser: User = await this.userService.findOneByIntraLogin(firstUserLogin);
			var secondUser: User = await this.userService.findOneByIntraLogin(secondUserLogin);
			var messStruct: Message = {
				"sender": {"login": firstUser.intraLogin, "username": firstUser.username},
				"content": firstMess,
				"type": MessageTypes.Message,
				};
			console.log("Create new chat param : ", firstUserLogin, " secondUserLogin " , secondUserLogin, " server : ", this.server)
			this.privChatService.createNewChat({firstUserLogin,  secondUserLogin})
			const chat = new PrivChat(this.server, firstUserLogin, secondUserLogin, [messStruct, ]);	
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
	public async loadMessages(senderId: string, recieverId: string): Promise<Message[]>
	{
		console.log("LoadMessages : senderId : ", senderId, " recieverId ", recieverId)
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
			client.emit("privMessageList", (await this.loadMessages(client.login, intraLogin)))
		}
		catch (error)
		{
			console.log(error);
		}
	}

	///
	// message opearation
	///
	public async sendMessage(client: AuthenticatedSocket, senderId: string, recieverId: string, mess: string): Promise<Message>
	{
		// case the two id are the same
		let chat: PrivChat;
		if ((this.privateChatExists(senderId, recieverId)) == undefined)
		{
			try {
				this.createPrivateChat(senderId, recieverId, mess);
				// var faMess: Message[] = [{ sender: 
				// 			{
				// 				login: senderId,
				// 				username: senderId
				// 			}, reciever: {
				// 				login: senderId,
				// 				username: senderId,
				// 			},
				// 			content: mess,
				// 			type: 2
				// // 		}, ];
				// chat = new PrivChat(this.server, senderId, recieverId, faMess);
			}
			catch (error)
			{
				throw error;
			}
		}
		else
		{
			chat = new PrivChat(this.server, senderId, recieverId, )
		}
		var senderUser: User = await this.userService.findOneByIntraLogin(senderId);
		var recieverUser: User = await this.userService.findOneByIntraLogin(recieverId);
		var messStruct: Message = {
			"sender": {"login": senderUser.intraLogin, "username": senderUser.username},
			"content": mess,
			"type": MessageTypes.Message,
			};
		chat.sendMessage(client.roomId, senderId, mess);
		// need to send it to recievers
		this.privChatService.sendMessage(messStruct);
		return (messStruct);
	}	

	public getOpennedPrivChat(clientId: string): Array<PrivChat>
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