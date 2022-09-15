import React, { useContext, useEffect, useState } from "react";
import { chatMenuHandler, createChannel, getActiveChannels, getSocket, initiateSocket, joinChannel } from "../ChatUtils/socketManager";
import { channelFormT, ChannelModes, ChannelT, JoinChannelT } from "../ChatUtils/chatType";
import { ChatContext } from "../ChatContext/chatContext";
import { useNavigate } from "react-router-dom";
import ChannelItem from "../Elements/channelItem";

export default function ChatMenu()
{
	const navigate = useNavigate();
	const {socket, setSocket, setChannel} = useContext(ChatContext)
	const [channels, setChannels] = useState<ChannelT[]>()
	const [channelForm, setChannelForm] = useState<channelFormT>({
		name: "",
		mode: ChannelModes.Public,
	})
	const newChannel = (channelForm:channelFormT) => {
		createChannel(channelForm)
	}

	const handleActiveChannels = (channels:ChannelT[]) => {
		setChannels(channels)
	}

	const handleChannelCreated = (channelInfo:ChannelT) => {
		console.log(channelInfo)
		setChannel(channelInfo)
	}

	const handleJoinChannel = (data:JoinChannelT) => {
		joinChannel(data)
	}

	const handleChannelJoined = ({clientId, channelInfo}:{clientId:string, channelInfo:ChannelT}) => {
		console.log("chauuuud",channelInfo)
		if (getSocket().id === clientId)
		{
			setChannel(channelInfo)
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
			console.log("valide pass")
			newChannel(channelForm)
			setChannelForm((oldChannelForm) => ({
				...oldChannelForm,
				name: ""
			}))			
		}
    }

	const handleError = (message:string) => {
		window.alert(message)
	}

	const handleInvitation = (message:string) => {
		window.alert(message)
	}

	useEffect(() => {
		initiateSocket("http://localhost:8002/chat")
		getActiveChannels()
		chatMenuHandler(handleActiveChannels, handleChannelCreated, handleChannelJoined, handleError, handleInvitation)
		setSocket(getSocket())
	}, [])

	console.log(channels)

	const channelsElem = channels?.map((elem, index) => (
		<ChannelItem key={index}
			channel={elem}
			handleJoinChannel={handleJoinChannel}
			/>
	))

	console.log(channelForm)
    return (
        <div>
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
