import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Chat from "./Chat";
import { ChatContextProvider } from "./chat/ChatContext/chatContext";
import Dashboard from "./Dashboard";
import Footer from "./Footer";
import { GameContextProvider } from "./game/GameContext/gameContext";
import Home from "./Home";
import useLocalStorage from "./hooks/localStoragehook";
import NavBar from "./NavBar";
import Pong from "./Pong";
import Settings from "./Settings";

export default function App()
{
	const {storage, setStorage} = useLocalStorage()

	useEffect(() => {
		setStorage("user", {
			intraId: 1,
			username: "Meetch",
			photoUrl: "https://i1.wp.com/dreamleaguesoccer.com.br/wp-content/uploads/psg-logo.png?fit=512%2C512&ssl=1"
		})
	}, [])
    return (
		<BrowserRouter>
			<NavBar />
			<Routes>
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
			</Routes>
			<Footer/>
		</BrowserRouter>
    )
}