import React, {useState, useEffect, useRef} from "react"
import Score from "../Elements/score"
import * as utils from "../GameUtils/GameUtils"
import "../game.css"
import { playerT, playersT, ballInfoT, gameCollionInfoT, updateInfoT, gameDataT, GameSettings, GameData, GameState, Player} from "../GameUtils/type"
// import {ThreeDots} from "react-loader-spinner";
import * as socketManager from "../GameUtils/socketManager"
import { io, Socket } from 'socket.io-client'
import { GameContext } from "../GameContext/gameContext"
import { send } from "process"

let socket:Socket
let canvas:HTMLCanvasElement

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
		paddleHeight: 200,
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
			state: GameState.Spectacte,
			winnerId: ""
		})
		setGameSettings({
			scoreToWin: 5,
			paddleWidth: canvas.width / 100,
			paddleHeight: canvas.height / 10,
			width: 1920,
			height: 1080,
		})
	}

	useEffect(() => {
		canvas = canvasRef.current!;
		console.log(canvas)
		if (!canvas)
			return ;
/*
		canvas.width = window.innerWidth; // Get parent width
		canvas.height = window.innerHeight; // Get parent height
		canvas.style.width = `${window.innerWidth}px`;
		canvas.style.height = `${window.innerHeight}px`;
	*/
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
		console.log(value.socket)
		socket.on('waitingForOpponent', handleWait)

		socket.on('updateBall', (ball) => {
			setGameData((oldGameData) => ({
				...oldGameData,
				ball: ball
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
			console.log("spectate")
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
			draw(0, 0)
		value.setGameInfo({
			players: [
				{id: gameData.players[0].id, score: gameData.players[0].score},
				{id: gameData.players[1].id, score: gameData.players[1].score}
			],
			isPlaying: (GameState.Started || GameState.Spectacte) ? true : false
		})
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
			//Send to spectators
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
						return {...player, pos: newPos}
					return player
				}),
			}))
	}

	function handleMouseMove(event:React.MouseEvent<HTMLCanvasElement>)
	{
		//HANDLE THE MOUSE MOVE EVENT ON THE GAME AREA
		if (gameData.state == GameState.Started)
		{
			let value: number = event.clientY;

			if (value + gameSettings.paddleHeight / 2 >= canvas.height)
				value = canvas.height - gameSettings.paddleHeight / 2;
			else if (value - gameSettings.paddleHeight / 2 <= 0)
				value = gameSettings.paddleHeight / 2;
			socket.emit("playerMoved", value);
			/*socketManager.sendPosition({
				id: socket!.id,
				position: value,
				score: 0,
			})
			*/
		}
	}

	function draw(x: number, y: number) {
		const context  = canvas.getContext("2d")!;
		if (y > 1000)
			return ;
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

		context.fillRect(canvas.width - gameSettings.paddleWidth, // ?????
			gameData.players[1].pos - gameSettings.paddleHeight / 2,
			gameSettings.paddleWidth,
			gameSettings.paddleHeight);

		context.fillStyle = "white";
		context?.arc(gameData.ball.x, gameData.ball.y, 20, 0, 2 * Math.PI)

		context?.fill();
		context?.closePath();

		//setTimeout(() => { draw(x +20, y + 20) }, 50)
	}

	const writeText = (info:{text:string, x:number, y:number}) => {
		const { text, x, y } = info;
	   
		context.beginPath();
		context.font = '30px sans-serif';
		context.textAlign = "center";
		//context.textBaseline = textBaseline;
		context.fillStyle = "white";
		context.fillText(text, x, y);
		context.stroke();
	  }
	console.log(gameData.state)
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
						{/* <button className="buttonStart" onClick={() => joiningQueue({ id: socket!.id,
																				position: 50,
																				score: 0,
																			})}>
							Restart Game
						</button> */}
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
	
/*
	return (
		<div className="pong" onMouseMove={handleMouseMove}>
			{
				!gameState.isPlaying && !gameState.watingForOpponent && !gameState.isGameFinish
					&& <div className="game-display">
						<button className="buttonStart" onClick={() => joiningQueue({ id: socket!.id,
																				position: 50,
																				score: 0,
																			})}>
							Start Game
						</button>
						<form onSubmit={handleSubmit}>
							<input type="text" value={input} onChange={handleChange}/>
							<input type="submit" value="Rechercher"/>
						</form>
						{gameState.invalidLobbyId && <p style={{
							color: "red"
						}}>This lobby does not exist anymore</p>}
					</div> 
			}
			{
				gameState.watingForOpponent &&
					<div className="game-display">
						<h1 style={{
							color: "white"
						}}>Waiting for Player</h1>
						<ThreeDots 
							height="80" 
							width="80" 
							radius="9"
							color="#00ffff" 
							ariaLabel="three-dots-loading"
							wrapperStyle={{}}
							visible={true}
						/>
					</div>
						
			}
			{
					gameState.isGameFinish && 
					<div className="game-display">
						{(socket?.id === gameState.winnerId) ? "YOU WIN" : "YOU LOSE"}
						<button className="buttonStart" onClick={() => joiningQueue({ id: socket!.id,
																				position: 50,
																				score: 0,
																			})}>
							Restart Game
						</button>
						</div>
					
			}
			{
				gameState.isPlaying &&
				<Score player1Score={players?.at(0)?.score!} player2Score={players?.at(1)?.score!}/>
			}
			{playersElements}
			{
				players === undefined && 
				<Paddle id="player1" className="left" position={50} player={true}/>
			}
			{
				(players?.length === 1 || players === undefined) && 
				<Paddle id="player2" className="right" position={50} player={false}/>
			}
			<Ball isPlaying={gameState.isPlaying} x={ball?.x} y={ball?.y}/>
		</div>
	)
*/
}