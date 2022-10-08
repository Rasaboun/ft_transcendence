import React, { useRef, useContext, useEffect, useState } from "react";
import { blockInChat, chatHandler, chatHandlerPrivEl, getChatInfo, getChatSocket, getClientInfo, getGameSocket, initiateSocket, sendMessage, sendPrivMessage, unblockInChat } from "../../Utils/socketManager";
import Message from "../Elements/message";
import {ActionOnUser, ChannelModes, ChannelT, ChatInfoT, ClientInfoT, messageT, MessageTypes, privChatInfo, UserStateT} from "../ChatUtils/chatType"
import { useNavigate } from "react-router-dom";
import InfoMessage from "../Elements/InfoMessage";
import ChannelBoard from "../Elements/channelBoard";
import useLocalStorage from "../../hooks/localStoragehook";
import PrivMessageInput from "./privMessageInput";
import { SocketContext } from "../../Context/socketContext";
import { getSession } from "../../Utils/utils";
import "../../output.css";
import { blockUser } from "../../Requests/users";

export default function PrivChatElem()
{
    const {chatSocket, setChatSocket, setGameSocket} = useContext(SocketContext)
    const lastMessageRef = useRef<HTMLDivElement | null>(null)
    const {storage} = useLocalStorage("user")
	const {setStorage} = useLocalStorage()
	const [form, setForm] = useState({ message:"", })
    const {privChat} = useLocalStorage("privChat");
    const [messagesList, setMessagesList] = useState<messageT[]>()
    const [isBlocked, setIsBlocked] = useState(false);


    const handlePrivChatJoined = (chatInfo: privChatInfo) => {
        const {messages, ...privChat} = chatInfo;
        console.log("Privchat", privChat);
        setStorage("privChat", privChat);
        setIsBlocked(chatInfo.isBlocked);
        setMessagesList(chatInfo.messages);
	}


    const handleSubmitPrivMessage = (e:React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (form.message != "")
        {
            console.log("privChat", privChat);
            sendPrivMessage({chatName: privChat.name, content: form.message})
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

    const handleChatInfo = (data:privChatInfo) => {
        console.log("chat Info", data)
      
        setIsBlocked(data.isBlocked);
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
        console.log("privchat", privChat);
        if (privChat)
            getChatInfo(privChat.name);

    }, [chatSocket?.connected])

    useEffect(() => {
        if (isBlocked)
        {

        }
    }, [isBlocked])
   return (<div className="chat">
            <h1>Chatting with : {privChat ? privChat.otherUsername : "Change this"}</h1>
            <br/>
            <button style={{
                            height: "3vh",
                            width: "5vh",
                            marginLeft: "40px",
                            backgroundColor: "#00ffff",
                            borderRadius: "20px"
                        }}
                   onClick={() => blockInChat(privChat.name)}>
                            BLOCK
            </button>
            <button style={{
                        height: "3vh",
                        width: "5vh",
                        marginLeft: "40px",
                        backgroundColor: "#00ffff",
                        borderRadius: "20px"
                    }}
                onClick={() => unblockInChat(privChat.name)}>
                UNBLOCK
            </button>
            <div className="chat-right">
                <div className="h-96 bg-indigo-100">
                    <div className="">
                        {messageElem}
                        <div ref={lastMessageRef}/>
                    </div>
                </div>
                <PrivMessageInput handleSubmitMessage={handleSubmitPrivMessage}
                    value={form.message} isBlocked={isBlocked} handleChange={handleChange}/>
            </div>           
        </div>
    )
}