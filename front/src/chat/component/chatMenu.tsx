import React, { useContext, useEffect, useState } from "react";
import { chatMenuHandler, createChannel, getActiveChannels, getSocket, initiateSocket } from "../ChatUtils/socketManager";
import { ChannelT } from "../ChatUtils/chatType";
import { ChatContext } from "../ChatContext/chatContext";
import { Link } from "react-router-dom";
import ChannelItem from "../Elements/channelItem";

export default function ChatMenu()
{
	const {socket, setSocket} = useContext(ChatContext)
	const [channels, setChannels] = useState<ChannelT[]>()
	const newChannel = () => {
		createChannel()
	}

	const handleActiveChannels = (channels:ChannelT[]) => {
		setChannels(channels)
	}

	useEffect(() => {
		initiateSocket("http://localhost:8002/chat")
		getActiveChannels()
		chatMenuHandler(handleActiveChannels)
		setSocket(getSocket())
		getSocket().on('channelCreated',(message:string) => console.log(message))
	}, [])

	const channelsElem = channels?.map((elem, index) => (
		<ChannelItem channelId={elem.channelId} clientsId={elem.clientsId}/>
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
