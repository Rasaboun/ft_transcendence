import { io, Socket } from 'socket.io-client'
import { ActionOnUser, ChannelT, messageT } from './chatType';

let socket:Socket

export function initiateSocket(url:string)
{
	socket = io(url);
}

export function getSocket()
{
	return socket
}

export function setSocketManager(_socket:Socket)
{
	socket = _socket
}

export function createChannel(name:string) {
	socket?.emit("createChannel", name);
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

export function banUser(data: ActionOnUser) {
	socket?.emit("banUser", data);
}

export function muteUser(data: ActionOnUser) {
	socket?.emit("muteUser", data);
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

// Priv chat
export function loadConnectedUsers()
{
	socket?.emit("loadConnectedUsers", ({listOfUsers:Array<string>()}));
}
export function loadPrivChat(test:string)
{
	console.log("LoadPrivatChat called");
    socket?.emit("joinUserPrivatChat", test);
}
