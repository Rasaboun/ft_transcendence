import React, { useContext, useEffect, useState } from "react";
import { chatMenuHandler, createChannel, getActiveChannels, getSocket, initiateSocket, joinChannel } from "../ChatUtils/socketManager";
import { ChannelT } from "../ChatUtils/chatType";
import { ChatContext } from "../ChatContext/chatContext";
import { Link } from "react-router-dom";
import ChannelItem from "../Elements/channelItem";

export default function ChatMenu()
{
	const {setSocket, setChannel} = useContext(ChatContext)
	const [channels, setChannels] = useState<ChannelT[]>()
	const newChannel = () => {
		createChannel()

	}

	const handleActiveChannels = (channels:ChannelT[]) => {
		setChannels(channels)
	}

	const handleChannelCreated = (channelId:string) => {
		setChannel(channelId)
	}

	const handleJoinChannel = (channelId:string) => {
		joinChannel(channelId)
		setChannel(channelId)
	}

	useEffect(() => {
		initiateSocket("http://localhost:8002/chat")
		getActiveChannels()
		chatMenuHandler(handleActiveChannels, handleChannelCreated)
		setSocket(getSocket())
		getSocket().on('channelCreated',(message:string) => setChannel(message))
	}, [])

	const channelsElem = channels?.map((elem, index) => (
		<ChannelItem key={index}
			channelId={elem.channelId}
			clientsId={elem.clientsId}
			handleJoinChannel={handleJoinChannel}
			/>
	))
    return (
        <div>
			<Link to="message">
				<button onClick={() => newChannel()}>Creat channel</button>
			</Link>
			<div>
				{channelsElem}
			</div>
        </div>
    )
}
