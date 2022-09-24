import React, { useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { playerT, availableLobbiesT, GameMode } from "../GameUtils/type"
import LobbyItem from '../Elements/lobbyItem'
import { Link, useNavigate } from "react-router-dom";
import useLocalStorage from '../../hooks/localStoragehook'
import { SocketContext } from '../../Context/socketContext';
import { GameMenuHandler, getActiveGames, getChatSocket, getGameSocket, initiateSocket, joinQueue, Menucleaner, spectacteGame } from '../../Utils/socketManager';
import { getSession } from '../../Utils/utils';

let socket:Socket

export default function Menu()
{
    const navigate = useNavigate()
    const {storage, setStorage} = useLocalStorage("user")
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

    const handleSubmit = (e:React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        newGame(gameMode)
        navigate("game")
        
    }

	useEffect(() => {
        initiateSocket("http://localhost:8002", getSession(), storage.login)
		setChatSocket(getChatSocket())
		setGameSocket(getGameSocket())
        getActiveGames()
		GameMenuHandler(handleAvailableLobbies, handleGoalScored, handleSession)
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
                <div className="form-radio">
                    <label>
                        <input name="mode"
                            type="radio" 
                            value={GameMode.Normal}
                            checked={gameMode === GameMode.Normal}
                            onChange={handleChange}
                            />
                        Normal
                    </label>
                    <label>
                        <input name="mode"
                            type="radio" 
                            value={GameMode.Mini}
                            checked={gameMode === GameMode.Mini}
                            onChange={handleChange}
                            />
                            Mini
                    </label>
                    <label>
                    <input name="mode"
                            type="radio" 
                            value={GameMode.Speed}
                            checked={gameMode === GameMode.Speed}
                            onChange={handleChange}
                            />
                            Speed
                    </label>
                </div>
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