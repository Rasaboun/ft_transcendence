import { io, Socket } from 'socket.io-client'
import { ActionOnUser, AddAdminT, channelFormT, ChannelT, ClientInfoT, InviteClientT, JoinChannelT, messageT, SetChannelPasswordT } from '../chat/ChatUtils/chatType';
import { availableLobbiesT, Ball, gameCollionInfoT, GameData, GameMode, GameOptions, GameSettings, Player, playerT } from '../game/GameUtils/type';
import { getToken } from './utils';

let socket:Socket
let chatSocket:Socket
let gameSocket:Socket

export async function initiateSocket(url:string)
{
	let token = getToken();
	if (!token)
		return;
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
	console.log(chatSocket)
	return chatSocket
}


export function getGameSocket()
{
	return gameSocket
}

export function appSocketRoutine(handleSession:any,
								handleGameOver:any) {

	chatSocket.on("connect", () => {
		console.log("In connect", new Date());
		chatSocket.emit("session");
	})
	chatSocket.on("session", (sessionInfo:{sessionId:string, userId:string}) => handleSession(sessionInfo, chatSocket));
	chatSocket.on("connect_error", (err) => {console.log(`connect_error due to ${err.message}`)});
	chatSocket.on("Connect_failed", (err) => {console.log(`connect_error due to ${err.message}`)});
	chatSocket.on("Error", (err) => {console.log(`connect_error due to ${err.message}`)});
	chatSocket.on("Reconnect_failed", (err) => {console.log(`connect_error due to ${err.message}`)});
	chatSocket.on("msgToChannel", (msg:messageT) => {console.log(`message receive from ${msg.sender?.username}`)})
	gameSocket.on('gameOver', (winnerId: string) => handleGameOver(winnerId))
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
	console.log("In client info", chatSocket.connected)
	chatSocket?.emit("clientInfo", channelName);
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

export function sendInvitation(data:{channelName: string, mode: GameMode}) {
	console.log(data)
	chatSocket?.emit("sendInvitation", data);
}

export function chatMenuHandler(handleActiveChannels:any, handleChannelJoined:any, handleError:any, handleInvitation:any, handleSession:any)
{
		console.log(chatSocket)

	//console.log(`Server is down`);
		chatSocket.on('activeChannels', (channels:ChannelT) => handleActiveChannels(channels));
        chatSocket.on('joinedChannel', ({clientId, channelInfo}) => handleChannelJoined({clientId, channelInfo}))
        chatSocket.on('error', (message:string) => handleError(message))
        chatSocket.on('InvitedToChannel', (message:string) => handleInvitation(message))
		chatSocket.on("session", (sessionInfo:{sessionId:string, userId:string}) => handleSession(sessionInfo, chatSocket));
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
							handleConnected:any)
{
		
        chatSocket.on("msgToChannel", (msg:messageT) => handleMessageReceived(msg))      
        chatSocket.on('channelDeleted', (message:string) => handleChannelDeleted(message))
        chatSocket.on('clientInfo', (data:ClientInfoT) => handleClientInfo(data))
        chatSocket.on('bannedFromChannel', (data:ActionOnUser) => handleBannedFromChannel(data))
        chatSocket.on('mutedInChannel', (data:ActionOnUser) => handleMutedFromChannel(data))
        chatSocket.on('addAdmin', (data: {target: string, channelInfo: ChannelT}) => handleAddAdmin(data))
        chatSocket.on('joinedChannel', ({clientId, channelInfo}) => handleChannelJoined({clientId, channelInfo}))
        chatSocket.on('leftChannel', (channelInfo:ChannelT) => handleLeftChannel(channelInfo))
        chatSocket.on('newOwner', (data: {target: string, channelInfo: ChannelT}) => newOwner(data))
        chatSocket.on('isAlreadyAdmin', handleIsAlreadyAdmin)
        chatSocket.on('connect', handleConnected)
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
	console.log(gameSocket)
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