import React, { useContext, useEffect, useState } from "react";
import { chatMenuHandler, createChannel, getActiveChannels, getChatSocket, getGameSocket, initiateSocket, joinChannel, joinPrivChat, loadConnectedUsers } from "../../Utils/socketManager";
import { channelFormT, ChannelModes, ChannelT, connectedUsersT, JoinChannelT, privChatP } from "../ChatUtils/chatType";
import { ChatContext } from "../ChatContext/chatContext";
import { useNavigate } from "react-router-dom";
import ChannelItem from "../Elements/channelItem";
import useLocalStorage from "../../hooks/localStoragehook";
import { Session } from "inspector";
import { Socket } from "socket.io-client";
import userEvent from "@testing-library/user-event";
import { SocketContext } from "../../Context/socketContext";
import { getSession } from "../../Utils/utils";
import PrivChatItem from "../Elements/privChatItem";

export default function ChatMenu()
{
	const {storage} = useLocalStorage("user")
	const {setStorage} = useLocalStorage()
	const navigate = useNavigate();
	const {chatSocket, setChatSocket, setGameSocket} = useContext(SocketContext)
	const [channels, setChannels] = useState<ChannelT[]>()
	const [connectedUsers, setConnectedUsers] = useState<connectedUsersT[]>()
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
			sock.auth = { sessionId: sessionInfo.sessionId };
			//socket.userID = userID;
		}
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

		initiateSocket("http://localhost:8002", getSession(), storage.login)
		setChatSocket(getChatSocket())
		setGameSocket(getGameSocket())
		console.log("chaat menu chatSocket", chatSocket)
		console.log("connected", chatSocket?.connected);
		getActiveChannels()
		loadConnectedUsers()
		chatMenuHandler(handleActiveChannels,
			handleChannelJoined,
			handleError,
			handleInvitation,
			handleSession,
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
		<ChannelItem key={index}
			channel={elem}
			handleJoinChannel={handleJoinChannel}
			/>
	))
	
	const allNewpeople = connectedUsers?.map((elem, ind) => ( 
		<PrivChatItem key={ind}
			connectedUsers={elem}
			handleJoinPrivChat={handleJoinPrivateChat}
			/>
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
			<div>
				<h1 style={{ fontSize: "20px", margin: "40px" }}> <strong> Users connected and open to chat with you:</strong></h1>
				{allNewpeople}
			</div>
        </div>
    )
}