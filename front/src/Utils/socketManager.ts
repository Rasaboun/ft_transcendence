import { io, Socket } from 'socket.io-client'
import { ActionOnUser, AddAdminT, channelFormT, ChannelT, ChatInfoT, ClientInfoT, InviteClientT, JoinChannelT, messageT, sendMessageDto, SetChannelPasswordT } from '../chat/ChatUtils/chatType';
import { availableLobbiesT, Ball, gameCollionInfoT, GameData, GameMode, GameOptions, GameSettings, Player, playerT } from '../game/GameUtils/type';
import { getToken } from './utils';

let socket:Socket
let chatSocket:Socket
let gameSocket:Socket

export async function initiateSocket()
{
	let token = getToken();
	if (!token)
		return;
	const url = `${process.env.REACT_APP_BACK_ADDRESS}:${process.env.REACT_APP_SOCKET_PORT}`
	token = JSON.parse(token);	
	if (!chatSocket)
	{
		chatSocket = io(`${url}/chat`, {
			autoConnect: true,
			auth:	{ token },
			}).connect();
	}

	if (!gameSocket)
	{
		gameSocket = io(`${url}/game`, {
			autoConnect: true,
			auth:	{ token }
			})

	}
}

export function getChatSocket()
{
	return chatSocket
}


export function getGameSocket()
{
	return gameSocket
}


export function appSocketRoutine(
								handleError:any,
								handleConnectionError:any,
								userNotFound:any
								) {

	chatSocket.on("connect_error", (err) => {handleConnectionError()});

	chatSocket.on('UserNotFound', (err) => {userNotFound()});
	
	chatSocket.on("Connect_failed", (err) => {console.log(`connect_error due to ${err.message}`)});
	chatSocket.on('error', (message:string) => handleError(message))	
	chatSocket.on("Reconnect_failed", (err) => {console.log(`connect_error due to ${err.message}`)});
	chatSocket.on('channelDeleted', (message:string) =>handleError(message))
}

export function createChannel(channelForm:channelFormT) {
	chatSocket?.emit("createChannel", channelForm);
}

export function joinChannel(data:JoinChannelT) {
	chatSocket?.emit("joinChannel", data);
}

export function leaveChannel(channelName:string) {
	chatSocket?.emit("leaveChannel", channelName);
}

export function deleteChannel(channelId:string) {
	chatSocket?.emit("deleteChannel", channelId);
}

export function sendMessage(channelId: string, message: string) {
	chatSocket?.emit("sendMessage", {channelId, message});
}

export function getActiveChannels() {
	chatSocket?.emit("getActiveChannels");
}

export function getClientInfo(channelName:string) {
	chatSocket?.emit("clientInfo", channelName);
}

export function getChannelInfo(channelName:string) {
	chatSocket?.emit("channelInfo", channelName)
}

export function banUser(data: ActionOnUser) {
	chatSocket?.emit("banUser", data);
}

export function muteUser(data: ActionOnUser) {
	chatSocket?.emit("muteUser", data);
}

export function inviteClient(data: InviteClientT) {
	chatSocket?.emit("inviteClient", data);
}

export function addAdmin(data:AddAdminT) {
	chatSocket?.emit("addAdmin", data);
}

export function setChannelPassword(data:SetChannelPasswordT) {
	chatSocket?.emit("setChannelPassword", data);
}

export function unsetChannelPassword(channelName: string) {
	chatSocket?.emit("unsetChannelPassword", channelName);
}

export function setPrivateMode(channelName: string) {
	chatSocket?.emit("setPrivateMode", channelName);
}

export function unsetPrivateMode(channelName: string) {
	chatSocket?.emit("unsetPrivateMode", channelName);
}


export function getUsers()
{
	chatSocket?.emit("loadConnectedUsers");
}

export function updateSocket(channelName: string)
{
	chatSocket?.emit("updateSocket", channelName);
}

export function sendInvitation(data:{channelName: string, mode: GameMode}) {
	chatSocket?.emit("sendInvitation", data);
}

