import React, { useState } from "react"
import { Socket } from 'socket.io-client'
import { ChannelT } from "../ChatUtils/chatType"

type ChatContextType = {
    channel:ChannelT|undefined
	setChannel:(channel:ChannelT) => void
	
}

type propsType = {
    children: React.ReactNode
}

const ChatContext = React.createContext<ChatContextType>({
	channel: undefined,
	setChannel: () => {},
})

function ChatContextProvider (props:propsType)
{
	const [channel, setChannel] = useState<ChannelT>()
	return (
		<ChatContext.Provider value={{ channel, setChannel}}>
			{props.children}
		</ChatContext.Provider>
	)
}

export {ChatContextProvider, ChatContext}