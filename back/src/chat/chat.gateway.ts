import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Channel } from './channel/channel';
import { ChannelManager } from './channel/channel.manager';
import { ActionOnUser, AddAdmin, AuthenticatedSocket, InviteClient, JoinChannel, SetChannelPassword } from './types/channel.type';


@WebSocketGateway(8002, { cors: '*', namespace: 'chat' })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	constructor( private channelManager: ChannelManager)
	{}

	@WebSocketServer()
	server;


	afterInit(server: Server) {
		
		this.channelManager.server = server;
	
	}

	handleConnection(client: Socket){
		console.log(`Client ${client.id} joined chat socket`);
		
		this.channelManager.initializeSocket(client as AuthenticatedSocket);
		
	}

	handleDisconnect(client: AuthenticatedSocket) {
		console.log(`Client ${client.id} left server`);
		this.channelManager.terminateSocket(client);
		
	}

	@SubscribeMessage('createChannel')
	async createChannel(client: AuthenticatedSocket, channelName: string)
	{
		try {
			const channel = await this.channelManager.createChannel(client, channelName);
			channel.addClient(client);
			client.emit("channelCreated", channel.id);
		}
		catch (error) { return client.emit('error', error.message)}
	}

	@SubscribeMessage('joinChannel')
	async joinChannel(client: AuthenticatedSocket, data: JoinChannel)
	{
		try
		{
			await this.channelManager.joinChannel(client, data);
		}
		catch (error) { client.emit('error', error.message ) }
		console.log(`Client ${client.id} joined channel ${data.channelName}`)
	}

	@SubscribeMessage('deleteChannel')
	deleteChannel(client: AuthenticatedSocket, channelId: string)
	{
		try
		{
			this.channelManager.deleteChannel(channelId);
		}
		catch (error) { client.emit('error', error.message ) }
		console.log(`Client ${client.id} deleted channel ${channelId}`)

	}

	@SubscribeMessage('sendMessage')
	async sendMessage(client: AuthenticatedSocket, data: {channelId, message})
	{
		try {
			await this.channelManager.sendMessage(data.channelId, {sender: client.id, content: data.message});
		}
		catch (error) { client.emit('error', error.message ) }

	}

	@SubscribeMessage('muteUser')
	async muteUser(client: AuthenticatedSocket, data: ActionOnUser)
	{
		try {
			await this.channelManager.muteUser(client.id, data);
		}
		catch (error) { client.emit('error', error.message) }
	}

	@SubscribeMessage('banUser')
	async banUser(client: AuthenticatedSocket, data: ActionOnUser)
	{
		try {
			await this.channelManager.banUser(client.id, data);
		}
		catch (error) { client.emit('error', error.message ) }
	}

	@SubscribeMessage('addAdmin')
	async addAdmin(client: AuthenticatedSocket, data: AddAdmin)
	{
		try {
			await this.channelManager.addAdmin(client.id, data);
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
			await this.channelManager.setChannelPassword(client.id, data);
		}
		catch (error) { client.emit('error', error.message ) }
	}

	@SubscribeMessage('unsetChannelPassword')
	async unsetChannelPassword(client: AuthenticatedSocket, channelName: string)
	{
		try {
			await this.channelManager.unsetChannelPassword(client.id, channelName);
		}
		catch (error) { client.emit('error', error.message ) }

	}

	@SubscribeMessage('setPrivateMode')
	async setPrivateMode(client: AuthenticatedSocket, channelName: string)
	{
		try {
			await this.channelManager.setPrivateMode(client.id, channelName);
		}
		catch (error) { client.emit('error', error.message ) }
	}

	@SubscribeMessage('inviteClient')
	async inviteClient(client: AuthenticatedSocket, data: InviteClient)
	{
		try {
			await this.channelManager.inviteClient(client.id, data);
		}
		catch (error) { client.emit('error', error.message ) }
	}
}
