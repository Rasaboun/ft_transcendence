import React, { useContext, useEffect, useState } from "react";
import { chatMenuHandler, createChannel, getActiveChannels, getSocket, initiateSocket, joinChannel } from "../ChatUtils/socketManager";
import { ChannelT } from "../ChatUtils/chatType";
import { ChatContext } from "../ChatContext/chatContext";
import { useNavigate } from "react-router-dom";
import ChannelItem from "../Elements/channelItem";
import { Socket } from "socket.io-client";

export default function ChatMenu()
{
	const navigate = useNavigate();
	const {socket, setSocket, setChannel} = useContext(ChatContext)
	const [channels, setChannels] = useState<ChannelT[]>()
	const [name, setName] = useState<string>("")
	const newChannel = (name:string) => {
		createChannel(name)
	}

	const handleActiveChannels = (channels:ChannelT[]) => {
		setChannels(channels)
	}

	const handleChannelCreated = (channelId:string) => {
		setChannel(channelId)
		
	}

	const handleJoinChannel = (channelId:string) => {
		joinChannel(channelId)
	}

	const handleChannelJoined = ({clientId, channelId}:{clientId:string, channelId:string}) => {
		if (getSocket().id === clientId)
		{
			setChannel(channelId)
			navigate("message")
		}
	}

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }

    const handleSubmit = (e:React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (name !== "")
        {
			newChannel(name)
			navigate("message")
        }
        setName("")
    }

	const handleError = (message:string) => {
		window.alert(message)
	}

	useEffect(() => {
		initiateSocket("http://localhost:8002/chat")
		getActiveChannels()
		chatMenuHandler(handleActiveChannels, handleChannelCreated, handleChannelJoined, handleError)
		setSocket(getSocket())
		getSocket().on('channelCreated',(message:string) => setChannel(message))
	}, [])

	console.log(channels)

	const channelsElem = channels?.map((elem, index) => (
		<ChannelItem key={index}
			channelId={elem.channelId}
			nbClients={elem.nbClients}
			isPrivate={elem.isPrivate}
			isPasswordProtected={elem.isPasswordProtected}
			owner={elem.owner}
			handleJoinChannel={handleJoinChannel}
			/>
	))
    return (
        <div>
			<form onSubmit={handleSubmit}>
				<input style={{
					border: "1px solid black",
					marginRight: "15px"
				}}
				type="text" value={name} onChange={handleChange}/>
				<button type="submit" style={{
					height: "3vh",
					width: "17vh",
					backgroundColor: "#00ffff",
					borderRadius: "20px"
				}} >
					Create Channel
				</button>
			</form>
			<div>
				{channelsElem}
			</div>
        </div>
    )
}
