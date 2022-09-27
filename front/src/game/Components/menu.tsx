import React, { useContext, useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'
import { availableLobbiesT, GameMode, GameState } from "../GameUtils/type"
import LobbyItem from '../Elements/lobbyItem'
import { useNavigate } from "react-router-dom";
import useLocalStorage from '../../hooks/localStoragehook'
import { SocketContext } from '../../Context/socketContext';
import { GameMenuHandler, getActiveGames, getChatSocket, getGameSocket, initiateSocket, joinQueue, Menucleaner, spectacteGame } from '../../Utils/socketManager';
import GameRadioForm from '../../Elements/gameRadioForm';

let socket:Socket

export default function Menu()
{
    const navigate = useNavigate()
    const {setStorage} = useLocalStorage("user")
	const {storage2} = useLocalStorage("gameState")
    const {gameSocket, setChatSocket, setGameSocket} = useContext(SocketContext)
    const [availableLobbies, setAvailableLobbies] = useState<availableLobbiesT>()
    const [gameMode, setGameMode] = useState(GameMode.Normal)


    function newGame(mode:GameMode)
	{
		joinQueue(mode)
	}

    function handleAvailableLobbies(availableLobbies:availableLobbiesT)
    {
        setAvailableLobbies(availableLobbies)
    }
    
    function handleGoalScored(scores: {player1: number, player2: number})
    {
    }

    function spectateMode(id:string)
	{		
        spectacteGame(id)
	}
    
    const handleSession = (sessionInfo:{ sessionId:string, roomId:string }, sock:Socket) => {
		console.log("In session menu", sessionInfo)
		if (sock)
		{
			setStorage("sessionId", sessionInfo.sessionId);
			setStorage("roomId", sessionInfo.roomId);
			sock.auth = { sessionId: sessionInfo.sessionId } ;		
			//socket.userID = userID;
		}
	}

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
		setGameMode(parseFloat(e.target.value))
    }

    const handleWaitingForOpponent = () => {
        console.log("Received waiting");
        navigate("game")
    }

    const handleSubmit = (e:React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        newGame(gameMode)
        navigate("game")
        
    }

	useEffect(() => {
        initiateSocket("http://localhost:8002")
		setChatSocket(getChatSocket())
		setGameSocket(getGameSocket())
        if (parseInt(storage2) === GameState.Started)
            navigate("game")
        if (gameSocket)
        {
            getActiveGames()
            GameMenuHandler(
                handleAvailableLobbies,
                handleGoalScored,
                handleSession,
                handleWaitingForOpponent)
        }
        return (() => Menucleaner(handleAvailableLobbies, handleGoalScored))
    }, [])

    console.log(socket)
    const lobbiesElements:any = availableLobbies?.map((elem) => 
    <LobbyItem key={elem.lobbyId} 
        lobbyId={elem.lobbyId} 
        playersId={elem.playersId}
        spectateMode={spectateMode}
        />)

    console.log("gameMode", gameMode)
    return (
        <div>
            <form className="channel-form" onSubmit={handleSubmit}>
                <GameRadioForm gameMode={gameMode} setGameMode={setGameMode}/>
                <button type="submit" className="button-action" >
                    Start Game
                </button>
				</form>           
            <ul>
                {lobbiesElements}
            </ul>
        </div>
    )
}