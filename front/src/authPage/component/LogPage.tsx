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
		chatSocket?.close()
		gameSocket?.close()
		localStorage.clear()
		Cookies.remove("token");
		Cookies.remove("login");
		// eslint-disable-next-line
	}, [])
	return (
		<div className="flex h-screen" style={{ width: "100%", display: "flex", alignItems:"center", justifyContent: "center" }}>
			<div className="m-auto">
				<button className="bg-violet-300" onClick={() => handleSubmit()} 
				style={{ backgroundColor: "rgb(110, 44, 231)",
							color: "white", 
							width: "200px", 
							height: "100px",
							fontSize: "20px",
							borderRadius: "20px"}}>
					LOGIN
				</button>
			</div>
		</div>
	)
}