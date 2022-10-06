import React, { useState } from "react"
import { Socket } from 'socket.io-client'
import { GameState } from "../game/GameUtils/type"

type SocketContextType = {
    chatSocket:Socket|undefined
    gameSocket:Socket|undefined
	gameState: GameState,
	image:string|undefined
	setChatSocket:(socket:Socket) => void
	setGameSocket:(socket:Socket) => void
	setGameState:(gameState:GameState) => void
	setImage:(image:string) => void
}

type propsType = {
    children: React.ReactNode
}

const SocketContext = React.createContext<SocketContextType>({
	chatSocket: undefined,
	gameSocket: undefined,
	gameState: GameState.None,
	image:undefined,
	setChatSocket: () => {},
	setGameSocket: () => {},
	setImage:() => {},
	setGameState:() => {}

})

function SocketContextProvider (props:propsType)
{
	const [chatSocket, setChatSocket] = React.useState<Socket>()
	const [gameSocket, setGameSocket] = React.useState<Socket>()
	const [gameState, setGameState] = React.useState<GameState>(GameState.None)
	const [image, setImage] = useState<string>();

	return (
		<SocketContext.Provider value={{chatSocket, setChatSocket, gameSocket, image, setImage, setGameSocket, gameState, setGameState}}>
			{props.children}
		</SocketContext.Provider>
	)
}

export {SocketContextProvider, SocketContext}