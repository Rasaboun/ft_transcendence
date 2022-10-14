import React, { useContext, useEffect, useState } from "react";

import { chatMenuHandler, createChannel, getActiveChannels, getChatSocket, getGameSocket, initiateSocket, joinChannel, joinPrivChat} from "../../Utils/socketManager";
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
import Loader from "../../Elements/loader";

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
		if (storage.login === data.clientId)
		{
			console.log(data.channelInfo)
			setStorage("channel", data.channelInfo)
			navigate("/chat/message", {
				state: {
					channelName: data.channelInfo.channelId
				}
			})
		}
	}
	
	const handlePrivChatJoined = (intraLogin: string) => {
		navigate("/chat/privMessage");
	}

	const handleInvitation = (message:string) => {
		window.alert(message)
	}

	const loadConnectedUser = (connectedUsers:connectedUsersT[])=>
	{
		setConnectedUsers(connectedUsers);
	}

	useEffect(() => {

		initiateSocket("http://localhost:${process.env.SOCKET_PORT}")
		setChatSocket(getChatSocket())
		setGameSocket(getGameSocket())
		getActiveChannels()
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
	
	
    return (
		
        <div >
			<Loader condition={chatSocket?.connected}>
				<ChannelFormElem/>
				{channelsElem}
			</Loader>
			
        </div>
    )
}