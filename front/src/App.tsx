import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./authPage/component/LogPage";
import Chat from "./Chat";
import { ChatContextProvider } from "./chat/ChatContext/chatContext";
import Dashboard from "./Dashboard";
import Footer from "./Footer";
import { GameContextProvider } from "./game/GameContext/gameContext";
import Home from "./Home";
import useLocalStorage from "./hooks/localStoragehook";
import NavBar from "./NavBar";
import Pong from "./Pong";
import { PrivateRoute } from "./PrivateRoute";
import Settings from "./Settings";

export default function App()
{
	const { storage } = useLocalStorage("token");

	useEffect(() => {
		if (storage)
		{
			
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