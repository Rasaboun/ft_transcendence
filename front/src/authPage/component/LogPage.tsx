import React, { useContext, useEffect, useState } from "react";
import { AuthFormT } from "../authUtils/AuthTypes";
import "../auth.css"
import axios from "axios";
import useLocalStorage from "../../hooks/localStoragehook";
import { useNavigate } from "react-router-dom";
import { getChatSocket, getGameSocket, initiateSocket } from "../../Utils/socketManager";
import { SocketContext } from "../../Context/socketContext";
import { setAuthToken } from "../authUtils/AuthUtils";

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

	const  handleSubmit =  (e:React.ChangeEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (authForm.username !== "" && authForm.password != "")
		{
			const url = button ? 'http://localhost:3002/auth/login' :
								'http://localhost:3002/auth/signup'

			axios.post(url, { ...authForm }).then(res => {
				if (button)
				{
					if (res.data.user)
					{
						console.log(res.data.user)
						setStorage("token", res.data.access_token)
						setStorage("user", res.data.user);

						initiateSocket("http://localhost:8002")
						
						setChatSocket(getChatSocket())
						setGameSocket(getGameSocket())
						setAuthToken(res.data.access_token);

					}	
					navigate("/")
				}
			  }).catch(e => console.log)
		}
	}

	const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
		setAuthForm((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value
		}))
	}

	useEffect(() => {
		console.log(chatSocket, gameSocket)
		chatSocket?.close()
		gameSocket?.close()
		localStorage.clear()
	}, [])
	return (
		<div className="auth-container">
			<form className="auth-form" onSubmit={handleSubmit}>
				<label className="auth-label">
					UserName
					<input className="auth-input" required name="username" type="text" value={authForm.username} onChange={handleChange}/>
				</label>
				<label className="auth-label">
					Password
					<input className="auth-input" required name="password" type="password" value={authForm.password} onChange={handleChange}/>
				</label>
				<div className="button-div">
					<button type="submit" onClick={() => setButton(true)}> Log In</button>
					<button type="submit" onClick={() => setButton(false)}> Sign IN</button>
				</div>
			</form>
		</div>
	)
}