import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { SocketContext } from "./Context/socketContext"
import { getChatSocket, getGameSocket, initiateSocket } from "./Utils/socketManager"

export default function ErrorPage()
{
	const navigate = useNavigate()
	const {chatSocket, setChatSocket, setGameSocket, gameSocket} = useContext(SocketContext)
	useEffect(() => {
		initiateSocket("http://localhost:8002")
		setChatSocket(getChatSocket())
		setGameSocket(getGameSocket())
		chatSocket?.on("connect", () => {navigate(-1)})
		gameSocket?.on("connect", () => {navigate(-1)})
	}, [chatSocket?.connected, gameSocket?.connected])
	return (
		<div className="flex-1" style={{
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