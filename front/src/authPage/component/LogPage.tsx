import { useContext, useEffect,  } from "react";
import "../auth.css"
import { SocketContext } from "../../Context/socketContext";
import { backUrl } from "../../Requests/users";
import Cookies from "js-cookie";

export default function LoginElem ()
{
	const { chatSocket,  gameSocket, } = useContext(SocketContext)

	const  handleSubmit = () => {
	
		window.open(backUrl + "/auth/login", "_self"); 
	
	}


	useEffect(() => {
		console.log(chatSocket, gameSocket)
		chatSocket?.close()
		gameSocket?.close()
		localStorage.clear()
		Cookies.remove("token");
		Cookies.remove("login");
	}, [])
	return (
		<div className="flex h-screen">
			<div className="m-auto">
				<button className="bg-violet-300" onClick={() => handleSubmit()}>
					LOGIN
				</button>
			</div>
		</div>
	)
}