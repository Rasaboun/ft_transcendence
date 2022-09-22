import React, { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { playerT, availableLobbiesT, GameMode } from "../GameUtils/type"
import LobbyItem from '../Elements/lobbyItem'
import { Link, useNavigate } from "react-router-dom";
import { GameContext } from "../GameContext/gameContext"
import useLocalStorage from '../../hooks/localStoragehook'
import { GameMenuHandler, getActiveGames, getSocket, initiateSocket, joinQueue, Menucleaner, spectacteGame } from '../GameUtils/socketManager';

let socket:Socket

export default function Menu()
{
    const navigate = useNavigate()
    const {storage, setStorage} = useLocalStorage("user")
	const {storage2} = useLocalStorage("sessionId")
	const {storage3} = useLocalStorage("channel")
    const {socket, setSocket, gameInfo} = React.useContext(GameContext)
    const [availableLobbies, setAvailableLobbies] = useState<availableLobbiesT>()
    const [gameMode, setGameMode] = useState(GameMode.Normal)


    function newGame(mode:GameMode)
	{
		joinQueue(mode)
	}

    function handleAvailableLobbies(availableLobbies:availableLobbiesT)
    {
        console.log(availableLobbies)
        setAvailableLobbies(availableLobbies)
    }
    
    function handleGoalScored(players: any)
    {
        console.log(gameInfo)
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
        if (!socket)
            initiateSocket("http://localhost:8002/game", setSocket, sessioninfo, storage.login)        
        console.log("Socket id in menu", socket?.id);
            getActiveGames()
		GameMenuHandler(handleAvailableLobbies, handleGoalScored, handleSession)
        setSocket(getSocket())
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