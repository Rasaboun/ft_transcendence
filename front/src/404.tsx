import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { SocketContext } from "./Context/socketContext"
import { getChatSocket, getGameSocket, initiateSocket } from "./Utils/socketManager"

export default function ErrorPage()
{
	const navigate = useNavigate()
	const {chatSocket, setChatSocket, setGameSocket, gameSocket} = useContext(SocketContext)
	useEffect(() => {
		initiateSocket("http://localhost:${process.env.SOCKET_PORT}")
		setChatSocket(getChatSocket())
		setGameSocket(getGameSocket())
		chatSocket?.on("connect", () => {navigate(-1)})
		gameSocket?.on("connect", () => {navigate(-1)})
	}, [chatSocket?.connected, gameSocket?.connected])
	return (
		<div className="flex-1" style={{
			display: "flex",
			justifyContent: "center",
			alignItems: "center"
		}}>
			404 not found
		</div>
	)
}