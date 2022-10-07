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
import ChatListElem from "../../Elements/ListElem";
import ChannelFormElem from "../Elements/channelFormElem";

function classNames(...classes:any[]) {
	return classes.filter(Boolean).join(' ')
  }

export default function ChannelMenu()
{
	const {storage} = useLocalStorage("user")
	const {setStorage} = useLocalStorage()
	const navigate = useNavigate();
	const {chatSocket, setChatSocket, setGameSocket} = useContext(SocketContext)
	const [channels, setChannels] = useState<ChannelT[]>()
	const [connectedUsers, setConnectedUsers] = useState<connectedUsersT[]>()
	const [errorMsg, setErrorMsg] = useState({
		isShow: false,
		msg: ""
	})


	const handleActiveChannels = (channels:ChannelT[]) => {
		setChannels(channels)
	}

	const handleJoinChannel = (data:JoinChannelT) => {
		joinChannel(data)
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

    

	const handleError = (message:string) => {
		setErrorMsg({
			isShow: true,
			msg: message
		})
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
		console.log("chaat menu chatSocket", chatSocket)
		console.log("connected", chatSocket?.connected);
		getActiveChannels()
		loadConnectedUsers()
		chatMenuHandler(handleActiveChannels,
			handleChannelJoined,
			handleInvitation,
			loadConnectedUser,
			handlePrivChatJoined)
	}, [])

	useEffect(() => {
		const timeoutID = setTimeout(() => setErrorMsg({
			isShow: false,
			msg: ""
		}), 5000);
		return clearTimeout(timeoutID)
	}, [errorMsg])

	const channelsElem = channels?.map((elem, index) => (
		<ChatListElem
              key={index}
            >
			<ChannelItem key={index}
				channel={elem}
				handleJoinChannel={handleJoinChannel}
				/>
		</ChatListElem>
		
	))
	
	
	/*<div style={{
            padding: "1em",
            border: "1px solid black",
			borderRadius: "5px",
        }}>
		<h6>Frank Erod</h6>

		connected since : 18:30
	</div>;
	*/

    return (
		
        <div >
			<ChannelFormElem/>
			{channelsElem}
        </div>
    )
}