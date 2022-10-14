import React, {useState, useEffect, useRef, useContext} from "react"
import Score from "../Elements/score"
import * as utils from "../GameUtils/GameUtils"
import "../game.css"
import { GameSettings, GameData, GameState, Ball, DrawingSettings} from "../GameUtils/type"
// import {ThreeDots} from "react-loader-spinner";
import { Socket } from 'socket.io-client'
import useLocalStorage from "../../hooks/localStoragehook"
import { GameCleaner, GameRoutineHandler, getChatSocket, getGameSocket, initiateSocket, leftPong, loadGame, playerMoved, startGame } from "../../Utils/socketManager"
import { SocketContext } from "../../Context/socketContext"
import { useNavigate } from "react-router-dom"

let canvas:HTMLCanvasElement;

export default function Game()
{
	const navigate = useNavigate()
	const {storage, setStorage} = useLocalStorage("user")
	const {storage2} = useLocalStorage("gameState")
	const { gameSocket, setChatSocket, setGameSocket } = useContext(SocketContext)
	let context: CanvasRenderingContext2D;
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [ballRadius, setBallRadius] = useState<number>(10);
	const [drawingSettings, setDrawingSettings] = useState<DrawingSettings>({
		paddleWidth: 20,
		paddleHeight: 200,
	});
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
		winnerUsername: "",
		state: GameState.Waiting,
	});

	const [gameSettings, setGameSettings] = useState<GameSettings>({
		scoreToWin: 5,
		paddleWidth: 20,
		paddleHeight: 200,
		width: 1920,
		height: 1080,
	});

	const handleWait = () => {
		setStorage("gameState", GameState.Waiting)
	}

	function initializeGame()
	{
		if (parseInt(storage2) === GameState.Started)
		{
			loadGame();
			return ;
		}
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
			state: GameState.Waiting,
			winnerUsername: "",
		})
		setGameSettings({
			scoreToWin: 5,
			paddleWidth: 50,
			paddleHeight: 200,
			width: 1920,
			height: 1080,
		})
		setDrawingSettings({
			paddleHeight: utils.toScale(200, canvas.height / 1080),
			paddleWidth: utils.toScale(20, canvas.width / 1920),
		})
	}

	const updateGame = (data: {gameData: GameData, gameSettings: GameSettings }) =>
	{
		const newPlayers = [
			{
				id: data.gameData.players[0].id,
				pos : utils.toScale(data.gameData.players[0].pos, canvas.height / gameSettings.height),
				score: data.gameData.players[0].score,
			},
			{
				id: data.gameData.players[1].id,
				pos : utils.toScale(data.gameData.players[1].pos, canvas.height / gameSettings.height),
				score: data.gameData.players[1].score,
			}
			]

		setGameData((oldGameData) => ({
			...oldGameData,
			ball: data.gameData.ball,
			players: newPlayers, //oldGameData.players.map((player, index) => {
			// 	if (index === 0)
			// 		return {...player, id: data.gameData.players[index].id, pos: utils.toScale(gameData.players[0].pos, canvas.height / gameSettings.height)}
			// 	return {...player, id: data.gameData.players[index].id, pos: utils.toScale(gameData.players[1].pos, canvas.height / gameSettings.height)}
			// }),
			state: data.gameData.state,
		}))
		setGameSettings((oldGameSettings) => ({
			...oldGameSettings,
			scoreToWin: data.gameSettings.scoreToWin,
			width: data.gameSettings.width,
			height: data.gameSettings.height,
			paddleHeight:  data.gameSettings.paddleHeight,
			paddleWidth: data.gameSettings.paddleWidth,
		}))
		handleResize();

	}

	const handleSession = (sessionInfo:{ sessionId:string, roomId:string }, sock:Socket) => {
		if (sock)
		{
			setStorage("sessionId", sessionInfo.sessionId);
			setStorage("roomId", sessionInfo.roomId);
			sock.auth = { sessionId: sessionInfo.sessionId } ;		
		}
	}

	const handleGameData = (data: {gameData: GameData, gameSettings: GameSettings }) => {
		updateGame(data);
		setStorage("gameState", data.gameData.state);
	}

	const handleGameReady = (data: {gameData: GameData, gameSettings: GameSettings }) => {
		updateGame(data);
		handleResize();
		startGame()
		setStorage("gameState", GameState.Started)
	}

	const handleSpectateSuccess = (data: {gameData: GameData, gameSettings: GameSettings }) => {
		
		updateGame(data);
		setStorage("gameState", GameState.Spectacte)
	}

	const handleGoalScored = (scores: {player1: number, player2: number}) => {
		setGameData((oldGameData) => ({
			...oldGameData,
			players: oldGameData.players.map((player, index) => {
				if (index === 0)
					return {...player, score: scores.player1}
				return {...player, score: scores.player2}
			}),
		}));
	}

	const scaleBallRadius = (ballRadius: number) => {
		const diagLen = Math.sqrt((canvas.width ** 2) + (canvas.height ** 2));
		const ratio = diagLen / (Math.sqrt((gameSettings.width ** 2) + (gameSettings.height ** 2))) * 0.01;
		let radius = diagLen * ratio;
		setBallRadius(radius);
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

	function handleGameOver(winnerUsername: string)
	{
		setGameData((oldGameData) => ({
			...oldGameData,
			//state: GameState.Stopped
		}))
		setGameData((oldGameData) => ({
			...oldGameData,
			winnerUsername: winnerUsername
		}))
		setStorage("gameState", GameState.Stopped)
	}

	function updatePaddle(data:{playerId:string, newPos:number})
	{
			setGameData((oldGameData) => ({
				...oldGameData,
				players: oldGameData.players.map((player, index) => {
					if (player.id === data.playerId)
						return {...player, pos: utils.toScale(data.newPos, canvas.height / gameSettings.height)}
					return player
				}),
			}))
	}

	const handleResize = () => {
		canvas.height = utils.getCanvasDiv().height
		canvas.width = utils.getCanvasDiv().width;
		setDrawingSettings({
			paddleHeight: utils.toScale(gameSettings.paddleHeight, canvas.height / 1080),
			paddleWidth: utils.toScale(gameSettings.paddleWidth, canvas.width / 1920),
		})
		scaleBallRadius(ballRadius);
		
	}

	function handleMouseMove(event:React.MouseEvent<HTMLCanvasElement>)
	{
		//HANDLE THE MOUSE MOVE EVENT ON THE GAME AREA
		if (parseInt(storage2) === GameState.Started)
		{
			let value: number = event.clientY - utils.getCanvasDiv().y;

			if (value + (drawingSettings.paddleHeight / 2) >= canvas.height)
				value = canvas.height - (drawingSettings.paddleHeight / 2);
			else if (value - (drawingSettings.paddleHeight / 2) <= 0)
				value = drawingSettings.paddleHeight / 2;
			value = utils.toScale(value, gameSettings.height / canvas.height);
			playerMoved(value)	
		}
	}

	const handleInvitationExpired = (msg:string) => {
		navigate("/pong")
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
			gameData.players[0].pos -  drawingSettings.paddleHeight / 2,
			drawingSettings.paddleWidth,
			drawingSettings.paddleHeight);

		context.fillRect(canvas.width - drawingSettings.paddleWidth,
			gameData.players[1].pos - drawingSettings.paddleHeight / 2,
			drawingSettings.paddleWidth,
			drawingSettings.paddleHeight);

		context.fillStyle = "white";
		context?.arc(gameData.ball.x, gameData.ball.y, ballRadius, 0, 2 * Math.PI)

		context?.fill();
		context?.closePath();

	}
	
	function clearCanvas(): boolean
	{

		if (!canvas)
			return false;
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
		initiateSocket()
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
			handleGameData,
			handleGoalScored,
			handleSpectateSuccess,
			handleGameOver,
			handleSession,
			handleInvitationExpired)
		
		if (!context)
			return ;
		
		canvas.height = utils.getCanvasDiv().height
		canvas.width = utils.getCanvasDiv().width;
		initializeGame();
		window.addEventListener('resize', handleResize);
		return (() => {	leftPong()
						window.removeEventListener('resize', handleResize)
						GameCleaner(handleWait,
							handleUpdateBall,
							updatePaddle,
							handleGameReady,
							handleGameData,
							handleGoalScored,
							handleSpectateSuccess,
							handleGameOver,
							handleSession)})
	}, [gameSocket?.connected])

	useEffect(() => {
		if (parseInt(storage2) === GameState.Started || parseInt(storage2) === GameState.Spectacte)
		{
			draw()
		}
	}, [gameData])

	return (
		<div id="canvasDiv" style={{
			maxHeight: "50vh"
		}}>
			{
			parseInt(storage2) === GameState.Waiting &&
				<div className="game-display ">
					<h1 style={{
						color: "white"
					}}>Waiting for Player</h1>
				</div>
					
			}
			{
				parseInt(storage2) === GameState.Stopped && clearCanvas() &&
				<div className="game-display">
					{(storage.login === gameData.winnerUsername) ? "YOU WON" : 
					(((gameData.players[0].id === storage.login || gameData.players[1].id === storage.login)) ?
						"YOU LOST" : `${gameData.winnerUsername} WON`)}
					{}
					</div>
			}
		<canvas className="pong" ref={canvasRef} onMouseMove={handleMouseMove}/>
		<Score gameData={gameData}/>
		</div>
	);
	
}