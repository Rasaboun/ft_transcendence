import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChannelManager } from './channel/channel.manager';
import { ActionOnUser, AddAdmin, CreateChannel, InviteClient, JoinChannel, SetChannelPassword } from './types/channel.type';
import { AuthenticatedSocket } from 'src/auth/types/auth.type';
import { AuthService } from 'src/auth/auth.service';
import { PrivChatManager } from './privChat/privChat.manager';
import { forwardRef, Inject } from '@nestjs/common';
import { User } from 'src/typeorm';
import { UsersService } from 'src/users/users.service'
import { GameMode } from 'src/game/types/game.type';
import { use } from 'passport';

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
	
	}

	async handleConnection(client: Socket){
		 console.log(`Client ${client.handshake.auth.login} joined chat socket`);
		await this.authService.initializeSocket(client as AuthenticatedSocket);
		await this.channelManager.joinChannels(client as AuthenticatedSocket);
	}

	async handleDisconnect(client: AuthenticatedSocket) {
		console.log(`Client ${client.login} left server`);
		this.channelManager.terminateSocket(client);
	}

	@SubscribeMessage("session")
	async sendSession(client: AuthenticatedSocket)
	{
		await this.authService.initializeSocket(client as AuthenticatedSocket);
		await this.channelManager.joinChannels(client as AuthenticatedSocket);
	}
	
	@SubscribeMessage('joinChannel')
	async joinChannel(client: AuthenticatedSocket, data: JoinChannel)
	{
		try
		{
			await this.channelManager.joinChannel(client, data);
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

	@SubscribeMessage('privChatCreateChat')
	async createPrivChat(client :AuthenticatedSocket, recieverId: string, content: string)
	{
		try {
			this.privChatManager.createPrivateChat(client.login, recieverId, content)
		}
		catch (error) { client.emit('error', error.message ) }
	}

	@SubscribeMessage('joinPrivateChat')
	async testJoinedPrivChat(client :AuthenticatedSocket, intraLogin: string)
	{
		try{
			console.log("The login : " + intraLogin + " just connected itself to it")
			this.privChatManager.joinPrivChat(client, intraLogin);
		}
		catch (error) { client.emit('error', error.message ) }
	}

	@SubscribeMessage('privChatLoadMessages')
	async privChatLoadMessage(client :AuthenticatedSocket, recieverId: string)
	{
		try {
			client.emit('privChatLoadMessages', this.privChatManager.loadMessages(client.login, recieverId));
		}
		catch (error) { client.emit('error', error.message ) }
	}

	@SubscribeMessage('privChatSendMessage')
	async privChatSendMessage(client :AuthenticatedSocket, recieverIntraLogin: string, message: string)
	{
		try {
			var userReciever: User = (await this.userService.findOneByIntraLogin(recieverIntraLogin));
			// todo ERREUR faux ne peux pas fonctionnner
			var recieverRoom: string = userReciever.roomId
			client.to(client.roomId).to(recieverRoom).emit('privChatSendMessage', (await this.privChatManager.sendMessage(client, client.login, recieverIntraLogin, message)));
		}
		catch (error) { client.emit('error', error.message ) }
	}

	@SubscribeMessage('loadConnectedUsers')
	async loadConnectedUsers(client: AuthenticatedSocket)
	{
		try {
			// on filtre et on envoie uniquement ce qu'il faut
			var connectedList = await this.userService.findAll();
			type tse = {
				intraLogin:string,
				username: string
			}
			var s: tse[] = [];
			var e: tse;
			connectedList.forEach((element) => {
				e = { intraLogin: element.intraLogin, username: element.username};
				s.push(e)
			})
			client.emit('listOfConnectedUsers', s);
		}
		catch (error) { client.emit('error', error.message); }
	}
}
