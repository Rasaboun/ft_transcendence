import React, { useContext, useEffect, useState } from "react";
import { chatMenuHandler, createChannel, getActiveChannels, getSocket, initiateSocket, joinChannel } from "../ChatUtils/socketManager";
import { channelFormT, ChannelModes, ChannelT, JoinChannelT } from "../ChatUtils/chatType";
import { ChatContext } from "../ChatContext/chatContext";
import { useNavigate } from "react-router-dom";
import ChannelItem from "../Elements/channelItem";
import useLocalStorage from "../../hooks/localStoragehook";
import { Session } from "inspector";
import { Socket } from "socket.io-client";
import userEvent from "@testing-library/user-event";

export default function ChatMenu()
{
	const {storage} = useLocalStorage("user")
	//const {storage2} = useLocalStorage("sessionId")
	const {setStorage} = useLocalStorage()
	const navigate = useNavigate();
	const {socket, setSocket} = useContext(ChatContext)
	const [channels, setChannels] = useState<ChannelT[]>()
	const [channelForm, setChannelForm] = useState<channelFormT>({
		name: "",
		mode: ChannelModes.Public,
	})
	const [errorMsg, setErrorMsg] = useState({
		isShow: false,
		msg: ""
	})
	const newChannel = (channelForm:channelFormT) => {
		createChannel(channelForm)
	}

	const handleActiveChannels = (channels:ChannelT[]) => {
		setChannels(channels)
	}

	const handleJoinChannel = (data:JoinChannelT) => {
		joinChannel(data)
	}

	const handleChannelJoined = (data:{clientId:string, channelInfo:ChannelT}) => {
        console.log(data.channelInfo)
		if (storage.login === data.clientId)
		{
			setStorage("channel", data.channelInfo)
			navigate("message")
		}
	}

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
		setChannelForm((oldChannelForm) => ({
			...oldChannelForm,
			[e.target.name]: e.target.name === "mode" ?
				parseFloat(e.target.value) :
				e.target.value 
		}))
    }

    const handleSubmit = (e:React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
		if (channelForm.name !== "" &&
			((channelForm.mode === ChannelModes.Password &&
			channelForm.password &&
			channelForm.password !== "") || 
			channelForm.mode !== ChannelModes.Password))
		{
			newChannel(channelForm)
			setChannelForm((oldChannelForm) => ({
				...oldChannelForm,
				name: ""
			}))			
		}
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

	const handleSession = (sessionInfo:{ sessionId:string, roomId:string }, sock:Socket) => {
		console.log("In chat session");
		if (sock)
		{
			setStorage("sessionId", sessionInfo.sessionId);
			setStorage("roomId", sessionInfo.roomId);
			sock.auth = { sessionId: sessionInfo.sessionId } ;		
			//socket.userID = userID;
		}
	}

	useEffect(() => {
		let sessionId = localStorage.getItem("sessionId");
		let roomId = localStorage.getItem("roomId");
		let sessioninfo;
		if (sessionId && roomId)
		{
			sessionId = JSON.parse(sessionId);
			roomId = JSON.parse(roomId);
			console.log("sessionId", sessionId)
			console.log("roomId", roomId)
			if (sessionId && roomId)
				sessioninfo = {sessionId: sessionId, roomId: roomId}
		}
		console.log("Storage", storage);
		if (!socket)
			initiateSocket("http://localhost:8002/chat", setSocket, sessioninfo, storage.login)
		getActiveChannels()
		chatMenuHandler(handleActiveChannels,
			handleChannelJoined,
			handleError,
			handleInvitation,
			handleSession)
	}, [])

	useEffect(() => {
		const timeoutID = setTimeout(() => setErrorMsg({
			isShow: false,
			msg: ""
		}), 5000);
		return clearTimeout(timeoutID)
	}, [errorMsg])
	const channelsElem = channels?.map((elem, index) => (
		<ChannelItem key={index}
			channel={elem}
			handleJoinChannel={handleJoinChannel}
			/>
	))

    return (
        <div>
			{
				errorMsg.isShow && 
					<div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
						<p className="font-bold">ERROR</p>
						<p className="text-sm">{errorMsg.msg}</p>
					</div>
			}
			<div>
				<form className="channel-form" onSubmit={handleSubmit}>
					<input name="name" style={{
						border: "1px solid black",
						marginRight: "15px"
					}}
					type="text" value={channelForm.name} onChange={handleChange}/>
					{
						channelForm.mode !== ChannelModes.Password ?
						<div className="form-radio">
							<label>
								<input name="mode"
									type="radio" 
									value={ChannelModes.Public}
									checked={channelForm.mode === ChannelModes.Public}
									onChange={handleChange}
									/>
								Public
							</label>
							<label>
								<input name="mode" 
									type="radio"
									value={ChannelModes.Private}
									checked={channelForm.mode === ChannelModes.Private}
									onChange={handleChange}
									/>
									Private
							</label>
							<label>
								<input name="mode"
									type="radio"
									value={ChannelModes.Password}
									checked={false}
									onChange={handleChange}
									/>
								Password
							</label>
						</div> :
						<div>
							<button onClick={() => setChannelForm((oldChannelForm) => ({
								...oldChannelForm,
								mode: ChannelModes.Public,
								password: ""
								}))	} 
								className="button-action" >
								unset pass
							</button>
							<input name="password" style={{
							border: "1px solid black",
							marginRight: "15px"
						}}
						type="text" value={channelForm.password} onChange={handleChange}/>
						</div>
					}
					<button type="submit" className="button-action" >
						Create Channel
					</button>
				</form>
			</div>
			<div>
				{channelsElem}
			</div>
        </div>
    )
}