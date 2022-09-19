import React, { useContext, useEffect, useState } from "react";
import { chatMenuHandler, createChannel, getActiveChannels, getSocket, initiateSocket, joinChannel } from "../ChatUtils/socketManager";
import { ChannelT } from "../ChatUtils/chatType";
import { ChatContext } from "../ChatContext/chatContext";
import { useNavigate } from "react-router-dom";
import ChannelItem from "../Elements/channelItem";

export default function ChatMenu()
{
	const navigate = useNavigate();
	const {setSocket, setChannel} = useContext(ChatContext)
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
		setChannel(channelId)
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

	useEffect(() => {
		initiateSocket("http://localhost:8002/chat")
		getActiveChannels()
		chatMenuHandler(handleActiveChannels, handleChannelCreated)
		setSocket(getSocket())
		getSocket().on('channelCreated',(message:string) => setChannel(message))
	}, [])

	console.log(channels)

	const channelsElem = channels?.map((elem, index) => (
		<ChannelItem key={index}
			channelId={elem.channelId}
			clientsId={elem.clientsId}
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
				<button type="submit" className="text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:focus:ring-indigo-800 shadow-lg shadow-indigo-500/50 dark:shadow-lg dark:shadow-indigo-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2" >
					Create Channel
				</button>
			</form>
			<div>
				{channelsElem}
			</div>
        </div>
    )
}
