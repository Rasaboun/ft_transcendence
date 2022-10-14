import React, { useContext, useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'
import { availableLobbiesT, GameMode, GameState } from "../GameUtils/type"
import LobbyItem from '../Elements/lobbyItem'
import { useNavigate } from "react-router-dom";
import useLocalStorage from '../../hooks/localStoragehook'
import { SocketContext } from '../../Context/socketContext';
import { GameMenuHandler, getActiveGames, getChatSocket, getGameSocket, initiateSocket, joinQueue, Menucleaner, spectacteGame } from '../../Utils/socketManager';
import GameRadioForm from '../../Elements/radioFormElem';
import RadioFormElem from '../../Elements/radioFormElem';

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
    }, [gameSocket?.connected])

    const lobbiesElements:any = availableLobbies?.map((elem) => 
    <LobbyItem key={elem.lobbyId} 
        lobbyId={elem.lobbyId} 
        playersId={elem.playersId}
        spectateMode={spectateMode}
        />)

    return (
        <div>
            <form className="channel-form" onSubmit={handleSubmit}>
                <RadioFormElem choice={gameMode} setChoice={setGameMode} options={["Normal", "Mini", "Speed"]}/>
                <button type="submit" className="text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:focus:ring-indigo-800 shadow-lg shadow-indigo-500/50 dark:shadow-lg dark:shadow-indigo-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2" >
                    Start Game
                </button>
				</form>           
            <ul>
                {lobbiesElements}
            </ul>
        </div>
    )
}