export function chatMenuHandler(handleActiveChannels:any,
								handleChannelJoined:any,
								handleInvitation:any,)
{
	chatSocket.on('activeChannels', (channels:ChannelT) => handleActiveChannels(channels));
	chatSocket.on('joinedChannel', ({clientId, channelInfo}) => handleChannelJoined({clientId, channelInfo}))
	chatSocket.on('InvitedToChannel', (message:string) => handleInvitation(message))
}

export function chatHandler(handleMessageReceived:any,
							handleChannelDeleted:any,
							handleClientInfo:any,
							handleBannedFromChannel:any,
							handleMutedFromChannel:any,
							handleAddAdmin:any,
							handleLeftChannel:any,
							newOwner:any,
							handleIsAlreadyAdmin:any,
							handleChannelJoined:any,
							handleChannelInfo:any)
{
	chatSocket.on("msgToChannel", (msg:messageT) => {handleMessageReceived(msg)})      
	chatSocket.on('channelDeleted', (message:string) => handleChannelDeleted(message))
	chatSocket.on('clientInfo', (data:ClientInfoT) => handleClientInfo(data))
	chatSocket.on('bannedFromChannel', (data:ActionOnUser) => handleBannedFromChannel(data))
	chatSocket.on('mutedInChannel', (data:ActionOnUser) => handleMutedFromChannel(data))
	chatSocket.on('addAdmin', (data: {target: string, channelInfo: ChannelT}) => handleAddAdmin(data))
	chatSocket.on('joinedChannel', ({clientId, channelInfo}) => handleChannelJoined({clientId, channelInfo}))
	chatSocket.on('leftChannel', (data: {login: string, channelInfo:ChannelT}) => {console.log('received left');handleLeftChannel(data)})
	chatSocket.on('channelInfo', (info:ChannelT) => handleChannelInfo(info))
	chatSocket.on('newOwner', (data: {target: string, channelInfo: ChannelT}) => newOwner(data))
	chatSocket.on('isAlreadyAdmin', handleIsAlreadyAdmin)
}



//////////////// PRIV CHAT /////////////////////


export function getChatInfo(chatName: string){
	chatSocket?.emit('getPrivChatInfo', chatName);
}

export function joinPrivChat(intraLogin: string)
{
	chatSocket?.emit("joinPrivateChat", intraLogin)
}

export function sendPrivMessage(data: sendMessageDto)
{
	chatSocket?.emit("privChatSendMessage",  data);
}

export function blockInChat(chatName: string)
{
	chatSocket?.emit('blockUser', chatName);
}

export function unblockInChat(chatName: string)
{
	chatSocket?.emit('unblockUser', chatName);
}

export function privChatMenuHandler(
	loadConnectedUser:any,
	)
{
chatSocket.on("listOfConnectedUsers", (userList:{intraLogin: string, username: string}[]) => loadConnectedUser(userList));
}

export function chatHandlerPrivEl(handlePrivMessageReceived:any,
									handlePrivChatJoined: any,
									handleChatInfo:any,)
{
	chatSocket.on("msgToPrivChat", (msg:messageT) => handlePrivMessageReceived(msg))   
	chatSocket.on("joinedPrivChat", (chatInfo: ChatInfoT) => handlePrivChatJoined(chatInfo))
	chatSocket.on('privChatInfo', (data:ChatInfoT) => handleChatInfo(data))
}


//////////////// GAME SOCKET /////////////////////

export function joinQueue(mode:GameMode) {
	gameSocket?.emit("joinedQueue", mode);
	
}

export function playerMoved(value:number)
{
	gameSocket?.emit("playerMoved", value);
} 


export function sendPosition(player:playerT) {
	gameSocket?.emit("playerPosChanged", player);
}

export function sendCollisionInfo(collisionInfo:gameCollionInfoT) {
	gameSocket?.emit("gameCollisionChange", collisionInfo);
}

export function startGame()
{
	gameSocket?.emit("startGame");
}

