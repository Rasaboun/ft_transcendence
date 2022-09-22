import React, { useRef, useContext, useEffect, useState } from "react";
import { ChatContext } from "../ChatContext/chatContext";
import { chatHandler, getClientInfo, getSocket, initiateSocket, sendMessage } from "../../Utils/socketManager";
import Message from "../Elements/message";
import {ActionOnUser, ChannelModes, ChannelT, ClientInfoT, messageT, UserStateT} from "../ChatUtils/chatType"
import { useNavigate } from "react-router-dom";
import InfoMessage from "../Elements/InfoMessage";
import ChannelBoard from "../Elements/ChannelBoard";
import useLocalStorage from "../../hooks/localStoragehook";
import MessageInput from "./MessageInput";
import { Socket } from "socket.io-client";
import { SocketContext } from "../../Context/socketContext";
import { getSession } from "../../Utils/utils";

export default function ChatElem()
{
    const {storage, setStorage} = useLocalStorage("user")
	const {storage2} = useLocalStorage("channel")
	const navigate = useNavigate();
    const lastMessageRef = useRef<HTMLDivElement | null>(null)
    const {chatSocket, setChatSocket} = useContext(SocketContext)
    const [form, setForm] = useState({
        message:"",
        invite:"",
        password:"",
    })
    const [messagesList, setMessagesList] = useState<messageT[]>()
    const [userState, setUserState] = useState<UserStateT>()
    const [mutedTime, setMutedTime] = useState(0)
    
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
                sendMessage(storage2!.channelId, form.message)
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

    const handleMessageReceived = (msg:messageT) => {
        setMessagesList((oldMessagesList) => (
            oldMessagesList === undefined ? [msg] :
                [...oldMessagesList, msg]
        ))
    }

    const handleLeftChannel = (channelInfo:ChannelT) => {
        setStorage("channel", channelInfo)        
    }

    const handleChannelJoined = (data:{clientId:string, channelInfo:ChannelT}) => {
        console.log(data.channelInfo)
        setStorage("channel", data.channelInfo)
	}
    const upgradeToOwner = (channelName:string) => {
        const message = `You are now Owner`;
        setUserState((oldUserState) => ({
            ...oldUserState!,
            isOwner: true,
            isAdmin: true
            }));
        setMessagesList((oldMessagesList) => (
            oldMessagesList === undefined ? [{content: message, isInfo: true}] :
                [...oldMessagesList, {content: message, isInfo: true}]
        ));
    }

    const handleIsAlreadyAdmin = () => {
        const message = `Is already admin`
        setMessagesList((oldMessagesList) => (
            oldMessagesList === undefined ? [{content: message, isInfo: true}] :
                [...oldMessagesList, {content: message, isInfo: true}]
        ))
    }

    const handleChannelDeleted = (message:string) => {
        //console.log("In channeldeleted");
        navigate("/chat")
        window.alert(message)
    }

    const handleClientInfo = (data:ClientInfoT) => {
        console.log("Dataaa", data)
        setUserState({
            isOwner: data.isOwner,
            isAdmin: data.isAdmin,
            isMuted: data.isMuted,
            unmuteDate: data.unmuteDate,
        })
        if (data.messages?.length !== 0)
        {
            setMessagesList(data.messages)
        }
        console.log(data.unmuteDate);
        if (data.unmuteDate !== 0)
            setMutedTime(Math.trunc(data.unmuteDate / 1000 - new Date().getTime() / 1000))
        
    }

    const handleAddAdmin = () => {
        setUserState((oldUserState) => ({
            ...oldUserState!,
            isAdmin: true
            })
        )
    }

    const handleBannedFromChannel = (data:ActionOnUser) => {
        console.log("Banned data", data);
        const message = data.targetId === storage.login ? 
            "You have been banned from the chat" :
            `${data.targetId} has been banned from the chat`
        setMessagesList((oldMessagesList) => (
            oldMessagesList === undefined ? [{content: message, isInfo: true}] :
                [...oldMessagesList, {content: message, isInfo: true}]
        ))
        setUserState((oldUserState) => ({
            ...oldUserState!,
            unbanDate: data.duration,
        }))
        if (data.targetId === storage.login)
            navigate("/chat")
    }

    

    const handleMutedFromChannel = (data: ActionOnUser) => {
        const message = data.targetId === storage.login ? 
            `You have been muted for ${data.duration} sec` :
            `${data.targetId} has been muted for ${data.duration} sec`
        setMessagesList((oldMessagesList) => (
            oldMessagesList === undefined ? [{content: message, isInfo: true}] :
                [...oldMessagesList, {content: message, isInfo: true}]
        ))
        if (data.targetId === storage.login)
        {
            setUserState((oldUserState) => ({
                ...oldUserState!,
                isMuted: true,
                unmuteDate: data.duration
                })
            )
            setMutedTime(data.duration)
        }
    }

    const messageElem = messagesList?.map((elem, index) => (
        elem.isInfo ? 
            <InfoMessage key={index} message={elem}/> :
            <Message key={index} 
                className={elem.sender?.login ===  storage.login ?
                    "message message-right" : "message message-left"}
                message={elem}
            />
    ))
    useEffect(() => {
        if (!chatSocket)
		{
			initiateSocket("http://localhost:8002/chat", getSession(), storage.login)
			setChatSocket(getSocket())
		}
        if (chatSocket)
        {
            chatHandler(handleMessageReceived,
                handleChannelDeleted,
                handleClientInfo,
                handleBannedFromChannel,
                handleMutedFromChannel,
                handleAddAdmin,
                handleLeftChannel,
                upgradeToOwner,
                handleIsAlreadyAdmin,
                handleChannelJoined
                )
        }
        if (storage2)
            getClientInfo(storage2.channelId)
        
    }, [])

    useEffect(() => {
       scrollToBottom()
    }, [messagesList])

    useEffect(() => {
        console.log(mutedTime, userState?.unmuteDate)
		if (mutedTime > 0)
		{
			const intervalId = setInterval(() => setMutedTime((oldMutedTime) => oldMutedTime - 1), 1000)
			return () => clearInterval(intervalId)
		}	
	}, [mutedTime])

    console.log(chatSocket)
    console.log("channel", storage2)
    return (
        <div className="chat">
            <ChannelBoard userState={userState}/>
            <div className="chat-right">
                <div className="h-96">
                    <div className="message-container">
                        {messageElem}
                        <div ref={lastMessageRef}/>
                    </div>
                </div>
                <MessageInput mutedTime={mutedTime} handleChange={handleChange} handleSubmitMessage={handleSubmitMessage} value={form.message}/>
            </div>           
        </div>
    )
}