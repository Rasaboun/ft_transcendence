import { useContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { setAuthToken } from "./authPage/authUtils/AuthUtils";
import Login from "./authPage/component/LogPage";
import Chat from "./Chat";
import { SocketContext } from "./Context/socketContext";
import Dashboard from "./Dashboard";
import Footer from "./Footer";
import StarWars from "./StarWars";
import Home from "./Home";
import useLocalStorage from "./hooks/localStoragehook";
import NavBar from "./NavBar";
import Pong from "./Pong";
import { PrivateRoute } from "./PrivateRoute";
import Settings from "./Settings";
import Profile from "./Profile";
import { appSocketRoutine, getChatSocket, getGameSocket, initiateSocket } from "./Utils/socketManager";
import { getToken } from "./Utils/utils";
import ErrorAlert from "./Elements/error";
import LoginNavBar from "./LoginNavBar";
import Cookies from "js-cookie";
import TwoFactorAuth from "./2factorAuth";
import Friends from "./Friends";
import ErrorPage from "./404";

const token = localStorage.getItem("token");
if (token) {
    setAuthToken(JSON.parse(token));
}

export default function App()
{
	const navigate = useNavigate()
	const {chatSocket, setChatSocket, gameSocket, setGameSocket} = useContext(SocketContext)
	const { storage2 } = useLocalStorage("user");
	const [alert, setAlert] = useState({
		isShow: false,
		msg: ""
	})

	const handleError = (message:string) => {
		setAlert({
			isShow: true,
			msg: message
		})
	}
	
	function handleGameOver(winnerId: string)
	{
		const message = winnerId === storage2.login ? "YOU WIN" : "YOU LOSE"
		console.log(message)
	}

	function handleConnectionError ()
	{
		navigate("NotFound")
	}

	useEffect(() => {
		const timer = setTimeout(() => {
			setAlert({isShow:false, msg: ""})
		  }, 2000);
		  return () => clearTimeout(timer);
	}, [alert])



	useEffect(() => {
		if (getToken() != undefined)
		{
			initiateSocket("http://localhost:8002")
			setChatSocket(getChatSocket())
			setGameSocket(getGameSocket())
			appSocketRoutine(handleGameOver, handleError, handleConnectionError);
		}
	}, [getToken()])

    return (				
		<div>
			{
				alert.isShow &&
					<ErrorAlert errorMsg={alert.msg}/>
			}
			{Cookies.get('token') && storage2 ? 
				<NavBar /> :
				<LoginNavBar/>
			}
			<Routes>
				<Route element={<PrivateRoute/>}>
					<Route path="/" element={<Home/> }/>
					<Route path="Dashboard" element={<Dashboard/> }/>
					<Route path="Friends" element={<Friends/> }/>
					<Route path="About" element={<StarWars/> }/>
					<Route path="Chat/*" element={<Chat/>}/>
					<Route path="Pong/*" element={<Pong/>}/>
					<Route path="Settings" element={<Settings/>}/>
					<Route path="NotFound" element={<ErrorPage/>}/>
					<Route path="/Profile/:login" element={<Profile/>}/>
				</Route>
					<Route path="/Login" element={<Login/> }/>
					<Route path="/TwofactorAuth" element={<TwoFactorAuth/> }/>
				
				</Routes>
			<Footer/>
		</div>
		
    )
}