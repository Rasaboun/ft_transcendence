import { channel } from "diagnostics_channel";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "../../hooks/localStoragehook";
import { ChatContext } from "../ChatContext/chatContext";
import { ChannelModes, ClientElem, UserStateT } from "../ChatUtils/chatType";
import { inviteClient, leaveChannel, setChannelPassword, setPrivateMode, unsetChannelPassword, unsetPrivateMode } from "../ChatUtils/socketManager";
import UserListElem from "./UserListElem";

type PropsT = {
    userState?: UserStateT
}

export default function ChannelBoard({userState}:PropsT)
{
    const {storage} = useLocalStorage("user");
    const {storage2, setStorage} = useLocalStorage("channel");
    const {socket} = useContext(ChatContext)
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
            inviteClient({channelName: storage2!.channelId, clientId: form.invite})
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
                channelName: storage2!.channelId,
                password: form.password
            })
            if (storage2?.mode !== ChannelModes.Password)
            {
                setStorage("channel", {
                    channelId: storage2!.channelId,
                    nbClients: storage2!.nbClients,
                    mode: ChannelModes.Password,
                    owner: storage2!.owner
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
        leaveChannel(storage2!.channelId)
        navigate("/Chat")
    }

    const handleUnsetPassword = () => {
        unsetChannelPassword(storage2!.channelId)
        setStorage("channel", {
            channelId: storage2!.channelId,
            nbClients: storage2!.nbClients,
            mode: ChannelModes.Public,
            owner: storage2!.owner
        })
    }

    const handleUnsetPrivMode = () => {
        unsetPrivateMode(storage2!.channelId)
        setStorage("channel", {
            channelId: storage2!.channelId,
            nbClients: storage2!.nbClients,
            mode: ChannelModes.Public,
            owner: storage2!.owner
        })
    }

    const handleSetInvite = () => {
        setPrivateMode(storage2!.channelId)
        setStorage("channel", {
            channelId: storage2!.channelId,
            nbClients: storage2!.nbClients,
            mode: ChannelModes.Private,
            owner: storage2!.owner
        })
    }

    const handleDelete = () => {
        socket?.emit("deleteChannel", storage2?.channelId)
     }

    let ownerList: ClientElem[] = [];
    let adminsList: ClientElem[] = [];
    let othersList: ClientElem[] = [];
    
    storage2?.clients.forEach((elem:ClientElem, index:number) => {
        elem.isOwner && ownerList.push(elem)
        elem.isAdmin && !elem.isOwner && adminsList.push(elem)
        !elem.isAdmin && !elem.isOwner && othersList.push(elem)
    })

    console.log("admin, other", adminsList, othersList)
    return (
        <div className="chat-left">
            {
                userState?.isAdmin &&
                    <div>
                        {`${storage.username} 👑`}
                        {
                            storage2?.mode === ChannelModes.Public &&
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
                            storage2?.mode === ChannelModes.Private &&
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
                                {storage2?.mode === ChannelModes.Public ?
                                "set password" : "change password"}
                            </button>
                        </form>
                        {
                            storage2?.mode !== ChannelModes.Public &&
                                <button onClick={storage2?.mode === ChannelModes.Password ? 
                                    handleUnsetPassword:
                                    handleUnsetPrivMode}>
                                    unset Mode ❌
                                </button> 
                        }
                        
                    </div>
            }
            <div className="user-list">
                {ownerList.length !== 0 && <h2>Owner</h2>}
                    {ownerList.map((elem:ClientElem, index:number) => 
                        <UserListElem key={index} client={elem} userState={userState}/>
                        )
                    }
                
                {adminsList.length !== 0 && <h2>Admin</h2>}
                    {adminsList.map((elem:ClientElem, index:number) => 
                        <UserListElem key={index} client={elem} userState={userState}/>
                        )
                    }
                {othersList.length !== 0 && <h2>Les Paillots</h2>}
                    {othersList.map((elem:ClientElem, index:number) => 
                        <UserListElem key={index} client={elem} userState={userState}/>
                        )
                    }
            </div>
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