import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Channel } from './channel/channel';
import { ChannelManager } from './channel/channel.manager';
import { SessionManager } from './sessions/sessions.manager';
import { ActionOnUser, AddAdmin, AuthenticatedSocket, CreateChannel, InviteClient, JoinChannel, SetChannelPassword } from './types/channel.type';


@WebSocketGateway(8002, { cors: '*', namespace: 'chat' })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	constructor(
				private channelManager: ChannelManager,
				private sessionManager: SessionManager,
			)
	{}

	@WebSocketServer()
	server;


	afterInit(server: Server) {
		
		this.channelManager.server = server;
		this.channelManager.initChannels();
	
	}

	async handleConnection(client: Socket){
		console.log(`Client ${client.handshake.auth.login} joined chat socket`);
		this.sessionManager.initializeSocket(client as AuthenticatedSocket);
		await this.channelManager.joinChannels(client as AuthenticatedSocket);
		//console.log(client);
	}

	async handleDisconnect(client: AuthenticatedSocket) {
		console.log(`Client ${client.login} left server`);
		this.channelManager.terminateSocket(client);
		
	}

	@SubscribeMessage('joinChannel')
	async joinChannel(client: AuthenticatedSocket, data: JoinChannel)
	{
		try
		{
			await this.channelManager.joinChannel(client, data);
		}
		catch (error) { client.emit('error', error.message ) }
		console.log(`Client ${client.login} joined channel ${data.channelName}`)
	}

	@SubscribeMessage('leaveChannel')
	async leaveChannel(client: AuthenticatedSocket, channelName: string)
	{
		try
		{
			await this.channelManager.leaveChannel(client.login, channelName);
		}
		catch (error) { client.emit('error', error.message ) }
		console.log(`Client ${client.id} left channel ${channelName}`)
	}

	@SubscribeMessage('createChannel')
	async createChannel(client: AuthenticatedSocket, data: CreateChannel)
	{
		try {
			const channel = await this.channelManager.createChannel(client, data);
			channel.addClient(client.login, client.roomId);
			client.emit("channelCreated", channel.getInfo());
			this.server.emit('activeChannels', this.channelManager.getActiveChannels());
		}
		catch (error) { return client.emit('error', error.message)}
	}

	@SubscribeMessage('deleteChannel')
	deleteChannel(client: AuthenticatedSocket, channelId: string)
	{
		try
		{
			this.channelManager.deleteChannel(channelId);
			this.server.emit('activeChannels', this.channelManager.getActiveChannels());
		}
		catch (error) { client.emit('error', error.message ) }
		console.log(`Client ${client.id} deleted channel ${channelId}`)

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
			await this.channelManager.muteUser(client.login, data);
		}
		catch (error) { client.emit('error', error.message) }
	}

	@SubscribeMessage('banUser')
	async banUser(client: AuthenticatedSocket, data: ActionOnUser)
	{
		try {
			await this.channelManager.banUser(client.login, data);
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
			await this.channelManager.inviteClient(client.login, data);
		}
		catch (error) { client.emit('error', error.message ) }
	}
}
