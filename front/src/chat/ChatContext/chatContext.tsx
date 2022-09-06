import React from "react"
import { Socket } from 'socket.io-client'

type ChatContextType = {
    socket:Socket|undefined
	setSocket:(socket:Socket) => void
	
}

type propsType = {
    children: React.ReactNode
}

const ChatContext = React.createContext<ChatContextType>({
	socket: undefined,
	setSocket: () => {},
})

function ChatContextProvider (props:propsType)
{
	const [socket, setSocket] = React.useState<Socket>()

	return (
		<ChatContext.Provider value={{socket, setSocket}}>
			{props.children}
		</ChatContext.Provider>
	)
}

export {ChatContextProvider, ChatContext}