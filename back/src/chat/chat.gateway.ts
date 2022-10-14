import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Channel } from './channel/channel';
import { PrivChat } from './privChat/privChat';
import { ChannelManager } from './channel/channel.manager';
import { ActionOnUser, AddAdmin, CreateChannel, InviteClient, JoinChannel, Message, MessageTypes, SetChannelPassword } from './types/channel.type';
import { AuthenticatedSocket } from 'src/auth/types/auth.type';
import { AuthService } from 'src/auth/auth.service';
import { PrivChatManager } from './privChat/privChat.manager';
import { forwardRef, Inject } from '@nestjs/common';
import { User } from 'src/typeorm';
import { UsersService } from 'src/users/users.service'
import { GameMode } from 'src/game/types/game.type';
import { use } from 'passport';
import { connectedUser, sendMessageDto } from './types/privChat.type';
import { UserStatus } from 'src/users/type/users.type';

@WebSocketGateway(8002, { cors: '*', namespace: 'chat' })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	constructor(
				private channelManager: ChannelManager,
				@Inject(forwardRef(() => AuthService))
				private authService: AuthService,
				private privChatManager: PrivChatManager,
				private userService: UsersService,
			)
	{}

	@WebSocketServer()
	server: Server;


	afterInit(server: Server) {
		
		this.channelManager.server = server;
		this.channelManager.initChannels();
		this.privChatManager.server = server;
		this.privChatManager.initPrivChats();
	}

	async handleConnection(client: Socket){
		console.log(`Client ${client.handshake.auth.login} joined chat socket`);
		await this.authService.initializeSocket(client as AuthenticatedSocket);
		await this.channelManager.joinChannels(client as AuthenticatedSocket);
		await this.privChatManager.joinPrivChats(client as AuthenticatedSocket);
	}

	async handleDisconnect(client: AuthenticatedSocket) {
		const nbSockets = (await this.server.in(client.roomId).fetchSockets()).length;
		if (nbSockets == 0)
		{
			await this.userService.setUserStatus(client.login, UserStatus.offline);
		}
		this.channelManager.terminateSocket(client);
	}
	
	@SubscribeMessage('joinChannel')
	async joinChannel(client: AuthenticatedSocket, data: JoinChannel)
	{
		try
		{
			await this.channelManager.joinChannel(client, data);
			client.chatId = data.channelName;
			await this.userService.setUserChatId(client.login, data.channelName);
			console.log(`Client ${client.login} joined channel ${data.channelName}`)
		}
		catch (error) { client.emit('error', error.message ) }
	}

	@SubscribeMessage('leaveChannel')
	async leaveChannel(client: AuthenticatedSocket, channelName: string)
	{
		try
		{
			await this.channelManager.leaveChannel(client, channelName);
			client.leave(channelName);
			await this.userService.setUserChatId(client.login, null);

			console.log(`Client ${client.id} left channel ${channelName}`)
		}
		catch (error) { client.emit('error', error.message ) }
	}

	@SubscribeMessage('createChannel')
	async createChannel(client: AuthenticatedSocket, data: CreateChannel)
	{
		try {
			const channel = await this.channelManager.createChannel(client, data);
			channel.addClient(client.login, client.roomId);
			await this.userService.setUserChatId(client.login, data.name);
			this.server.emit('activeChannels', this.channelManager.getActiveChannels());
		}
		catch (error) { return client.emit('error', error.message)}
	}

	@SubscribeMessage('deleteChannel')
	async deleteChannel(client: AuthenticatedSocket, channelId: string)
	{
		try
		{
			await this.channelManager.deleteChannel(channelId);
			console.log(`Client ${client.id} deleted channel ${channelId}`)
		}
		catch (error) { client.emit('error', error.message ) }

	}

	@SubscribeMessage('sendMessage')
	async sendMessage(client: AuthenticatedSocket, data: {channelId, message})
	{
		try {
			await this.channelManager.sendMessage(data.channelId, client, data.message);
		}
		catch (error) { client.emit('error', error.message ) }

	}

	@SubscribeMessage('muteUser')
	async muteUser(client: AuthenticatedSocket, data: ActionOnUser)
	{
		try {
			await this.channelManager.muteUser(client, data);
		}
		catch (error) { client.emit('error', error.message) }
	}

	@SubscribeMessage('banUser')
	async banUser(client: AuthenticatedSocket, data: ActionOnUser)
	{
		try {
			await this.channelManager.banUser(client, data);
		}
		catch (error) { client.emit('error', error.message ) }
	}

	@SubscribeMessage('addAdmin')
	async addAdmin(client: AuthenticatedSocket, data: AddAdmin)
	{
		try {
			await this.channelManager.addAdmin(client.login, data);
		}
		catch (error) { client.emit('error', error.message ) }
	}

	@SubscribeMessage('clientInfo')
	async getClientInfoOnChannel(client: AuthenticatedSocket, channelName: string)
	{
		try
		{
			await this.channelManager.sendClientInfo(client, channelName);
		}
		catch (error) { client.emit('error', error.message ) }
	}

	@SubscribeMessage('channelInfo')
	async getChannelInfo(client: AuthenticatedSocket, channelName: string)
	{
		try
		{
			await this.channelManager.sendChannelInfo(client, channelName);
		}
		catch (error) { client.emit('error', error.message ) }
	}

	@SubscribeMessage('sendInvitation')
	async sendInvitation(client: AuthenticatedSocket, data:{channelName: string, mode: GameMode})
	{
		try
		{
			await this.channelManager.sendInvitation(client, data);
		}
		catch (error) { client.emit('error', error.message ) }

	}

	@SubscribeMessage('getActiveChannels')
	getActiveChannels(client: AuthenticatedSocket)
	{
		client.emit('activeChannels', this.channelManager.getActiveChannels());
	}

	@SubscribeMessage('setChannelPassword')
	async setChannelPassword(client: AuthenticatedSocket, data: SetChannelPassword)
	{
		try {
			await this.channelManager.setChannelPassword(client.login, data);
			this.server.emit('activeChannels', this.channelManager.getActiveChannels());
		}
		catch (error) { client.emit('error', error.message ) }
	}

	@SubscribeMessage('unsetChannelPassword')
	async unsetChannelPassword(client: AuthenticatedSocket, channelName: string)
	{
		try {
			await this.channelManager.unsetChannelPassword(client.login, channelName);
		}
		catch (error) { client.emit('error', error.message ) }

	}

	@SubscribeMessage('setPrivateMode')
	async setPrivateMode(client: AuthenticatedSocket, channelName: string)
	{
		try {
			await this.channelManager.setPrivateMode(client.login, channelName);
		}
		catch (error) { client.emit('error', error.message ) }
	}

	@SubscribeMessage('unsetPrivateMode')
	async unsetPrivateMode(client: AuthenticatedSocket, channelName: string)
	{
		try {
			await this.channelManager.unsetPrivateMode(client.login, channelName);
		}
		catch (error) { client.emit('error', error.message ) }

	}

	@SubscribeMessage('inviteClient')
	async inviteClient(client: AuthenticatedSocket, data: InviteClient)
	{
		try {
			console.log("Invited client ", data.clientId);
			await this.channelManager.inviteClient(client.login, data);
		}
		catch (error) { client.emit('error', error.message ) }
	}

	@SubscribeMessage('joinPrivateChat')
	async joinPrivChat(client: AuthenticatedSocket, targetLogin: string)
	{
		try{
			console.log(client.login," joining chat with", targetLogin);
			const chatId = await this.privChatManager.joinPrivChat(client, targetLogin);
			await this.userService.setUserChatId(client.login, chatId);
			console.log("chatting with", targetLogin, "in roomId", chatId);
		}
		catch (error) { client.emit('error', error.message ) }
	}

	@SubscribeMessage('privChatSendMessage')
	async privChatSendMessage(client: AuthenticatedSocket, data: sendMessageDto)
	{
		try {
			await this.privChatManager.sendMessage(client, data)
		}
		catch (error) { client.emit('error', error) }
	}

	@SubscribeMessage('loadConnectedUsers')
	async loadConnectedUsers(client: AuthenticatedSocket)
	{
		try {
			const connectedList = await this.userService.findAll();
			
			let connectedUsers: connectedUser[] = [];
			connectedList.forEach((element) => {
				const user = { intraLogin: element.intraLogin, username: element.username, status: element.status};
				connectedUsers.push(user);
			})
			client.emit('listOfConnectedUsers', connectedUsers);
		}
		catch (error) { client.emit('error', error.message); }
	}

	@SubscribeMessage('blockUser')
	async blockUser(client: AuthenticatedSocket, chatName: string)
	{
		try {
			await this.privChatManager.blockUser(client, chatName);
		}
		catch (error) { client.emit('error', error.message); }
	}

	@SubscribeMessage('unblockUser')
	async unblockUser(client: AuthenticatedSocket, chatName: string)
	{
		try {
			await this.privChatManager.unblockUser(client, chatName);
		}
		catch (error) { client.emit('error', error.message); }
	}

	@SubscribeMessage('getPrivChatInfo')
	async getChatInfo(client: AuthenticatedSocket, chatName: string)
	{
		try {
			await this.privChatManager.getChatInfo(client, chatName);
		}
		catch (error) { client.emit('error', error.message); }
	}
}
