import React, {useState, useEffect, useRef, useContext} from "react"
import Score from "../Elements/score"
import * as utils from "../GameUtils/GameUtils"
import "../game.css"
import { GameSettings, GameData, GameState, Player, Ball} from "../GameUtils/type"
// import {ThreeDots} from "react-loader-spinner";
import { Socket } from 'socket.io-client'
import { GameContext } from "../GameContext/gameContext"
import useLocalStorage from "../../hooks/localStoragehook"
import { getSession } from "../../Utils/utils"
import { GameCleaner, GameRoutineHandler, getChatSocket, getGameSocket, initiateSocket, leftPong, playerMoved, startGame } from "../../Utils/socketManager"
import { SocketContext } from "../../Context/socketContext"

let canvas:HTMLCanvasElement

export default function Game()
{
	const {storage, setStorage} = useLocalStorage("user")
	const {gameState, setGameState, gameSocket, setChatSocket, setGameSocket} = useContext(SocketContext)
	let context: CanvasRenderingContext2D;
	const canvasRef = useRef<HTMLCanvasElement>(null);
	
	const [gameData, setGameData] = useState<GameData>({
		players: [{
			id: "",
			pos: 1080 / 2,
			score: 0,
		}, 
		{
			id: "",
			pos: 1080 / 2,
			score: 0,

		}],
		ball : {
			x: 1920 / 2,
			y: 1080 / 2,
			speed: 0.01,
			delta: {x: 0, y: 0},
			radius: 10,
		},
		winnerId: ""
		//state: GameState.Waiting,
	});

	const [gameSettings, setGameSettings] = useState<GameSettings>({
		scoreToWin: 5,
		paddleWidth: 50,
		paddleHeight: 50,
		width: 1920,
		height: 1080,
	});

	const handleWait = () => {
		setGameState(GameState.Waiting)
		// setGameData((oldGameData) => ({
		// 	...oldGameData,
		// 	state: GameState.Waiting
		// 	})
		// )
	}

	// async function sendData ()
	// {
	// 	//INFO SUR LA PARTIE A ENVOYER A LA BASE DE DONNÉE
	// 	//DES INFO PEUVENT MANQUÉ
	// 	const gameInfoToSend:any = {
	// 		scoreToWin: gameSettings.scoreToWin,
	// 		player1id: gameData.players[0].id,
	// 		player2id: gameData.players[0].id,
	// 		player1score: gameData.players[0].score,
	// 		player2score: gameData.players[1].score,
	// 		winnerId: gameData.winnerId
	// 	}
	// 	console.log(JSON.stringify(gameData))
		//EXEMPLE D'ENVOIE EN COMMENTAIRE A TESTER
	// 	const url:string = "http://localhost:3000/game"
	// 	await fetch(url, {
    //     method: 'POST',
    //     body: JSON.stringify(gameData)
    //   }).then(function(response) {
    //     console.log(response)
    //     return response.json();
    //   });
 
	// }
	function initializeGame()
	{
		setGameData({
			players: [{
				id: '',
				pos: canvas.height / 2,
				score: 0,
			}, 
			{
				id: "",
				pos: canvas.height / 2,
				score: 0,
	
			}],
			ball : {
				x: canvas.width / 2,
				y: canvas.height / 2,
				speed: 0.01,
				delta: {x: 0, y: 0},
				radius: 10,
			},
			//state: GameState.Waiting,
			winnerId: ""
		})
		setGameSettings({
			scoreToWin: 5,
			paddleWidth: 20,
			paddleHeight: utils.toScale(200, canvas.height / 1080),
			width: 1920,
			height: 1080,
		})
		setGameState(GameState.Waiting)
	}
	const handleSession = (sessionInfo:{ sessionId:string, roomId:string }, sock:Socket) => {
		if (sock)
		{
			setStorage("sessionId", sessionInfo.sessionId);
			setStorage("roomId", sessionInfo.roomId);
			sock.auth = { sessionId: sessionInfo.sessionId } ;		
		}
	}

	const handleGameReady = (data: {gameData: GameData, gameSettings: GameSettings }) => {
		console.log(data.gameData)
		setGameData((oldGameData) => ({
			...oldGameData,
			ball: data.gameData.ball,
			players: oldGameData.players.map((player, index) => {
				if (index === 0)
					return {...player, id: data.gameData.players[index].id, pos: utils.toScale(gameData.players[0].pos, canvas.height / gameSettings.height)}
				return {...player, id: data.gameData.players[index].id, pos: utils.toScale(gameData.players[1].pos, canvas.height / gameSettings.height)}
			}),
			//state: GameState.Started
		}))
		setGameSettings((oldGameSettings) => ({
			...oldGameSettings,
			scoreToWin: data.gameSettings.scoreToWin,
			width: data.gameSettings.width,
			height: data.gameSettings.height,
			paddleHeight: utils.toScale(data.gameSettings.paddleHeight, canvas.height / 1080),
			paddleWidth: utils.toScale(data.gameSettings.paddleWidth, canvas.width / 1920),
		}))
		startGame()
		setGameState(GameState.Started)
	}

	const handleSpectateSuccess = (data: {gameData: GameData, gameSettings: GameSettings }) => {
		setGameData((oldGameData) => ({
			...oldGameData,
			ball: data.gameData.ball,
			players: oldGameData.players.map((player) => {
				if (player === gameData.players[0])
					return {...player, pos: utils.toScale(gameData.players[0].pos, canvas.height / gameSettings.height)}
				return {...player, pos: utils.toScale(gameData.players[1].pos, canvas.height / gameSettings.height)}
			}),
			//state: GameState.Spectacte
		}))
		setGameSettings((oldGameSettings) => ({
			...oldGameSettings,
			scoreToWin: data.gameSettings.scoreToWin,
			width: data.gameSettings.width,
			height: data.gameSettings.height,
			paddleHeight: utils.toScale(data.gameSettings.paddleHeight, canvas.height / 1080),
			paddleWidth: utils.toScale(data.gameSettings.paddleWidth, canvas.width / 1920),
		}))
		setGameState(GameState.Spectacte)
	}

	const joinedLobby = (data: {gameData: GameData, gameSettings: GameSettings }) =>
	{
		console.log("data in joinedLobby", data.gameData);
		setGameData((oldGameData) => ({
			...oldGameData,
			ball: data.gameData.ball,
			players: data.gameData.players,
			//state: GameState.Started
		}))

	}

	const handleGoalScored = (scores: {player1: number, player2: number}) => {
		let newPlayers = gameData.players;
		setGameData((oldGameData) => ({
			...oldGameData,
			players: oldGameData.players.map((player, index) => {
				if (index === 0)
					return {...player, score: scores.player1}
				return {...player, score: scores.player2}
			}),
			// players: [
			// 	{
			// 	id: gameData.players[0].id,
			// 	pos: gameData.players[0].pos,
			// 	score: scores.player1,
			// },
			// {
			// 	id: gameData.players[1].id,
			// 	pos: gameData.players[1].pos,
			// 	score: scores.player2
			// }]
		}));
	}

	const handleUpdateBall = (ball:Ball) => {
		const newBall = {
			x:	utils.toScale(ball.x, canvas.width / gameSettings.width),
			y: utils.toScale(ball.y, canvas.height / gameSettings.height),
			speed: ball.speed,
			radius: ball.radius,
			delta:	ball.delta,

		}
		setGameData((oldGameData) => ({
			...oldGameData,
			ball: newBall,
		}));
	}

	function handleGameOver(winnerId: string)
	{
		setGameData((oldGameData) => ({
			...oldGameData,
			//state: GameState.Stopped
		}))
		if (winnerId == storage.login)
		{
			console.log("You win");
		}
		else if (gameData.players[0].id == storage.login || gameData.players[0].id == storage.login)
		{
			console.log("You lose");
		}
		else
		{
			console.log(`${winnerId} won the match`);
		}
		setGameData((oldGameData) => ({
			...oldGameData,
			winnerId: winnerId
		}))
		setGameState(GameState.Stopped)
	}

	function updatePaddle(data:{playerId:string, newPos:number})
	{
		console.log(gameData.players)
			setGameData((oldGameData) => ({
				...oldGameData,
				players: oldGameData.players.map((player) => {
					if (player.id === data.playerId)
						return {...player, pos: utils.toScale(data.newPos, canvas.height / gameSettings.height)}
					return player
				}),
			}))
	}

	const handleResize = () => {
		canvas.height = utils.getCanvasDiv().height
		canvas.width = utils.getCanvasDiv().width;
	}

	function handleMouseMove(event:React.MouseEvent<HTMLCanvasElement>)
	{
		//HANDLE THE MOUSE MOVE EVENT ON THE GAME AREA
		if (gameState == GameState.Started)
		{
			let value: number = event.clientY - utils.getCanvasDiv().y;

			if (value + (gameSettings.paddleHeight / 2) >= canvas.height)
				value = canvas.height - (gameSettings.paddleHeight / 2);
			else if (value - (gameSettings.paddleHeight / 2) <= 0)
				value = gameSettings.paddleHeight / 2;
			value = utils.toScale(value, gameSettings.height / canvas.height);
			playerMoved(value)	
		}
	}

	function draw() {
		const context  = canvas.getContext("2d")!;


		if (!context)
			return ;
		context.clearRect(
			0,
			0,
			1920,
			1080,
		);
		context.beginPath();
		context.fillRect(0,
			gameData.players[0].pos -  gameSettings.paddleHeight / 2,
			gameSettings.paddleWidth,
			gameSettings.paddleHeight);

		context.fillRect(canvas.width - gameSettings.paddleWidth,
			gameData.players[1].pos - gameSettings.paddleHeight / 2,
			gameSettings.paddleWidth,
			gameSettings.paddleHeight);

		context.fillStyle = "white";
		context?.arc(gameData.ball.x, gameData.ball.y, gameData.ball.radius, 0, 2 * Math.PI)

		context?.fill();
		context?.closePath();

	}
	
	function clearCanvas(): boolean
	{

		const context  = canvas.getContext("2d")!;

		if (!context)
		return false;
		context.clearRect(
			0,
			0,
			1920,
			1080,
			);
		return true;
	}

	useEffect(() => {
		initiateSocket("http://localhost:8002", getSession(), storage.login)
		setChatSocket(getChatSocket())
		setGameSocket(getGameSocket())
		
		canvas = canvasRef.current!;

		if (!canvas)
			return ;

		context = canvas.getContext("2d")!;
		GameRoutineHandler(handleWait,
			handleUpdateBall,
			updatePaddle,
			handleGameReady,
			handleGoalScored,
			handleSpectateSuccess,
			handleGameOver,
			handleSession)
		if (!context)
			return ;

		handleResize();
		initializeGame();
		window.addEventListener('resize', handleResize);
		return (() => {leftPong()
						window.removeEventListener('resize', handleResize)
						GameCleaner(handleWait,
							handleUpdateBall,
							updatePaddle,
							handleGameReady,
							handleGoalScored,
							handleSpectateSuccess,
							handleGameOver,
							handleSession)})
	}, [])

	useEffect(() => {
		if (gameState === GameState.Started || gameState === GameState.Spectacte)
			draw()
	}, [gameData])

	return (
		<div id="canvasDiv" style={{
			maxHeight: "50vh"
		}}>
			{
			gameState === GameState.Waiting &&
				<div className="game-display">
					<h1 style={{
						color: "white"
					}}>Waiting for Player</h1>
				</div>
					
			}
			{
				gameState === GameState.Stopped && clearCanvas() &&
				<div className="game-display">
					{(storage.login === gameData.winnerId) ? "YOU WIN" : 
					(((gameData.players[0].id === storage.login || gameData.players[1].id === storage.login)) ?
						"YOU LOSE" : `${gameData.winnerId} WIN`)}
					{}
					</div>
			}
		<canvas className="pong" ref={canvasRef} onMouseMove={handleMouseMove}/>
		<Score gameData={gameData}/>
		</div>
	);
	
}