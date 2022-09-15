import { channel } from "diagnostics_channel";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatContext } from "../ChatContext/chatContext";
import { ChannelModes, UserStateT } from "../ChatUtils/chatType";
import { inviteClient, leaveChannel, setChannelPassword, setPrivateMode, unsetChannelPassword, unsetPrivateMode } from "../ChatUtils/socketManager";

type PropsT = {
    userState?: UserStateT
}

export default function ChannelBoard({userState}:PropsT)
{
    const {socket, channel, setChannel} = useContext(ChatContext)
    const navigate = useNavigate()
    const [form, setForm] = useState({
        message:"",
        invite:"",
        password:"",
    })

    const handleSubmitInvite = (e:React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (form.invite !== "")
        {
            inviteClient({channelName:channel!.channelId, clientId: form.invite})
        }
        setForm((oldForm) => ({
            ...oldForm,
            invite: ""
        }))
    }

    const handleSubmitPassword = (e:React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (form.password !== "")
        {
			console.log(form.password)
            setChannelPassword(
            {
                channelName: channel!.channelId,
                password: form.password
            })
            if (channel?.mode !== ChannelModes.Password)
            {
                setChannel({
                    channelId: channel!.channelId,
                    nbClients: channel!.nbClients,
                    mode: ChannelModes.Password,
                    owner: channel!.owner
                })
            }  
        }
        setForm((oldForm) => ({
            ...oldForm,
            password: ""
        }))
    }

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setForm((oldForm) => ({
            ...oldForm,
            [e.target.name]: e.target.value
        }))
    }

    const handleLeaveChannel = () => {
        leaveChannel(channel!.channelId)
        navigate("/Chat")
    }

    const handleUnsetPassword = () => {
        unsetChannelPassword(channel!.channelId)
        setChannel({
            channelId: channel!.channelId,
            nbClients: channel!.nbClients,
            mode: ChannelModes.Public,
            owner: channel!.owner
        })
    }

    const handleUnsetPrivMode = () => {
        unsetPrivateMode(channel!.channelId)
        setChannel({
            channelId: channel!.channelId,
            nbClients: channel!.nbClients,
            mode: ChannelModes.Public,
            owner: channel!.owner
        })
    }

    const handleSetInvite = () => {
        setPrivateMode(channel!.channelId)
        setChannel({
            channelId: channel!.channelId,
            nbClients: channel!.nbClients,
            mode: ChannelModes.Private,
            owner: channel!.owner
        })
    }

    const handleDelete = () => {
        socket?.emit("deleteChannel", channel)
     }

    return (
        <div className="chat-left">
            {
                userState?.isAdmin &&
                    <div>
                        {`${socket?.id} 👑`}
                        {
                            channel?.mode === ChannelModes.Public &&
                                <button onClick={handleSetInvite} style={{
                                    height: "2vh",
                                    width: "10vh",
                                    backgroundColor: "#00ffff",
                                    borderRadius: "20px"
                                }} >
                                    invite
                                </button>  
                        }
                        {
                            channel?.mode === ChannelModes.Private &&
                                <form onSubmit={handleSubmitInvite}>
                                    <input style={{
                                        border: "1px solid black",
                                        marginRight: "15px",
                                        color: "black",
                                        padding: "5px"
                                    }}
                                    name="invite" type="text" value={form.invite} onChange={handleChange}/>
                                    <button type="submit" style={{
                                        height: "2vh",
                                        width: "10vh",
                                        backgroundColor: "#00ffff",
                                        borderRadius: "20px"
                                    }} >
                                        invite
                                    </button>
                                </form>
                        }
                        <form onSubmit={handleSubmitPassword}>
                            <input style={{
                                border: "1px solid black",
                                marginRight: "15px",
                                color: "black",
                                padding: "5px"
                            }}
                            name="password" type="text" value={form.password} onChange={handleChange}/>
                            <button type="submit" style={{
                                height: "2vh",
                                width: "10vh",
                                backgroundColor: "#00ffff",
                                borderRadius: "20px"
                            }} >
                                {channel?.mode === ChannelModes.Public ?
                                "set password" : "change password"}
                            </button>
                        </form>
                        {
                            channel?.mode !== ChannelModes.Public &&
                                <button onClick={channel?.mode === ChannelModes.Password ? 
                                    handleUnsetPassword:
                                    handleUnsetPrivMode}>
                                    unset Mode ❌
                                </button> 
                        }
                        
                    </div>
            }
            
            <div className="bottom-button">
            {
                userState?.isOwner &&
                    <button onClick={handleDelete}> 🗑️ </button>
            }
                <button onClick={handleLeaveChannel}>❌</button>
            </div>
        </div>
    )
}