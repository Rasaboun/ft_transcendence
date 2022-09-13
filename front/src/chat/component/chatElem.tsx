import React, { useRef, useContext, useEffect, useState } from "react";
import { ChatContext } from "../ChatContext/chatContext";
import { chatHandler, inviteClient, leaveChannel, sendMessage, setChannelPassword, setSocketManager } from "../ChatUtils/socketManager";
import Message from "../Elements/message";
import {ClientInfoT, messageT, UserStateT} from "../ChatUtils/chatType"
import { useNavigate } from "react-router-dom";
import InfoMessage from "../Elements/InfoMessage";

export default function ChatElem()
{
	const navigate = useNavigate();
    const lastMessageRef = useRef<HTMLDivElement | null>(null)
    const {socket, channel} = useContext(ChatContext)
    const [form, setForm] = useState({
        message:"",
        invite:"",
        password:"",
    })
    const [messagesList, setMessagesList] = useState<messageT[]>()
    const [userState, setUserState] = useState<UserStateT>()
    
    const scrollToBottom = () => {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" })
      }

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setForm((oldForm) => ({
            ...oldForm,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmitMessage = (e:React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        const mutedMessage = "you are muted: 60sec left"
        if(!userState?.isMuted)
        {
            if (form.message !== "")
            {
                setMessagesList((oldMessagesList) => (
                    oldMessagesList === undefined ? [{sender: socket!.id ,content: form.message}] :
                        [...oldMessagesList, {sender: socket!.id ,content: form.message}]
                ))
                console.log(form.message)
                sendMessage(channel!, form.message)
            }
            setForm((oldForm) => ({
                ...oldForm,
                message: ""
            }))
        }
        else {
            setMessagesList((oldMessagesList) => (
                oldMessagesList === undefined ? [{content: mutedMessage, isInfo: true}] :
                    [...oldMessagesList, {content: mutedMessage, isInfo: true}]
            ))
        }

    }

	const handleSubmitInvite = (e:React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (form.invite !== "")
        {
			console.log(form.invite)
            inviteClient({channelName:channel!, clientId: form.invite})
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
                channelName: channel!,
                password: form.password
            })
        }
        setForm((oldForm) => ({
            ...oldForm,
            password: ""
        }))
    }

    const handleMessageReceived = ({sender, content}:messageT) => {
        console.log(sender, socket?.id, content)
        if(sender !== socket?.id)
        {
            setMessagesList((oldMessagesList) => (
                oldMessagesList === undefined ? [{sender: sender ,content: content}] :
                    [...oldMessagesList, {sender: sender ,content: content}]
            ))
        }
    }

    const handleChannelDeleted = (message:string) => {
        navigate(-1)
        window.alert(message)
    }

    const handleDelete = () => {
       socket?.emit("deleteChannel", channel)
    }

    const handleClientInfo = (data:ClientInfoT) => {
        setUserState({
            isOwner: data.isOwner,
            isAdmin: data.isAdmin,
            isMuted: data.isMuted
        })
    }

    const handleAddAdmin = () => {
        console.log("dsfkshkjfhsdjkh")
        setUserState((oldUserState) => ({
            ...oldUserState!,
            isAdmin: true
            })
        )
    }

    

    const handleBannedFromChannel = (id:string) => {
        const message = id === socket?.id ? 
            "You have been banned from the chat" :
            `${id} has been banned from the chat`

        setMessagesList((oldMessagesList) => (
            oldMessagesList === undefined ? [{content: message, isInfo: true}] :
                [...oldMessagesList, {content: message, isInfo: true}]
        ))
    }

    

    const handleMutedFromChannel = (id:string) => {
        const message = id === socket?.id ? 
            "You have been muted 60 sec" :
            `${id} has been muted for 60 sec`

        setMessagesList((oldMessagesList) => (
            oldMessagesList === undefined ? [{content: message, isInfo: true}] :
                [...oldMessagesList, {content: message, isInfo: true}]
        ))
        if (id === socket?.id)
        {
            setUserState((oldUserState) => ({
                ...oldUserState!,
                isMuted: true
                })
            )
        }
    }

    const handleLeaveChannel = () => {
        leaveChannel(channel!)
        navigate("/Chat")
    }

    const messageElem = messagesList?.map((elem, index) => (
        elem.isInfo ? 
            <InfoMessage key={index} message={elem}/> :
            <Message key={index} 
                className={elem.sender === socket?.id ?
                    "message message-right" : "message message-left"}
                message={elem}
            />
    ))
    useEffect(() => {
        setSocketManager(socket!)
        chatHandler(handleMessageReceived, handleChannelDeleted, handleClientInfo, handleBannedFromChannel, handleMutedFromChannel, handleAddAdmin)

    }, [])

    useEffect(() => {
       scrollToBottom()
    }, [messagesList])

    console.log(userState?.isAdmin)
    return (
        <div>
            {
                userState?.isAdmin &&
                    <div>
                        Owner 👑
                        <form onSubmit={handleSubmitInvite}>
                            <input style={{
                                border: "1px solid black",
                                marginRight: "15px"
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
                        <form onSubmit={handleSubmitPassword}>
                            <input style={{
                                border: "1px solid black",
                                marginRight: "15px"
                            }}
                            name="password" type="text" value={form.password} onChange={handleChange}/>
                            <button type="submit" style={{
                                height: "2vh",
                                width: "10vh",
                                backgroundColor: "#00ffff",
                                borderRadius: "20px"
                            }} >
                                set password
                            </button>
                        </form>   
                    </div>
            }
            {
                userState?.isOwner &&
                    <button onClick={handleDelete}> deleteChannel </button>
            }
            <div>
                <button onClick={handleLeaveChannel}>Leave</button>
            </div>

            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96">
                <div className="message-container">
                    {messageElem}
                    <div ref={lastMessageRef}/>
                </div>
            </div>
            <form onSubmit={handleSubmitMessage}>
                <input style={{
                    border: "1px solid black",
                    marginRight: "15px"
                }}
                name='message' type="text" value={form.message} onChange={handleChange}/>
                <button type="submit" style={{
                    height: "5vh",
                    width: "20vh",
                    backgroundColor: "#00ffff",
                    borderRadius: "20px"
                }} >
                    Send
                </button>
                
            </form>          
        </div>
    )
}