import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChannelManager } from './channel/channel.manager';
import { ActionOnUser, AddAdmin, CreateChannel, InviteClient, JoinChannel, SetChannelPassword } from './types/channel.type';
import { AuthenticatedSocket } from 'src/auth/types/auth.type';
import { AuthService } from 'src/auth/auth.service';
import { forwardRef, Inject } from '@nestjs/common';

@WebSocketGateway(8002, { cors: '*', namespace: 'chat' })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	constructor(
				private channelManager: ChannelManager,
				@Inject(forwardRef(() => AuthService))
				private authService: AuthService,
			)
	{}

	@WebSocketServer()
	server: Server;


	afterInit(server: Server) {
		
		this.channelManager.server = server;
		this.channelManager.initChannels();
	
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
}
