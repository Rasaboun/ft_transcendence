import React from 'react'
import * as socketManager from "../GameUtils/socketManager"
import { io, Socket } from 'socket.io-client'
import { playerT, availableLobbiesT } from "../GameUtils/type"
import LobbyItem from '../Elements/lobbyItem'
import { Link } from "react-router-dom";
import { GameContext } from "../GameContext/gameContext"

let socket:Socket

export default function Menu()
{
    const value = React.useContext(GameContext)
    const [availableLobbies, setAvailableLobbies] = React.useState<availableLobbiesT>()


    function newGame(player:playerT)
	{
		socketManager.joinQueue(player)
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
        socketManager.spectacteGame(id)
	}

    React.useEffect(() => {
        socketManager.initiateSocket("http://localhost:8002")
        socketManager.getActiveGames()
		socketManager.GameMenuHandler(handleAvailableLobbies, handleGoalScored)
		socket = socketManager.getSocket()
        value?.setSocket(socket)
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
                <button className="text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:focus:ring-indigo-800 shadow-lg shadow-indigo-500/50 dark:shadow-lg dark:shadow-indigo-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2" onClick={() => 
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