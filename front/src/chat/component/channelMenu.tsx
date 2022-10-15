import  { useContext, useEffect, useState } from "react";

import { chatMenuHandler, getActiveChannels, getChatSocket, getGameSocket, initiateSocket, joinChannel } from "../../Utils/socketManager";
import {  ChannelT,  JoinChannelT } from "../ChatUtils/chatType";
import { useNavigate } from "react-router-dom";
import ChannelItem from "../Elements/channelItem";
import useLocalStorage from "../../hooks/localStoragehook";
import { SocketContext } from "../../Context/socketContext";
import ChatListElem from "../../Elements/ListElem";
import ChannelFormElem from "../Elements/channelFormElem";
import Loader from "../../Elements/loader";


export default function ChannelMenu()
{
	const {storage} = useLocalStorage("user")
	const {setStorage} = useLocalStorage()
	const navigate = useNavigate();
	const {chatSocket, setChatSocket, setGameSocket} = useContext(SocketContext)
	const [channels, setChannels] = useState<ChannelT[]>()
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
		console.log('Channel joined', data);
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

	const handleInvitation = (message:string) => {
		window.alert(message)
	}

	useEffect(() => {

		initiateSocket()
		setChatSocket(getChatSocket())
		setGameSocket(getGameSocket())
		getActiveChannels()
		chatMenuHandler(handleActiveChannels,
			handleChannelJoined,
			handleInvitation,)
		
	// eslint-disable-next-line
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