import { useContext, useEffect } from "react"
import { SocketContext } from "./Context/socketContext"
import { getChatSocket, getGameSocket, initiateSocket } from "./Utils/socketManager"

export default function ErrorPage()
{
	const {chatSocket, setChatSocket, setGameSocket, gameSocket} = useContext(SocketContext)
	useEffect(() => {
		initiateSocket()
		setChatSocket(getChatSocket())
		setGameSocket(getGameSocket())

		// eslint-disable-next-line
	}, [chatSocket?.connected, gameSocket?.connected])
	return (
		<div className="flex-1 h-screen" style={{
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			padding: "10%",
			fontSize: "100px",
			color: "blue",
			textAlign: "center"
		}}>
			404 not found
		</div>
	)
}