import { io, Socket } from 'socket.io-client'
import { channelFormT } from './chatType';
import { ActionOnUser, AddAdminT, ChannelT, ClientInfoT, InviteClientT, JoinChannelT, messageT, SetChannelPasswordT } from './chatType';

let socket:Socket

export function initiateSocket(url:string, setSocket:any, sessioninfo?:{sessionId:string, roomId:string}, login?:string)
{
	socket = io(url, { autoConnect: false });
	setSocket(socket)
	console.log("sessionInfo", sessioninfo);
	if (sessioninfo)
		socket.auth = sessioninfo;
	else
		socket.auth = { login } 
	socket.connect();
}

export function getSocket()
{
	return socket
}

export function setSocketManager(socket:Socket)
{
	socket = socket
}

export function createChannel(channelForm:channelFormT) {
	socket?.emit("createChannel", channelForm);
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

export function getClientInfo(channelName:string) {
	socket?.emit("clientInfo", channelName);
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

export function unsetPrivateMode(channelName: string) {
	socket?.emit("unsetPrivateMode", channelName);
}

export function chatMenuHandler(handleActiveChannels:any, handleChannelJoined:any, handleError:any, handleInvitation:any, handleSession:any)
{
	console.log(`Server is down`);
		socket.on("connect_error", (err) => {
		})
		socket.on('activeChannels', (channels:ChannelT) => handleActiveChannels(channels));
        socket.on('joinedChannel', ({clientId, channelInfo}) => handleChannelJoined({clientId, channelInfo}))
        socket.on('error', (message:string) => handleError(message))
        socket.on('InvitedToChannel', (message:string) => handleInvitation(message))
		socket.on("session", (sessionInfo:{sessionId:string, userId:string}) => handleSession(sessionInfo, socket));
}

export function chatHandler(handleMessageReceived:any,
							handleChannelDeleted:any,
							handleClientInfo:any,
							handleBannedFromChannel:any,
							handleMutedFromChannel:any,
							handleAddAdmin:any,
							handleLeftChannel:any,
							handleUpgradeToOwner:any,
							handleIsAlreadyAdmin:any,
							handleSession:any,
							handleChannelJoined:any)
{
        socket.on("msgToChannel", (msg:messageT) => handleMessageReceived(msg))      
        socket.on('channelDeleted', (message:string) => handleChannelDeleted(message))
        socket.on('clientInfo', (data:ClientInfoT) => handleClientInfo(data))
        socket.on('bannedFromChannel', (data:ActionOnUser) => handleBannedFromChannel(data))
        socket.on('mutedInChannel', (data:ActionOnUser) => handleMutedFromChannel(data))
        socket.on('addAdmin', handleAddAdmin)
        socket.on('joinedChannel', ({clientId, channelInfo}) => handleChannelJoined({clientId, channelInfo}))
        socket.on('leftChannel', (channelInfo:ChannelT) => handleLeftChannel(channelInfo))
        socket.on('upgradeToOwner', (channelName:string) => handleUpgradeToOwner(channelName))
        socket.on('isAlreadyAdmin', handleIsAlreadyAdmin)
		socket.on("session", (sessionInfo:{sessionId:string, userId:string}) => handleSession(sessionInfo, socket));

}
