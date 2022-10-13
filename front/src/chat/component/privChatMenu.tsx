import React, { useContext, useEffect, useState } from "react";

import { chatMenuHandler,  getChatSocket, getGameSocket, getUsers, initiateSocket, joinPrivChat, privChatMenuHandler } from "../../Utils/socketManager";
import { ChannelT, connectedUsersT, JoinChannelT, privChatP } from "../ChatUtils/chatType";
import { ChatContext } from "../ChatContext/chatContext";
import { useNavigate } from "react-router-dom";
import ChannelItem from "../Elements/channelItem";
import useLocalStorage from "../../hooks/localStoragehook";
import { Socket } from "socket.io-client";
import { SocketContext } from "../../Context/socketContext";
import { getSession } from "../../Utils/utils";
import PrivChatItem from "../Elements/privChatItem";
import { Tab } from "@headlessui/react";
import RadioFormElem from "../../Elements/radioFormElem";

export default function PrivChatMenu()
{
	const {storage} = useLocalStorage("user")
	const {setStorage} = useLocalStorage()
	const navigate = useNavigate();
	const {setChatSocket, setGameSocket} = useContext(SocketContext)
	const [channels, setChannels] = useState<ChannelT[]>()
	const [connectedUsers, setConnectedUsers] = useState<connectedUsersT[]>()

	
	// const handlePrivChatJoined = (intraLogin: string) => {
	// 	navigate("/chat/privMessage", );
	// }

	

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

		initiateSocket("http://localhost:8002")
		setChatSocket(getChatSocket())
		setGameSocket(getGameSocket())
		getUsers();
		privChatMenuHandler(loadConnectedUsers)	
	}, [])

	const users = connectedUsers?.map((elem, ind) => {
		if (elem.intraLogin == storage.login)
			return ; 
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