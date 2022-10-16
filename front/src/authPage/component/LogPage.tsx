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
				<button className="text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:focus:ring-indigo-800 shadow-lg shadow-indigo-500/50 dark:shadow-lg dark:shadow-indigo-800/80 font-medium rounded-lg text-sm px-10 py-5 text-center mr-2 mb-2 float-left" onClick={() => handleSubmit()} 
				>
					LOGIN
				</button>
			</div>
		</div>
	)
}