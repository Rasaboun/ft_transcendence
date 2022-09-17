import { io, Socket } from 'socket.io-client'
import {playerT, gameCollionInfoT, availableLobbiesT} from "./type"

let socket:Socket

export function initiateSocket(url:string)
{
	socket = io(url);
}

export function joinQueue(player:playerT) {
	socket?.emit("joinedQueue", player);
	
}

export function sendPosition(player:playerT) {
	socket?.emit("playerPosChanged", player);
}

export function sendCollisionInfo(collisionInfo:gameCollionInfoT) {
	socket?.emit("gameCollisionChange", collisionInfo);
}

export function startGame(gameCollisionInfo:gameCollionInfoT)
{

	socket?.emit("startGame", gameCollisionInfo);
}

export function spectacteGame(id:string)
{
	console.log('Emit spectacte');
	socket?.emit("spectacteGame", id);
}

// export function listenGame(handleWait:any,
// 							handleStart:any,
// 							handleUpdate:any,
// 							handleGameResult:any,
// 							handleError:any)
// {
// 	socket.on("connect", () => {
// 		socket.on('watingForOpponent', handleWait)
// 		socket.on('gameReady', (id:string) => handleStart(id))
// 		socket.on('collisionUpdate', () => sendCollisionInfo({
// 			player1PaddleZone: utils.getPaddleContactZone("player1"),
// 			player2PaddleZone: utils.getPaddleContactZone("player2"),
// 			ballZone: utils.getContactZone(),
// 			borderZone: utils.getContactZone(),
// 			innerHeight: window.innerHeight,
// 			innerWidth: window.innerWidth
// 		}))
// 		socket.on('stateUpdate',(updateInfo:updateInfoT) => handleUpdate(updateInfo))
// 		socket.on('Result',(winnerId:string) => handleGameResult(winnerId))
// 		socket.on('lobbyNotFound',(errorMessage:string) => handleError(errorMessage))
// 		//newSocket.on('goalScored', (idScorer:string) => handleGoal(idScorer))
		
// 	})
// }

export function GameMenuHandler(handleAvailableLobbies:any, handleGoalScored:any)
{
	socket.on("connect", () => {
		socket.on('activeGames',(availableLobbies:availableLobbiesT) => handleAvailableLobbies(availableLobbies))
		})
		socket.on('goalScored', (players: any) => handleGoalScored(players));

}


export function getActiveGames()
{
	socket?.emit("getActiveGames")
}

export function cleanUp() {
	socket.off('connect');
	socket.off('watingForOpponent');
	socket.off('gameReady');
	socket.off('stateUpdate');
	socket.off('collisionUpdate');
}

export function getSocket()
{
	return socket
}