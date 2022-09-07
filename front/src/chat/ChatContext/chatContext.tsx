import React, { useState } from "react"
import { Socket } from 'socket.io-client'

type ChatContextType = {
    socket:Socket|undefined
    channel:string|undefined
	setSocket:(socket:Socket) => void
	setChannel:(channel:string) => void
	
}

type propsType = {
    children: React.ReactNode
}

const ChatContext = React.createContext<ChatContextType>({
	socket: undefined,
	channel: undefined,
	setSocket: () => {},
	setChannel: () => {},
})

function ChatContextProvider (props:propsType)
{
	const [socket, setSocket] = useState<Socket>()
	const [channel, setChannel] = useState<string>()
	return (
		<ChatContext.Provider value={{socket, channel, setSocket, setChannel}}>
			{props.children}
		</ChatContext.Provider>
	)
}

export {ChatContextProvider, ChatContext}