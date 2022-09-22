import React from "react"
import { Socket } from 'socket.io-client'

type SocketContextType = {
    chatSocket:Socket|undefined
    gameSocket:Socket|undefined
	setChatSocket:(socket:Socket) => void
	setGameSocket:(socket:Socket) => void
}

type propsType = {
    children: React.ReactNode
}

const SocketContext = React.createContext<SocketContextType>({
	chatSocket: undefined,
	gameSocket: undefined,
	setChatSocket: () => {},
	setGameSocket: () => {}
})

function SocketContextProvider (props:propsType)
{
	const [chatSocket, setChatSocket] = React.useState<Socket>()
	const [gameSocket, setGameSocket] = React.useState<Socket>()

	return (
		<SocketContext.Provider value={{chatSocket, setChatSocket, gameSocket, setGameSocket}}>
			{props.children}
		</SocketContext.Provider>
	)
}

export {SocketContextProvider, SocketContext}