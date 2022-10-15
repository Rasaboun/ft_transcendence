import { useContext, useEffect, useState } from "react";

import {  getChatSocket, getGameSocket, getUsers, initiateSocket, joinPrivChat, privChatMenuHandler } from "../../Utils/socketManager";
import {  connectedUsersT } from "../ChatUtils/chatType";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "../../hooks/localStoragehook";
import { SocketContext } from "../../Context/socketContext";
import PrivChatItem from "../Elements/privChatItem";

export default function PrivChatMenu()
{
	const {storage} = useLocalStorage("user")
	const navigate = useNavigate();
	const {setChatSocket, setGameSocket} = useContext(SocketContext)
	const [connectedUsers, setConnectedUsers] = useState<connectedUsersT[]>()

	
	

	const handleJoinPrivateChat = (user: connectedUsersT) => {
		joinPrivChat(user.intraLogin);
		navigate("/chat/privMessage", {
			state: {
				chatName: user.intraLogin
			}
		});
	}	

	const loadConnectedUsers = (connectedUsers:connectedUsersT[])=>
	{
		setConnectedUsers(connectedUsers);
	}

	useEffect(() => {

		initiateSocket()
		setChatSocket(getChatSocket())
		setGameSocket(getGameSocket())
		getUsers();
		privChatMenuHandler(loadConnectedUsers)	
	}, [])

	const users = connectedUsers?.map((elem, ind) => {
		if (elem.intraLogin === storage.login)
			return "";
		return <PrivChatItem key={ind}
			user={elem}
			handleJoinPrivChat={handleJoinPrivateChat}
			/>
	})

    return (
		
        <div>
			<h1 style={{ fontSize: "20px", margin: "40px" }}> <strong> Users connected and open to chat with you:</strong></h1>
			{users}
		</div>
    )
}