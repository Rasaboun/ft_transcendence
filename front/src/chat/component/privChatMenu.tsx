import React, { useContext, useEffect, useState } from "react";

import { chatMenuHandler, createChannel, getActiveChannels, getChatSocket, getGameSocket, initiateSocket, joinChannel, joinPrivChat, loadConnectedUsers } from "../../Utils/socketManager";
import { channelFormT, ChannelModes, ChannelT, connectedUsersT, JoinChannelT, privChatP } from "../ChatUtils/chatType";
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

	const handleActiveChannels = (channels:ChannelT[]) => {
		setChannels(channels)
	}

	const handleChannelJoined = (data:{clientId:string, channelInfo:ChannelT}) => {
        console.log(storage.login, data.clientId)
		if (storage.login === data.clientId)
		{
			console.log(data.channelInfo)
			setStorage("channel", data.channelInfo)
			navigate("/chat/message")
		}
	}
	
	const handlePrivChatJoined = (intraLogin: string) => {
		navigate("/chat/privMessage");
	}

	

	const handleInvitation = (message:string) => {
		window.alert(message)
	}

	const handleJoinPrivateChat = (intraLogin:string) => {
		joinPrivChat(intraLogin);
		navigate("/chat/privMessage");
	}	

	const loadConnectedUser = (connectedUsers:connectedUsersT[])=>
	{
		setConnectedUsers(connectedUsers);
	}

	useEffect(() => {

		initiateSocket("http://localhost:8002")
		setChatSocket(getChatSocket())
		setGameSocket(getGameSocket())
		loadConnectedUsers()
		chatMenuHandler(handleActiveChannels,
			handleChannelJoined,
			handleInvitation,
			loadConnectedUser,
			handlePrivChatJoined)
	}, [])

	const allNewpeople = connectedUsers?.map((elem, ind) => ( 
		<PrivChatItem key={ind}
			connectedUsers={elem}
			handleJoinPrivChat={handleJoinPrivateChat}
			/>
	))

    return (
		
        <div>
			<h1 style={{ fontSize: "20px", margin: "40px" }}> <strong> Users connected and open to chat with you:</strong></h1>
			{allNewpeople}
		</div>
    )
}