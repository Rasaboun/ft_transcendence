import React from "react"
import Ball from "../../Elements/ball"
import Paddle from "../../Elements/paddle"
import Score from "../../Elements/score"
import * as utils from "../../GameUtils/GameUtils"
import "../../hooks/useAnimationFrame"
import useAnimationFrame from "../../hooks/useAnimationFrame"
import "./pong.css"


type gameStateT = {
    isPlaying:boolean,
    scoreToWin:number,
    playerScore:number,
    computerScore:number
}
type gameDataT = {
	time:string,
    scoreToWin:number,
    player1id:number,
    player2id:number,
	player1score:number,
	player2score:number
}

export default function Pong()
{
	//SEE USESTATE DOCUMENTATION
    const [position, setPosition] = React.useState(50)
    const [computerPosition, setComputerPosition] = React.useState(50)
	const [gameState, setGameState] = React.useState<gameStateT>({
        isPlaying: false,
        scoreToWin: 3,
        playerScore: 0,
        computerScore: 0
    })

	function handleStart()
	{
		//SET THE DEFAULT VARIABLE
		setGameState((oldGameState) => ({
			...oldGameState,
			isPlaying: true,
			playerScore: 0,
        	computerScore: 0
		}))
	}

    function handleMouseMove(event:React.MouseEvent<HTMLDivElement>)
    {
		//HANDLE THE MOUSE MOVE EVENT ON THE GAME AREA
		if (gameState.isPlaying)
		{
        	const value:number = (event.clientY / window.innerHeight) * 100
        	setPosition(value)
		}
    }

	function restartGame()
	{
		//RESET GAME VARIABLE TO STARTING VALUES
		setGameState((oldGameState) => ({
			...oldGameState,
			isPlaying: false,
		}))
		setComputerPosition(50)
		setPosition(50)
	}

	//FONCTION NON APPELLER A TESTER AVEC LE BACKEND
	async function sendData ()
	{
		//INFO SUR LA PARTIE A ENVOYER A LA BASE DE DONNÉE
		//DES INFO PEUVENT MANQUÉ
		const gameData:gameDataT = {
			time: Date(),
			scoreToWin: gameState.scoreToWin,
			player1id: 1, //ON RECUPERERA LES VRAIS ID DES JOUEUR
			player2id: 2,
			player1score: gameState.playerScore,
			player2score:gameState.computerScore
		}
		console.log(JSON.stringify(gameData))
		//EXEMPLE D'ENVOIE EN COMMENTAIRE A TESTER
	// 	const url:string = "http://localhost:3000/game"
	// 	await fetch(url, {
    //     method: 'POST',
    //     body: JSON.stringify(gameData)
    //   }).then(function(response) {
    //     console.log(response)
    //     return response.json();
    //   });
 
	}

	function setRoundWin()
	{
		//CHECK WHO WIN AND CHANGE STATE VALUE OF SCORE
		const contactZone:DOMRect = utils.getContactZone()
		if (contactZone.right >= window.innerWidth)
		{
			setGameState((oldGameState) => ({
				...oldGameState,
				playerScore: oldGameState.playerScore + 1
			}))
		}
		else if (contactZone.left <= 0) 
		{
			setGameState((oldGameState) => ({
				...oldGameState,
				computerScore: oldGameState.computerScore + 1
			}))
		}
	}

	function isWin()
	{
		//CHECK IF SOMEONE WINS
		if (gameState.playerScore === gameState.scoreToWin
			|| gameState.computerScore === gameState.scoreToWin)
			return true
		return false
	}

    function updateGame(time:number)
    {
		//GAMELOOP
		//IA LOGIC JUST FOLOWING THE Y COORD OF THE BALL
        const newPosition =  parseFloat(window.getComputedStyle(document.getElementById("ball")!).getPropertyValue('--y'));
        setComputerPosition(newPosition)
		setRoundWin()
		if (isWin())
			restartGame()
			
    }

	useAnimationFrame(updateGame)

    return (
        <div className="pong" onMouseMove={handleMouseMove}>
            {
				!gameState.isPlaying && 
                	<button className="buttonStart" onClick={handleStart}>
						Start Game
					</button>
			}
            <Score playerScore={gameState.playerScore} computerScore={gameState.computerScore}/>
            <Ball isPlaying={gameState.isPlaying}/>
            <Paddle id="playerPaddle" className="left" position={position} player={true}/>
            <Paddle id="computerPaddle" className="right" position={computerPosition} player={false}/>
        </div>
    )
}