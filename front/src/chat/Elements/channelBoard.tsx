import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "../../hooks/localStoragehook";
import { ChannelModes, ChannelT, ClientElem, UserStateT } from "../ChatUtils/chatType";
import { deleteChannel, inviteClient, leaveChannel, setChannelPassword, setPrivateMode, unsetChannelPassword, unsetPrivateMode } from "../../Utils/socketManager";
import UserListElem from "./UserListElem";

type PropsT = {
    userState?: UserStateT,
    channel?:ChannelT,
    setChannelInfo:(channel:any) => void
}

export default function ChannelBoard({userState, channel, setChannelInfo}:PropsT)
{
    let ownerList: ClientElem[] = [];
    let adminsList: ClientElem[] = [];
    let othersList: ClientElem[] = [];
    const {storage} = useLocalStorage("user");
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
            inviteClient({channelName: channel!.channelId, clientId: form.invite})
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
                setChannelInfo((oldChannel:ChannelT) => ({
                    ...oldChannel!,
                    mode: ChannelModes.Password,
                })
            )}  
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
        setChannelInfo((oldChannel:ChannelT) => ({
            ...oldChannel!,
            mode: ChannelModes.Public,
        }))
    }

    const handleUnsetPrivMode = () => {
        unsetPrivateMode(channel!.channelId)
        setChannelInfo((oldChannel:ChannelT) => ({
            ...oldChannel!,
            mode: ChannelModes.Public,
        }))
    }

    const handleSetInvite = () => {
        setPrivateMode(channel!.channelId)
        setChannelInfo((oldChannel:ChannelT) => ({
            ...oldChannel!,
            mode: ChannelModes.Private,
        }))
    }

    const handleDelete = () => {
        deleteChannel(channel!.channelId)
     }
    
	useEffect(() => {
		channel?.clients?.forEach((elem:ClientElem, index:number) => {
			elem.isOwner && ownerList.push(elem)
			elem.isAdmin && !elem.isOwner && adminsList.push(elem)
			!elem.isAdmin && !elem.isOwner && othersList.push(elem)
		})
	}, [])
    
    channel?.clients?.forEach((elem:ClientElem, index:number) => {
        elem.isOwner && ownerList.push(elem)
        elem.isAdmin && !elem.isOwner && adminsList.push(elem)
        !elem.isAdmin && !elem.isOwner && othersList.push(elem)
    })
    return (
        <div className="flex flex-col bg-indigo-500  border-solid border-2 rounded-lg">
            <h1>{ channel!.channelId }</h1>
            {
                userState?.isAdmin &&
                    <div className="mx-2 ">
                        {`${storage.username} 👑`}
                        {
                            channel?.mode === ChannelModes.Public &&
                                <button onClick={handleSetInvite} className="focus:outline-none text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-2.5 py-2 mb-2" >
                                    invite
                                </button>  
                        }
                        {
                            channel?.mode === ChannelModes.Private &&
                                <form onSubmit={handleSubmitInvite}>
                                    <input className="g-indigo-50 border border-indigo-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                                    name="invite" type="text" value={form.invite} onChange={handleChange}/>
                                    <button type="submit" className="focus:outline-none text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-2.5 py-2 mb-2" >
                                        invite
                                    </button>
                                </form>
                        }
                        <form onSubmit={handleSubmitPassword}>
                            <input className="bg-indigo-50 border border-indigo-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                            name="password" type="text" value={form.password} onChange={handleChange}/>
                            <button type="submit" className="focus:outline-none text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-2.5 py-2 mb-2" >
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
            <div className="mx-2 max-h-48 overflow-scroll">
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
                {othersList.length !== 0 && <h2>Others</h2>}
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