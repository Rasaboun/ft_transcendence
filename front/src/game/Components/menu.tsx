import React, { useEffect } from 'react'
import { io, Socket } from 'socket.io-client'
import { playerT, availableLobbiesT } from "../GameUtils/type"
import LobbyItem from '../Elements/lobbyItem'
import { Link } from "react-router-dom";
import { GameContext } from "../GameContext/gameContext"
import useLocalStorage from '../../hooks/localStoragehook'
import { GameMenuHandler, getActiveGames, getSocket, initiateSocket, joinQueue, Menucleaner, spectacteGame } from '../GameUtils/socketManager';

//let socket:Socket

export default function Menu()
{
    const {storage, setStorage} = useLocalStorage("user")
	const {storage2} = useLocalStorage("sessionId")
	const {storage3} = useLocalStorage("channel")
    const value = React.useContext(GameContext)
    const [availableLobbies, setAvailableLobbies] = React.useState<availableLobbiesT>()


    function newGame(player:playerT)
	{
		joinQueue(player)
	}

    function handleAvailableLobbies(availableLobbies:availableLobbiesT)
    {
        console.log(availableLobbies)
        setAvailableLobbies(availableLobbies)
    }
    
    function handleGoalScored(players: any)
    {

       console.log(value.gameInfo)
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
            initiateSocket("http://localhost:8002/game", value.setSocket, sessioninfo, storage.login)        
        console.log("Socket id in menu", socket?.id);
            getActiveGames()
		GameMenuHandler(handleAvailableLobbies, handleGoalScored, handleSession)
		socket = getSocket()
        value?.setSocket(socket)
        return (() => Menucleaner(handleAvailableLobbies, handleGoalScored))
    }, [])

    console.log(value)

    const lobbiesElements:any = availableLobbies?.map((elem) => 
    <LobbyItem key={elem.lobbyId} 
        lobbyId={elem.lobbyId} 
        playersId={elem.playersId}
        spectateMode={spectateMode}
        />)

    return (
        <div>
            <Link to="game" state={{socket : "socket"}}>
                <button onClick={() => 
                    newGame({
                        id: "",
                        position: 1080 / 2,
                        score: 0,
                    })}>
                                Start Game
                </button>
            </Link>
           
            <ul>
                {lobbiesElements}
            </ul>
        </div>
    )
}