import { ForbiddenException, forwardRef, Inject, NotFoundException } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import { Server } from "socket.io";
import { WebSocketServer } from "@nestjs/websockets";
import { AuthenticatedSocket } from "src/auth/types/auth.type";
import { Message, MessageTypes } from "../types/channel.type";
import { PrivChat } from "./privChat";
import { ActionOnUser, ChannelClient } from "../types/channel.type";
import { PrivChatService } from "./privChat.service";
import { User } from "src/typeorm";
import { first, map } from "rxjs";
import { UsersService } from "src/users/users.service";
import { privChatInfo, sendMessageDto } from "../types/privChat.type";
import { listenerCount } from "mysql2/typings/mysql/lib/Connection";

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
	private readonly privateChats: Map<string, PrivChat> = new Map<string, PrivChat>();

	public async initPrivChats()
	{
		const privChatInDb = await this.privChatService.findAll()
		for (let i = 0; i < privChatInDb.length; i++)
		{
			const currPrivChat = new PrivChat(this.server, privChatInDb[i].name);
			
			const firstUser = await this.userService.findOneByIntraLogin(privChatInDb[i].firstUserLogin);
			const secondUser = await this.userService.findOneByIntraLogin(privChatInDb[i].secondUserLogin);
			currPrivChat.addClient(firstUser.intraLogin, firstUser.roomId);
			currPrivChat.addClient(secondUser.intraLogin, secondUser.roomId);
			
			this.privateChats.set(currPrivChat.name, currPrivChat);
		}
	}


	public async loadMessages(firstUserLogin: string, secondUserLogin: string): Promise<Message[]>
	{
		const chat = await this.privChatService.findOneByUsers(firstUserLogin, secondUserLogin);
		let messages: Message[] = [];
		if (chat)
		{
			messages = await this.privChatService.getMessageList(chat.name);
		}
		return (messages);
	}

	public async joinPrivChat(client: AuthenticatedSocket, targetLogin: string)
	{
		try
		{
			let chat = await this.privChatService.findOneByUsers(client.login, targetLogin);
			const secondUser = await this.userService.findOneByIntraLogin(targetLogin);
			if (!chat)
			{
				chat = await this.privChatService.createNewChat(client.login, targetLogin);
				
				const privChat = new PrivChat(this.server, chat.name);
				privChat.addClient(client.login, client.roomId);
				
				privChat.addClient(secondUser.intraLogin, secondUser.roomId);

				this.privateChats.set(privChat.name, privChat);
			}
			client.join(chat.name);
			const chatInfo: privChatInfo = await this.privChatService.getChatInfo(chat.name, client.login);
		
			client.emit('joinedPrivChat', chatInfo);
		}
		catch (error) { throw error; }
	}

    public async joinPrivChats(client: AuthenticatedSocket)
    {
        for (const [channelName, privChat] of this.privateChats)
        {
            if ( privChat.isClient(client.login))
            {
                client.join(channelName);
            }
        }
    }

	public async sendMessage(client: AuthenticatedSocket, data: sendMessageDto): Promise<Message>
	{
		const chat = this.privChatService.findOneByName(data.chatName);
		if (!chat)
			return ;
		if (await this.privChatService.isBlocked(data.chatName, client.login))
			throw new ForbiddenException('You are block by this user');

		const sender = await this.userService.findOneByIntraLogin(client.login);

		const message: Message = {
		 	sender: {
				login: client.login,
				username: sender.username
			},
			content: data.content,
			type: MessageTypes.Message,
			};
			
		const privChat = this.privateChats.get(data.chatName);
		privChat.sendMessage(message);
		await this.privChatService.addMessage(data.chatName, message);
	}	

	public async blockUser(client: AuthenticatedSocket, chatName: string)
	{
		try
		{
			const chat = this.privateChats.get(chatName);
			const targetLogin = chat.getOtherLogin(client.login);
			await this.privChatService.blockUser(chatName, targetLogin);
			this.sendChatInfo(client, chatName);
		}
		catch (e) { throw e};
		
	}

	public async unblockUser(client: AuthenticatedSocket, chatName: string)
	{
		try
		{
			const targetLogin = await this.privChatService.getOtherLogin(client.login, chatName);
			await this.privChatService.unblockUser(chatName, targetLogin);
			this.sendChatInfo(client, chatName);
		}
		catch (e) { throw e};	
	}

	public async sendChatInfo(client: AuthenticatedSocket, chatName: string)
	{
		const chat = this.privateChats.get(chatName);

		//Send to caller
		let chatInfo: privChatInfo = await this.privChatService.getChatInfo(chatName, client.login);
		this.server.to(client.roomId).emit('privChatInfo', chatInfo);

		//Send to second user
		const otherLogin = chatInfo.otherLogin;
		chatInfo = await this.privChatService.getChatInfo(chatName, otherLogin);
		this.server.to(chat.getRoomId(otherLogin)).emit('privChatInfo', chatInfo);
	}

	public async getChatInfo(client: AuthenticatedSocket, chatName: string)
	{
		try
		{
			const privChat = await this.privChatService.findOneByName(chatName);

			const otherLogin = await this.privChatService.getOtherLogin(client.login, chatName);
			const otherUser = await this.userService.findOneByIntraLogin(otherLogin);
			
			const chatInfo: privChatInfo = await this.privChatService.getChatInfo(chatName, client.login);
		
			client.emit('privChatInfo', chatInfo);
		}
		catch (e) { throw e};
	}
}