import React from "react"
import { Socket } from 'socket.io-client'
import { GameState } from "../game/GameUtils/type"

type SocketContextType = {
    chatSocket:Socket|undefined
    gameSocket:Socket|undefined
	gameState:GameState
	setChatSocket:(socket:Socket) => void
	setGameSocket:(socket:Socket) => void
	setGameState:(gameState:GameState) => void
}

type propsType = {
    children: React.ReactNode
}

const SocketContext = React.createContext<SocketContextType>({
	chatSocket: undefined,
	gameSocket: undefined,
	gameState: GameState.None,
	setChatSocket: () => {},
	setGameSocket: () => {},
	setGameState:() => {}

})

function SocketContextProvider (props:propsType)
{
	const [chatSocket, setChatSocket] = React.useState<Socket>()
	const [gameSocket, setGameSocket] = React.useState<Socket>()
	const [gameState, setGameState] = React.useState<GameState>(GameState.None)

	return (
		<SocketContext.Provider value={{chatSocket, setChatSocket, gameSocket, setGameSocket, gameState, setGameState}}>
			{props.children}
		</SocketContext.Provider>
	)
}

export {SocketContextProvider, SocketContext}