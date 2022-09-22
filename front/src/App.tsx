import React, { useContext, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import { appSocketRoutine, getSocket, initiateSocket } from "./Utils/socketManager";

export default function App()
{
	const {chatSocket, setChatSocket} = useContext(SocketContext)
	const { storage, setStorage } = useLocalStorage("token");

	const handleSession = (sessionInfo:{ sessionId:string, roomId:string }) => {
		console.log("In session menu", sessionInfo)
		if (chatSocket)
		{
			setStorage("sessionId", sessionInfo.sessionId);
			setStorage("roomId", sessionInfo.roomId);
			chatSocket.auth = { sessionId: sessionInfo.sessionId } ;		
			//socket.userID = userID;
		}
	}

	useEffect(() => {
		if (storage)
		{
			let sessionId = localStorage.getItem("sessionId");
			let roomId = localStorage.getItem("roomId");
			let sessioninfo;
			if (sessionId && roomId)
			{
				sessionId = JSON.parse(sessionId);
				roomId = JSON.parse(roomId);
				console.log("sessionId", sessionId)
				console.log("roomId", roomId)
				if (sessionId && roomId)
					sessioninfo = {sessionId: sessionId, roomId: roomId}
			}
			if (!chatSocket)
				initiateSocket("http://localhost:8002/chat", sessioninfo, storage.login)
			setChatSocket(getSocket())
			appSocketRoutine(handleSession);
		}
	}, [])
    return (
		<BrowserRouter>
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
				</Route>
				<Route path="/login" element={<Login/> }/>
			</Routes>
			<Footer/>
		</BrowserRouter>
    )
}