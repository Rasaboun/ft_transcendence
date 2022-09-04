import React from "react"
import { io, Socket } from 'socket.io-client'
import { GameInfoT } from "../GameUtils/type"

type gameContextType = {
    socket:Socket|undefined
	gameInfo:GameInfoT|undefined
	setSocket:(socket:Socket) => void
	setGameInfo:(gameInfo:GameInfoT) => void
	
}

type propsType = {
    children: React.ReactNode
}

const GameContext = React.createContext<gameContextType>({
	socket: undefined,
	gameInfo: undefined,
	setSocket: () => {},
	setGameInfo: () => {}
})

function GameContextProvider (props:propsType)
{
	const [socket, setSocket] = React.useState<Socket>()
	const [gameInfo, setGameInfo] = React.useState<GameInfoT>()

	return (
		<GameContext.Provider value={{socket, gameInfo, setSocket, setGameInfo}}>
			{props.children}
		</GameContext.Provider>
	)
}

export {GameContextProvider, GameContext}