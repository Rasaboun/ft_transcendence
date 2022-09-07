import { io, Socket } from 'socket.io-client'
import Message from '../Elements/message';
import { ChannelT, messageT } from './chatType';

let socket:Socket

export function initiateSocket(url:string)
{
	socket = io(url);
}

export function getSocket()
{
	return socket
}

export function setSocketManager(socket:Socket)
{
	socket = socket
}

export function createChannel() {
	socket?.emit("createChannel");
}

export function joinChannel(channelId:string) {
	socket?.emit("joinChannel", channelId);
}

export function deleteChannel(channelId:string) {
	socket?.emit("deleteChannel", channelId);
}

export function sendMessage(channelId: string, message: string) {
	socket?.emit("sendMessage", {channelId, message});
}

export function getActiveChannels() {
	socket?.emit("getActiveChannels");
}

export function chatMenuHandler(handleActiveChannels:any, handleChannelCreated:any)
{
        socket.on('channelNotFound', () => {})
		socket.on('activeChannels', (channels:ChannelT) => handleActiveChannels(channels));
        socket.on('channelCreated', () => handleChannelCreated)
}

export function chatHandler(handleMessageReceived:any)
{
        socket.on("msgToChannel", ({sender, content}:messageT) => handleMessageReceived({sender, content}))
        
}
