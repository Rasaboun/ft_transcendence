import React, { useContext, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Socket } from "socket.io-client";
import Login from "./authPage/component/LogPage";
import Chat from "./Chat";
import { ChatContextProvider } from "./chat/ChatContext/chatContext";
import { SocketContext } from "./Context/socketContext";
import Dashboard from "./Dashboard";
import Footer from "./Footer";
import { GameContextProvider } from "./game/GameContext/gameContext";
import { GameState } from "./game/GameUtils/type";
import Home from "./Home";
import useLocalStorage from "./hooks/localStoragehook";
import NavBar from "./NavBar";
import Pong from "./Pong";
import { PrivateRoute } from "./PrivateRoute";
import Settings from "./Settings";
import { appSocketRoutine, getChatSocket, getGameSocket, initiateSocket } from "./Utils/socketManager";
import { getSession } from "./Utils/utils";

export default function App()
{
	const {gameState, setGameState, chatSocket, setChatSocket, gameSocket, setGameSocket} = useContext(SocketContext)
	const { storage, setStorage } = useLocalStorage("token");
	const { storage2 } = useLocalStorage("user");

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
		setGameState(GameState.None)
	}

	useEffect(() => {
		console.log("APP RENDER")
		if (storage)
		{
			initiateSocket("http://localhost:8002", getSession(), storage2.login)
			setChatSocket(getChatSocket())
			setGameSocket(getGameSocket())
			appSocketRoutine(handleSession, handleGameOver);
			console.log("LA")
		}
	}, [storage])
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