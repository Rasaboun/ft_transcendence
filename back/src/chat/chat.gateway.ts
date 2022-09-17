import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Channel } from './channel/channel';
import { PrivChat } from './privChat/privChat';
import { ChannelManager } from './channel/channel.manager';
import { Message } from './chat.type';
import { PrivChatManager } from './privChat/privChat.manager';
import { ActionOnUser, AuthenticatedSocket } from './types/channel.type';
import { isDataURI } from 'class-validator';

@WebSocketGateway(8002, { cors: '*', namespace: 'chat' })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	constructor( private channelManager: ChannelManager, private privChatManager: PrivChatManager)
	{}

	@WebSocketServer()
	server;


	afterInit(server: Server) {
		
		this.channelManager.server = server;
	
	}

	handleConnection(client: Socket){
		console.log(`Client ${client.id} joined chat socket`);
		
		this.channelManager.initializeSocket(client as AuthenticatedSocket);
		// todo save it in db to handle privConnection to user
		
	}

	handleDisconnect(client: AuthenticatedSocket) {
		console.log(`Client ${client.id} left server`);
		this.channelManager.terminateSocket(client);
		// todo save it in db to handle privConnection to user
	}

	@SubscribeMessage('createChannel')
	async createChannel(client: AuthenticatedSocket, channelName: string)
	{
		let channel = await this.channelManager.createChannel(client, channelName);
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

	/**
	 * Part dedicated to PrivChat
	 */
	@SubscribeMessage('loadNewPrivChats')
	listNewPrivChatsForUser(client: AuthenticatedSocket, clientId: number)
	{
		// look for a room that has an id like clientId as reciever or sender
		var listOfChats: Array<PrivChat> = this.privChatManager.getOpennedPrivChat(clientId);
		
		// returns all the chats the user can connect to, oppened by others
		// all the chat list is in a string list of room names
		// standart is 'senderId-recieverId'
		var ret_val: Array<string> = [];
		for (var i in listOfChats)
			ret_val.push(listOfChats[i]._senderId + "-" + listOfChats[i]._recieverId);
		// the reciever can now join the rooms, needs to be accepted in each of them
		client.emit("handleNewPrivChat", ret_val);
	}

	@SubscribeMessage('privChatLoadMess')
	privChatLoadMess(client: AuthenticatedSocket, senderId: number, recieverId: number)
	{
		var listOfMessages: Array<Message>;
		this.privChatManager.loadMessages(senderId, recieverId).then((result: Message[]) => {listOfMessages = result});
		// room missing !!
		client.emit("handleNewPrivChatMess", {'messages': listOfMessages, "senderId": senderId, "recieverId": recieverId});
	}
	
	// todo find the right function to get this
	//	@SubscribeMessage('loadUserList')
		
	// room joining and sending and recieving messages over there ?

	@SubscribeMessage('sendPrivateMess')
	sendPrivateChatMess(client: AuthenticatedSocket, recieverId: number, senderId: number, mess: string)
	{
		// check if a private chat exist
		try {
			// function does it all and also sends messageBack, the rooms needs to activated though
			// no chat exists : chat created and added to online chat array
			this.privChatManager.sendMessage(senderId, recieverId, mess);
		}
		catch (error){
			throw Error("Send message failed");
		}
		// return a subscirption to a room ?
	}
}