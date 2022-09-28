import { useContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Socket } from "socket.io-client";
import { setAuthToken } from "./authPage/authUtils/AuthUtils";
import Login from "./authPage/component/LogPage";
import Chat from "./Chat";
import { ChatContextProvider } from "./chat/ChatContext/chatContext";
import { SocketContext } from "./Context/socketContext";
import Dashboard from "./Dashboard";
import Footer from "./Footer";
import { GameContextProvider } from "./game/GameContext/gameContext";
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

const token = localStorage.getItem("token");
if (token) {
     setAuthToken(token);
}

export default function App()
{
	const {chatSocket, setChatSocket, gameSocket, setGameSocket} = useContext(SocketContext)
	const { storage, setStorage } = useLocalStorage("token");
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

	const handleSession = (sessionInfo:{ sessionId:string, roomId:string }, socket:Socket) => {
		console.log("In session menu", sessionInfo, chatSocket)
		if (socket)
		{
			setStorage("sessionId", sessionInfo.sessionId);
			setStorage("roomId", sessionInfo.roomId);
			socket.auth = { sessionId: sessionInfo.sessionId } ;		
			//socket.userID = userID;
		}
	}

	function handleGameOver(winnerId: string)
	{
		const message = winnerId === storage2.login ? "YOU WIN" : "YOU LOSE"
		console.log(message)
	}

	useEffect(() => {
		const timer = setTimeout(() => {
			setAlert({isShow:false, msg: ""})
		  }, 70000);
		  return () => clearTimeout(timer);
	}, [alert])

	useEffect(() => {
		if (getToken())
		{
			initiateSocket("http://localhost:8002")
			setChatSocket(getChatSocket())
			setGameSocket(getGameSocket())
			appSocketRoutine(handleSession, handleGameOver, handleError);
		}
	}, [storage])

    return (				
		<BrowserRouter>
			{
				alert.isShow &&
					<ErrorAlert errorMsg={alert.msg}/>
			}
			<NavBar />
			<Routes>
				<Route element={<PrivateRoute/>}>
					<Route path="/" element={<Home/> }/>
					<Route path="Dashboard" element={<Dashboard/> }/>
					<Route path="Chat/*" element=
					{
						<ChatContextProvider>
							<Chat/>
						</ChatContextProvider>
					}/>
					<Route path="Pong/*" element=
					{
						<GameContextProvider>
							<Pong/>
						</GameContextProvider>
					}/>
					<Route path="Settings" element={<Settings/>}/>
					<Route path="/Profile/:login" element={<Profile/>}/>
				</Route>
				<Route path="/Login" element={<Login/> }/>
				
			</Routes>
			<Footer/>
		</BrowserRouter>
		
    )
}