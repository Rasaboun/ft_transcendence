import React from "react"
import { io, Socket } from 'socket.io-client'

type gameContextType = {
	setSocket:(socket:Socket) => void
    socket:Socket|undefined
}

type propsType = {
    children: React.ReactNode
}

const GameContext = React.createContext<gameContextType>({
	setSocket: () => {},
	socket: undefined
})

function GameContextProvider (props:propsType)
{
	const [socket, setSocket] = React.useState<Socket>()

	return (
		<GameContext.Provider value={{setSocket, socket}}>
			{props.children}
		</GameContext.Provider>
	)
}

export {GameContextProvider, GameContext}