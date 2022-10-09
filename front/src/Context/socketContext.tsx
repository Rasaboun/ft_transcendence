import React, { useState } from "react"
import { Socket } from 'socket.io-client'

type SocketContextType = {
    chatSocket:Socket|undefined
    gameSocket:Socket|undefined
	notification: boolean,
	image:string|undefined
	setChatSocket:(socket:Socket) => void
	setGameSocket:(socket:Socket) => void
	setNotification:(notification:boolean) => void
	setImage:(image:string) => void
}

type propsType = {
    children: React.ReactNode
}

const SocketContext = React.createContext<SocketContextType>({
	chatSocket: undefined,
	gameSocket: undefined,
	notification: false,
	image:undefined,
	setChatSocket: () => {},
	setGameSocket: () => {},
	setImage:() => {},
	setNotification:() => {}

})

function SocketContextProvider (props:propsType)
{
	const [chatSocket, setChatSocket] = React.useState<Socket>()
	const [gameSocket, setGameSocket] = React.useState<Socket>()
	const [notification, setNotification] = React.useState<boolean>(false)
	const [image, setImage] = useState<string>();

	return (
		<SocketContext.Provider value={{chatSocket, setChatSocket, gameSocket, image, setImage, setGameSocket, notification, setNotification}}>
			{props.children}
		</SocketContext.Provider>
	)
}

export {SocketContextProvider, SocketContext}