import React, { useRef, useContext, useEffect, useState } from "react";
import { chatHandler, chatHandlerPrivEl, getChatInfo, getChatSocket, getClientInfo, getGameSocket, initiateSocket, sendMessage, sendPrivMessage } from "../../Utils/socketManager";
import Message from "../Elements/message";
import {ActionOnUser, ChannelModes, ChannelT, ClientInfoT, messageT, MessageTypes, privChatInfo, UserStateT} from "../ChatUtils/chatType"
import { useNavigate } from "react-router-dom";
import InfoMessage from "../Elements/InfoMessage";
import ChannelBoard from "../Elements/channelBoard";
import useLocalStorage from "../../hooks/localStoragehook";
import PrivMessageInput from "./privMessageInput";
import { SocketContext } from "../../Context/socketContext";
import { getSession } from "../../Utils/utils";
import "../../output.css";

export default function PrivChatElem()
{
    const {chatSocket, setChatSocket, setGameSocket} = useContext(SocketContext)
    const lastMessageRef = useRef<HTMLDivElement | null>(null)
    const {storage} = useLocalStorage("user")
	const {setStorage} = useLocalStorage()
	const [form, setForm] = useState({ message:"", })
    const {chatName} = useLocalStorage("chatName");


    const [messagesList, setMessagesList] = useState<messageT[]>()

    const handlePrivChatJoined = (data: privChatInfo) => {
        setStorage("chatName", data.chatName);
        setMessagesList(data.messages);
	}


    const handleSubmitPrivMessage = (e:React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (form.message != "")
        {
            sendPrivMessage({chatName: chatName, content: form.message})
        }
        setForm((oldForm) => ({
            ...oldForm,
            message: ""
        }))
    }

    const handlePrivMessageReceived = (msg:messageT) => {
        setMessagesList((oldMessagesList) => (
            oldMessagesList === undefined ? [msg] :
                [...oldMessagesList, msg]
        ))
    }

 
	const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setForm((oldForm) => ({
            ...oldForm,
            [e.target.name]: e.target.value
        }))
    }

    const handleChatInfo = (data:ClientInfoT) => {
        console.log("chat Info", data)
      
        if (data.messages?.length !== 0)
        {
            setMessagesList(data.messages)
        }
        
    }

    const messageElem = messagesList?.map((elem, index) => (
        elem.type === MessageTypes.Info ?
            <InfoMessage key={index} message={elem}/> :
            <Message key={index}
                className={elem.sender?.login ===  storage.login ?
                    "message message-right" : "message message-left"}
                message={elem}
            />
    ))

    const scrollToBottom = () => {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" })
    }
     useEffect(() => {
       scrollToBottom()
    }, [messagesList])

    useEffect(() => {
        initiateSocket("http://localhost:8002")
        setChatSocket(getChatSocket())
        if (chatSocket?.connected)
        {
           chatHandlerPrivEl(
            handlePrivMessageReceived,
            handlePrivChatJoined,
            handleChatInfo,) 
        }
        console.log("chatname", chatName);
        if (chatName)
            getChatInfo(chatName);

    }, [chatSocket?.connected])

   return (<div className="chat">
            <h1>Chatting with : {"CHANGE THIS"}</h1>
            <div className="chat-right">
                <div className="h-96 bg-indigo-100">
                    <div className="">
                        {messageElem}
                        <div ref={lastMessageRef}/>
                    </div>
                </div>
                <PrivMessageInput handleSubmitMessage={handleSubmitPrivMessage}
                    sampleInfo={form.message} handleChange={handleChange}/>
            </div>           
        </div>
    )
}