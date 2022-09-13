import { io, Socket } from 'socket.io-client'
import Message from '../Elements/message';
import { ActionOnUser, AddAdminT, ChannelT, ClientInfoT, InviteClientT, JoinChannelT, messageT, SetChannelPasswordT } from './chatType';

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

export function createChannel(name:string) {
	socket?.emit("createChannel", name);
}

export function joinChannel(data:JoinChannelT) {
	socket?.emit("joinChannel", data);
}

export function leaveChannel(channelName:string) {
	socket?.emit("leaveChannel", channelName);
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

export function inviteClient(data: InviteClientT) {
	socket?.emit("inviteClient", data);
}

export function addAdmin(data:AddAdminT) {
	socket?.emit("addAdmin", data);
}

export function setChannelPassword(data:SetChannelPasswordT) {
	socket?.emit("setChannelPassword", data);
}

export function unsetChannelPassword(channelName: string) {
	socket?.emit("unsetChannelPassword", channelName);
}

export function setPrivateMode(channelName: string) {
	socket?.emit("setPrivateMode", channelName);
}

export function chatMenuHandler(handleActiveChannels:any, handleChannelCreated:any, handleChannelJoined:any, handleError:any, handleInvitation:any)
{
        socket.on('channelNotFound', () => {})
		socket.on('activeChannels', (channels:ChannelT) => handleActiveChannels(channels));
        socket.on('channelCreated', () => handleChannelCreated)
        socket.on('joinedChannel', ({clientId, channelId}) => handleChannelJoined({clientId, channelId}))
        socket.on('error', (message:string) => handleError(message))
        socket.on('InvitedToChannel', (message:string) => handleInvitation(message))
}

export function chatHandler(handleMessageReceived:any, handleChannelDeleted:any, handleClientInfo:any, handleBannedFromChannel:any, handleMutedFromChannel:any, handleAddAdmin:any)
{
        socket.on("msgToChannel", ({sender, content}:messageT) => handleMessageReceived({sender, content}))      
        socket.on('channelDeleted', (message:string) => handleChannelDeleted(message))
        socket.on('clientInfo', (data:ClientInfoT) => handleClientInfo(data))
        socket.on('bannedFromChannel', (id:string) => handleBannedFromChannel(id))
        socket.on('mutedInChannel', (data:ClientInfoT) => handleMutedFromChannel(data))
        socket.on('addAdmin', handleAddAdmin)
		
}
