import React, { useRef, useContext, useEffect, useState } from "react";
import { ChatContext } from "../ChatContext/chatContext";
import { chatHandler, getClientInfo, initiateSocket, inviteClient, leaveChannel, sendMessage, setChannelPassword, setPrivateMode, setSocketManager, unsetChannelPassword, unsetPrivateMode } from "../ChatUtils/socketManager";
import Message from "../Elements/message";
import {ActionOnUser, ChannelModes, ChannelT, ClientInfoT, messageT, UserStateT} from "../ChatUtils/chatType"
import { useNavigate } from "react-router-dom";
import InfoMessage from "../Elements/InfoMessage";
import ChannelBoard from "../Elements/ChannelBoard";
import useLocalStorage from "../../hooks/localStoragehook";
import MessageInput from "./MessageInput";
import { Socket } from "socket.io-client";

export default function ChatElem()
{
    const {storage, setStorage} = useLocalStorage("user")
	const {storage2} = useLocalStorage("sessionId")
	const {storage3} = useLocalStorage("channel")
	const navigate = useNavigate();
    const lastMessageRef = useRef<HTMLDivElement | null>(null)
    const {socket, setSocket} = useContext(ChatContext)
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
                sendMessage(storage3!.channelId, form.message)
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

    const handleMessageReceived = ({sender, content}:messageT) => {
        setMessagesList((oldMessagesList) => (
            oldMessagesList === undefined ? [{sender: sender ,content: content}] :
                [...oldMessagesList, {sender: sender ,content: content}]
        ))
    }

    const handleLeftChannel = ({channelName, clientId}:{channelName: string, clientId: string}) => {
        const message = `${clientId} left the chat`
        if(clientId !== storage.login)
        {
            setMessagesList((oldMessagesList) => (
                oldMessagesList === undefined ? [{content: message, isInfo: true}] :
                    [...oldMessagesList, {content: message, isInfo: true}]
            ))
        }
    }

    const handleChannelJoined = (data:{clientId:string, channelInfo:ChannelT}) => {
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
        navigate(-1)
        window.alert(message)
    }

    const handleClientInfo = (data:ClientInfoT) => {
        console.log(data)
        setUserState({
            isOwner: data.isOwner,
            isAdmin: data.isAdmin,
            isMuted: data.isMuted
        })
        if (data.messages?.length !== 0)
        {
            setMessagesList(data.messages)
        }
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
        const message = id === storage.login ? 
            "You have been banned from the chat" :
            `${id} has been banned from the chat`

        setMessagesList((oldMessagesList) => (
            oldMessagesList === undefined ? [{content: message, isInfo: true}] :
                [...oldMessagesList, {content: message, isInfo: true}]
        ))
        if (id === storage.login)
            navigate("/chat")
    }

    

    const handleMutedFromChannel = (data: ActionOnUser) => {
        const message = data.targetId === storage.login ? 
            "You have been muted 60 sec" :
            `${data.targetId} has been muted for 60 sec`
        if (data.targetId === storage.login)
            setMutedTime(data.duration)
        setMessagesList((oldMessagesList) => (
            oldMessagesList === undefined ? [{content: message, isInfo: true}] :
                [...oldMessagesList, {content: message, isInfo: true}]
        ))
        if (data.targetId === storage.login)
        {
            setUserState((oldUserState) => ({
                ...oldUserState!,
                isMuted: true
                })
            )
        }
    }

    const handleSession = (sessionInfo:{ sessionId:string, roomId:string }, sock:Socket) => {
		console.log(sock)
		if (sock)
		{
			setStorage("sessionId", sessionInfo.sessionId);
			setStorage("roomId", sessionInfo.roomId);
			sock.auth = { sessionId: sessionInfo.sessionId } ;		
			//socket.userID = userID;
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
		if (!socket)
			initiateSocket("http://localhost:8002/chat", setSocket, sessioninfo, storage.login)
        setSocketManager(socket!)
        if (storage3)
            getClientInfo(storage3.channelId)
        chatHandler(handleMessageReceived,
                    handleChannelDeleted,
                    handleClientInfo,
                    handleBannedFromChannel,
                    handleMutedFromChannel,
                    handleAddAdmin,
                    handleLeftChannel,
                    upgradeToOwner,
                    handleIsAlreadyAdmin,
                    handleSession,
                    handleChannelJoined
                    )
    }, [])

    useEffect(() => {
       scrollToBottom()
    }, [messagesList])

    useEffect(() => {
		if (mutedTime > 0)
		{
			const intervalId = setInterval(() => setMutedTime((oldTime) => oldTime - 1), 1000)
			return () => clearInterval(intervalId)
		}	
	}, [mutedTime])

    console.log(socket)
    console.log("channel", storage3)
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