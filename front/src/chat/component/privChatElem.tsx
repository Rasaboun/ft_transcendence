import React, { useRef, useContext, useEffect, useState } from "react";
import { blockInChat, chatHandlerPrivEl, getChatInfo, getChatSocket, initiateSocket,  sendPrivMessage, unblockInChat } from "../../Utils/socketManager";
import Message from "../Elements/message";
import { messageT, MessageTypes, privChatInfo} from "../ChatUtils/chatType"

import InfoMessage from "../Elements/InfoMessage";
import useLocalStorage from "../../hooks/localStoragehook";
import PrivMessageInput from "./privMessageInput";
import { SocketContext } from "../../Context/socketContext";
import "../../output.css";

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
        setStorage("privChat", privChat);
        setIsBlocked(chatInfo.isBlocked);
        setMessagesList(chatInfo.messages);
	}


    const handleSubmitPrivMessage = (e:React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (form.message != "")
        {
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
      
        const {messages, ...privChat} = data;
        setStorage("privChat", privChat);
        setIsBlocked(data.isBlocked);
        if (data.messages?.length !== 0)
        {
            setMessagesList(data.messages)
        }
        
    }

    const getBlockedSentence = () =>
    {
        if (!isBlocked)
            return "";
        const blockedList: string[] = privChat.blockedList;
        if (blockedList.length == 2 || blockedList.indexOf(storage.login) == -1)
        {
            return "You blocked this user";
        }
        return "This user blocked you";
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
        initiateSocket("http://localhost:${process.env.SOCKET_PORT}")
        setChatSocket(getChatSocket())
        if (chatSocket)
        {
           chatHandlerPrivEl(
            handlePrivMessageReceived,
            handlePrivChatJoined,
            handleChatInfo,) 
        }
        if (privChat)
            getChatInfo(privChat.name);

    }, [chatSocket])

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
                    value={form.message} isBlocked={isBlocked} blockedSentence={getBlockedSentence()} handleChange={handleChange}/>
            </div>           
        </div>
    )
}