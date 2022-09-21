import React, {useState, useEffect, useRef} from "react"
import Score from "../Elements/score"
import * as utils from "../GameUtils/GameUtils"
import "../game.css"
import { GameSettings, GameData, GameState, Player, Ball} from "../GameUtils/type"
// import {ThreeDots} from "react-loader-spinner";
import { Socket } from 'socket.io-client'
import { GameContext } from "../GameContext/gameContext"
import useLocalStorage from "../../hooks/localStoragehook"
import { GameCleaner, GameRoutineHandler, initiateSocket, startGame } from "../GameUtils/socketManager"

let socket:Socket
let canvas:HTMLCanvasElement

export default function Game()
{
	const {storage, setStorage} = useLocalStorage("user")
	const {storage2} = useLocalStorage("sessionId")
	const {socket, setSocket, setGameInfo} = React.useContext(GameContext)
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
		state: GameState.Waiting,
		winnerId: ""
	});

	const [gameSettings, setGameSettings] = useState<GameSettings>({
		scoreToWin: 5,
		paddleWidth: 50,
		paddleHeight: 50,
		width: 1920,
		height: 1080,
	});

	const handleWait = () => {
		console.log("In waitingfoopponent");
		setGameData((oldGameData) => ({
			...oldGameData,
			state: GameState.Waiting
			})
		)
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
				id: "",
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
			state: GameState.Waiting,
			winnerId: ""
		})
		setGameSettings({
			scoreToWin: 5,
			paddleWidth: 20,
			paddleHeight: utils.toScale(200, canvas.height / 1080),
			width: 1920,
			height: 1080,
		})
	}
	const handleSession = (sessionInfo:{ sessionId:string, roomId:string }, sock:Socket) => {
		console.log("In game session")
		if (sock)
		{
			setStorage("sessionId", sessionInfo.sessionId);
			setStorage("roomId", sessionInfo.roomId);
			sock.auth = { sessionId: sessionInfo.sessionId } ;		
			//socket.userID = userID;
		}
	}

	const handleGameReady = (data: {gameData: GameData, gameSettings: GameSettings }) => {
		console.log("In game ready")
		setGameData((oldGameData) => ({
			...oldGameData,
			ball: data.gameData.ball,
			players: data.gameData.players,
			state: GameState.Started
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
	}

	const handleSpectateSuccess = (players: Player[]) => {
		setGameData((oldGameData) => ({
			...oldGameData,
			players: players,
			state: GameState.Spectacte
		}))
	}

	const handleGoalScored = (players: Player[]) => {
		console.log("Players", players);
		setGameData((oldGameData) => ({
			...oldGameData,
			players: players,
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
			state: GameState.Stopped
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
		socket?.emit('destroyLobby');
		setGameData((oldGameData) => ({
			...oldGameData,
			winnerId: winnerId
		}))
	}

	function updatePaddle(playerId: string, newPos: number)
	{
			setGameData((oldGameData) => ({
				...oldGameData,
				players: oldGameData.players.map((player) => {
					if (player.id === playerId)
						return {...player, pos: utils.toScale(newPos, canvas.height / gameSettings.height)}
					return player
				}),
			}))
	}

	const handleResize = () => {
		console.log(canvas.height, canvas.width)
		canvas.height = utils.getCanvasDiv().height
		canvas.width = utils.getCanvasDiv().width;
	}

	function handleMouseMove(event:React.MouseEvent<HTMLCanvasElement>)
	{
		//HANDLE THE MOUSE MOVE EVENT ON THE GAME AREA
		if (gameData.state == GameState.Started)
		{
			let value: number = event.clientY - utils.getCanvasDiv().y;

			if (value + (gameSettings.paddleHeight / 2) >= canvas.height)
				value = canvas.height - (gameSettings.paddleHeight / 2);
			else if (value - (gameSettings.paddleHeight / 2) <= 0)
				value = gameSettings.paddleHeight / 2;
			
			value = utils.toScale(value, gameSettings.height / canvas.height);			

			socket?.emit("playerMoved", value);

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
		context?.arc(gameData.ball.x, gameData.ball.y, 20, 0, 2 * Math.PI)

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
		let sessionId = localStorage.getItem("sessionId");
		let roomId = localStorage.getItem("roomId");
		let sessioninfo;
		if (sessionId && roomId)
		{
			sessionId = JSON.parse(sessionId);
			roomId = JSON.parse(roomId);
			console.log("sessionId", sessionId)
			console.log("roomId", roomId)
			if (sessionId && roomId)
				sessioninfo = {sessionId: sessionId, roomId: roomId}
		}
		console.log(socket)
        if (!socket)
            initiateSocket("http://localhost:8002/game", setSocket, sessioninfo, storage.login)
		
		canvas = canvasRef.current!;

		if (!canvas)
			return ;

		context = canvas.getContext("2d")!;
		console.log(context)
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
		console.log()
		initializeGame();
		window.addEventListener('resize', handleResize);
		console.log(socket)
		return (() => {window.removeEventListener('resize', handleResize)
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
		if (gameData.state == GameState.Started || gameData.state == GameState.Spectacte)
			draw()
		setGameInfo({
			players: [
				{id: gameData.players[0].id, score: gameData.players[0].score},
				{id: gameData.players[1].id, score: gameData.players[1].score}
			],
			isPlaying: (GameState.Started || GameState.Spectacte) ? true : false
		})
	}, [gameData])

	return (
		<div id="canvasDiv">
			{
			gameData.state === GameState.Waiting &&
				<div className="game-display">
					<h1 style={{
						color: "white"
					}}>Waiting for Player</h1>
				</div>
					
			}
			{
					gameData.state == GameState.Stopped && clearCanvas() &&
					<div className="game-display">
						{(socket?.id === gameData.winnerId) ? "YOU WIN" : 
						(((gameData.players[0].id == storage.login || gameData.players[0].id == storage.login)) ?
							"YOU LOSE" : `${gameData.winnerId} WIN`)}
						{}
						</div>
					
			}
		<canvas
		className="pong"
		ref={canvasRef}
		onMouseMove={handleMouseMove}
		/>
		{
			(gameData.state == GameState.Started || gameData.state == GameState.Spectacte) &&
			<Score  player1Score={gameData.players?.at(0)?.score!} player2Score={gameData.players?.at(1)?.score!}></Score>
		}
		</div>
	);
	
}