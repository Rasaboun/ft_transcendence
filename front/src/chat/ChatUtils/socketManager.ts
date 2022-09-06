import { io, Socket } from 'socket.io-client'
import Message from '../Elements/message';
import { ChannelT } from './chatType';

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

export function joinChannel() {
	socket?.emit("joinChannel");
}

export function deleteChannel(channelId:string) {
	socket?.emit("deleteChannel", channelId);
}

export function sendMessage(channelId: string, message: string) {
	socket?.emit("sendMessage", channelId, message);
}

export function getActiveChannels() {
	socket?.emit("getActiveChannels");
}

export function chatMenuHandler(handleActiveChannels:any)
{
        socket.on('channelNotFound', () => {})
		socket.on('activeChannels', (channels:ChannelT) => handleActiveChannels(channels));
}

export function chatHandler(handleMessageReceived:any)
{
        socket.on("msgToChannel", (sender: string, content: string) => handleMessageReceived(sender, content))
}
