import React, { useState } from "react"
import { Socket } from 'socket.io-client'
import { ChannelT } from "../ChatUtils/chatType"

type ChatContextType = {
    socket:Socket|undefined
    channel:ChannelT|undefined
	setSocket:(socket:Socket) => void
	setChannel:(channel:ChannelT) => void
	
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
	const [channel, setChannel] = useState<ChannelT>()
	return (
		<ChatContext.Provider value={{socket, channel, setSocket, setChannel}}>
			{props.children}
		</ChatContext.Provider>
	)
}

export {ChatContextProvider, ChatContext}