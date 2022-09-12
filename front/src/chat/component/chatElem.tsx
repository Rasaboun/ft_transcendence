import React, { useRef, useContext, useEffect, useState } from "react";
import { ChatContext } from "../ChatContext/chatContext";
import { chatHandler, inviteClient, sendMessage, setSocketManager } from "../ChatUtils/socketManager";
import Message from "../Elements/message";
import {ClientInfoT, messageT, UserStateT} from "../ChatUtils/chatType"
import { useNavigate } from "react-router-dom";

export default function ChatElem()
{
	const navigate = useNavigate();
    const lastMessageRef = useRef<HTMLDivElement | null>(null)
    const {socket, channel} = useContext(ChatContext)
    const [form, setForm] = useState({
        message:"",
        invite:"",
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

    const messageElem = messagesList?.map((elem, index) => (
        <Message key={index} 
            className={elem.sender === socket?.id ?
                "message message-right" : "message message-left"}
            message={elem}
            />
    ))
    useEffect(() => {
        setSocketManager(socket!)
        chatHandler(handleMessageReceived, handleChannelDeleted, handleClientInfo)

    }, [])

    useEffect(() => {
       scrollToBottom()
    }, [messagesList])

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
                    </div>
            }
            {
                userState?.isOwner &&
                    <button onClick={handleDelete}> deleteChannel </button>
            }
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