export function loadGame()
{
	gameSocket?.emit("loadGame");
}

export function spectacteGame(id:string)
{
	gameSocket?.emit("spectacteGame", id);
}

export function getActiveGames()
{
	gameSocket?.emit("getActiveGames")
}


export function leftPong()
{
	gameSocket?.emit("leftPong")
}

export function createLobby(options:GameOptions) 
{
	gameSocket?.emit("createLobby", options)
}

export function joinInvitation(sender: string) {
	gameSocket?.emit("joinInvitation", sender);
}

export function GameMenuHandler(
			handleAvailableLobbies:any,
			handleGoalScored:any,
			handleSession:any,
			handleWaitingForOpponent:any)
{
	gameSocket.on('activeGames',(availableLobbies:availableLobbiesT) => handleAvailableLobbies(availableLobbies))
	gameSocket.on('goalScored', (players: any) => handleGoalScored(players));
	gameSocket.on("session", (sessionInfo:{sessionId:string, userId:string}) => handleSession(sessionInfo, gameSocket));
	gameSocket.on("waitingForOpponent", () => handleWaitingForOpponent());
}


export function GameRoutineHandler(handleWait:any,
									handleUpdateBall:any,
									updatePaddle:any,
									handleGameReady:any,
									handleGameData:any,
									handleGoalScored:any,
									handleSpectateSuccess:any,
									handleGameOver:any,
									handleSession:any,
									handleInvitationExpired:any) 
{	
	gameSocket.on('waitingForOpponent', handleWait)
	gameSocket.on('updateBall', (ball:Ball) => handleUpdateBall(ball))
	gameSocket.on('updatePaddle', (data:{playerId:string, newPos:number}) => updatePaddle(data))
	gameSocket.on('gameReady', (data: {gameData: GameData, gameSettings: GameSettings}) => handleGameReady(data))
	gameSocket.on('gameData', (data: {gameData: GameData, gameSettings: GameSettings}) => handleGameData(data))
	gameSocket.on('goalScored', (scores: {player1: number, player2: number}) => handleGoalScored(scores))
	gameSocket.on('spectateSuccess', (players: Player[]) => handleSpectateSuccess(players))
	gameSocket.on('gameOver', (winnerId: string) => handleGameOver(winnerId))
	gameSocket.on("session", (sessionInfo:{sessionId:string, userId:string}) => handleSession(sessionInfo, gameSocket));
	gameSocket.on("invitationExpired", (msg:string) => handleInvitationExpired(msg));

}

export function Menucleaner(handleAvailableLobbies:any,
							handleGoalScored:any) {
		gameSocket.off('activeGames',(availableLobbies:availableLobbiesT) => handleAvailableLobbies(availableLobbies))
		gameSocket.off('goalScored', (players: any) => handleGoalScored(players));
}

export function GameCleaner(handleWait:any,
							handleUpdateBall:any,
							updatePaddle:any,
							handleGameReady:any,
							handleGameData:any,
							handleGoalScored:any,
							handleSpectateSuccess:any,
							handleGameOver:any,
							handleSession:any)
{
	gameSocket.off('waitingForOppoffent', handleWait)
	gameSocket.off('updateBall', (ball:Ball) => handleUpdateBall(ball))
	gameSocket.off('updatePaddle', ({playerId, newPos}) => updatePaddle(playerId, newPos))
	gameSocket.off('gameReady', (data: GameData) => handleGameReady(data))
	gameSocket.off('gameData', (data: {gameData: GameData, gameSettings: GameSettings}) => handleGameData(data))
	gameSocket.off('goalScored', (players: Player[]) => handleGoalScored(players))
	gameSocket.off('spectateSuccess', (players: Player[]) => handleSpectateSuccess(players))
	gameSocket.off('gameOver', (winnerId: string) => handleGameOver(winnerId))
	gameSocket.off("session", (sessionInfo:{sessionId:string, userId:string}) => handleSession(sessionInfo, socket));
}