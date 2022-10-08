import React, { useContext, useEffect, useState } from "react";
import { AuthFormT } from "../authUtils/AuthTypes";
import "../auth.css"
import axios from "axios";
import useLocalStorage from "../../hooks/localStoragehook";
import { useNavigate } from "react-router-dom";
import { getChatSocket, getGameSocket, initiateSocket } from "../../Utils/socketManager";
import { SocketContext } from "../../Context/socketContext";
import { setAuthToken } from "../authUtils/AuthUtils";
import { backUrl } from "../../Requests/users";
import Cookies from "js-cookie";

export default function LoginElem ()
{
	const { chatSocket, setChatSocket, gameSocket, setGameSocket } = useContext(SocketContext)
	const navigate = useNavigate()
	const {setStorage} = useLocalStorage()
	const [authForm, setAuthForm] = useState<AuthFormT>({
		username: "",
		password: ""
	})

	const [button, setButton] = useState(true)

	const  handleSubmit = () => {
	
		window.open(backUrl + "/auth/login", "_self"); 
	
	}


	useEffect(() => {
		console.log(chatSocket, gameSocket)
		chatSocket?.close()
		gameSocket?.close()
		localStorage.clear()
		//Cookies.remove("token");
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