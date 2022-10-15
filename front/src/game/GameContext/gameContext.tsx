import React from "react"
import { Socket } from 'socket.io-client'
import { GameInfoT } from "../GameUtils/type"

type GameContextType = {
    socket:Socket|undefined
	gameInfo:GameInfoT|undefined
	setSocket:(socket:Socket) => void
	setGameInfo:(gameInfo:GameInfoT) => void
	
}

type propsType = {
    children: React.ReactNode
}

const GameContext = React.createContext<GameContextType>({
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