import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Channel } from './channel/channel';
import { ChannelManager } from './channel/channel.manager';
import { ActionOnUser, AuthenticatedSocket } from './types/channel.type';


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
	async createChannel(client: AuthenticatedSocket)
	{
		let channel = await this.channelManager.createChannel(client);
		channel.addClient(client);
		client.emit("channelCreated", channel.id);
	}

	@SubscribeMessage('joinChannel')
	joinChannel(client: AuthenticatedSocket, channelId: string)
	{
		try
		{
			this.channelManager.joinChannel(client, channelId);
		}
		catch (error) { client.emit('channelNotFound', error.message ) }
		console.log(`Client ${client.id} joined channel ${channelId}`)
	}

	@SubscribeMessage('deleteChannel')
	deleteChannel(client: AuthenticatedSocket, channelId: string)
	{
		try
		{
			this.channelManager.deleteChannel(channelId);
		}
		catch (error) { client.emit('channelNotFound', error.message ) }
		console.log(`Client ${client.id} deleted channel ${channelId}`)

	}

	@SubscribeMessage('sendMessage')
	sendMessage(client: AuthenticatedSocket, data: {channelId, message})
	{
		try {
			this.channelManager.sendMessage(data.channelId, {sender: client.id, content: data.message});
		}
		catch (error) { client.emit('channelNotFound', error.message ) }

	}

	@SubscribeMessage('muteUser')
	muteUser(client: AuthenticatedSocket, data: ActionOnUser)
	{
		try {
			this.channelManager.muteUser(client.id, data);
		}
		catch (error) { client.emit('channelNotFound', error.message ) }
	}

	@SubscribeMessage('banUser')
	banUser(client: AuthenticatedSocket, data: ActionOnUser)
	{
		try {
			this.channelManager.banUser(client.id, data);
		}
		catch (error) { client.emit('channelNotFound', error.message ) }
	}

	@SubscribeMessage('getActiveChannels')
	getActiveChannels(client: AuthenticatedSocket)
	{
		client.emit('activeChannels', this.channelManager.getActiveChannels());
	}

}
