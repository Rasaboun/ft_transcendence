import React, {useState, useEffect, useRef} from "react"
import Score from "../../Elements/score"
import * as utils from "../../GameUtils/GameUtils"
import "./pong.css"
import {  GameSettings, GameData, GameState, Player} from "../../type"
// import {ThreeDots} from "react-loader-spinner";
import * as socketManager from "../../socketManager"
import { io, Socket } from 'socket.io-client'
import { GameContext } from "../../gameContext"

let socket:Socket
let canvas:HTMLCanvasElement
let context:CanvasRenderingContext2D

export default function Game()
{
	const value = React.useContext(GameContext)
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

	function setContext(newContext: CanvasRenderingContext2D){ context = newContext; }

	const handleWait = () => {
		setGameData((oldGameData) => ({
			...oldGameData,
			state: GameState.Waiting
			})
		)
	}

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
			state: GameState.Spectacte,
			winnerId: ""
		})
		setGameSettings({
			scoreToWin: 5,
			paddleWidth: 50,
			paddleHeight: 200,
			width: 1920,
			height: 1080,
		})
	}

	useEffect(() => {
		canvas = canvasRef.current!;
		if (!canvas)
			return ;

		context = canvas.getContext("2d")!;
		console.log(context)
		if (!context)
			return ;

		const handleResize = () => {
			console.log(canvas.height, canvas.width)
			canvas.height = utils.getCanvasDiv().height
			canvas.width = utils.getCanvasDiv().width;
		}	
		handleResize();
		initializeGame()
		window.addEventListener('resize', handleResize);

		socket = value?.socket!
		socket.on('waitingForOpponent', handleWait)

		socket.on('updateBall', (ball) => {
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
		})
		socket.on('updatePaddle', ({playerId, newPos}) => {
			updatePaddle(playerId, newPos);
		})
		socket.on('gameReady', (data: GameData) => {
			setGameData((oldGameData) => ({
				...oldGameData,
				ball: data.ball,
				players: data.players,
				state: GameState.Started
			}));
			socket.emit("startGame");
		})

		socket.on('goalScored', (players: Player[]) => {
			setGameData((oldGameData) => ({
				...oldGameData,
				players: players,
			}));
		})

		socket.on('spectate', () => {
			setGameData((oldGameData) => ({
				...oldGameData,
				state: GameState.Started
			}))
		})
		socket.on('gameOver', (winnerId: string) => {
			handleGameOver(winnerId);
		})
	}, [])

	useEffect(() => {
		if (gameData.state == GameState.Started || gameData.state == GameState.Spectacte)
			draw()
	}, [gameData])

	function handleGameOver(winnerId: string)
	{
		setGameData((oldGameData) => ({
			...oldGameData,
			state: GameState.Stopped
		}))
		if (winnerId == socket.id)
		{
			console.log("You win");
		}
		else if (gameData.players[0].id == socket.id || gameData.players[0].id == socket.id)
		{
			console.log("You lose");
		}
		else
		{
			console.log(`${winnerId} won the match`);
		}
		socket.emit('destroyLobby');
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

			socket.emit("playerMoved", value);

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
			gameData.players[0].pos - gameSettings.paddleHeight / 2,
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
					gameData.state == GameState.Stopped &&
					<div className="game-display">
						{(socket?.id === gameData.winnerId) ? "YOU WIN" : 
						(((gameData.players[0].id == socket.id || gameData.players[0].id == socket.id)) ?
							"YOU LOSE" : `${gameData.winnerId} WIN`)}
						{}
						</div>
					
			}
		<canvas
		className="pong"
		width="1920"
		height="1080"
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