import React, { useRef, useContext, useEffect, useState } from "react";
import { chatHandler, chatHandlerPrivEl, getChatSocket, getClientInfo, getGameSocket, initiateSocket, sendMessage, sendPrivMessage } from "../../Utils/socketManager";
import Message from "../Elements/message";
import {ActionOnUser, ChannelModes, ChannelT, ClientInfoT, messageT, MessageTypes, UserStateT} from "../ChatUtils/chatType"
import { useNavigate } from "react-router-dom";
import InfoMessage from "../Elements/InfoMessage";
import ChannelBoard from "../Elements/ChannelBoard";
import useLocalStorage from "../../hooks/localStoragehook";
import PrivMessageInput from "./privMessageInput";
import { SocketContext } from "../../Context/socketContext";
import { getSession } from "../../Utils/utils";

export default function PrivChatElem()
{
    const {chatSocket, setChatSocket, setGameSocket} = useContext(SocketContext)
    const lastMessageRef = useRef<HTMLDivElement | null>(null)
    const {storage} = useLocalStorage("user")
	const {setStorage} = useLocalStorage()
	const [form, setForm] = useState({ message:"", })

    const [contName, setContName] = useState<string>()
    // rajouter fct ype socket on pr recuperer inralogin
    const handlePrivChatJoined = (intraLogin: string) => {
        // set intra login
        console.log("THE STORAGE INTRA LOGIN IS ;", intraLogin);
        setContName(intraLogin)
		setStorage("intraLogin", intraLogin);
	}

    const [messagesList, setMessagesList] = useState<messageT[]>()

    const handleSubmitPrivMessage = (e:React.ChangeEvent<HTMLFormElement>) => {
        sendPrivMessage(storage?.login, form.message)
		setMessagesList((oldMessagesList) => (
			oldMessagesList === undefined ? [] :
				[...oldMessagesList]
		))
        console.log("sending message content of form : ", form)
    }

    const handlePrivMessageReceived = (msg:messageT) => {
        setMessagesList((oldMessagesList) => (
            oldMessagesList === undefined ? [msg] :
                [...oldMessagesList, msg]
        ))
    }

    const handlePrivMessList = (msg:messageT[]) => {
        // fct appelee uniquement pour remplir les mess initialement 
        console.log("Displaying msg : ", msg)
        if (msg.length > 0)
        {
            setMessagesList(() => (
                [...msg]
            ))
        }
    }

	const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setForm((oldForm) => ({
            ...oldForm,
            [e.target.name]: e.target.value
        }))
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
           chatHandlerPrivEl(handlePrivMessageReceived, handlePrivMessList, handlePrivChatJoined) 
        }
    }, [])

   return (<div className="chat">
            <h1>Chatting with : {contName}</h1>
            <div className="chat-right">
                <div className="h-96">
                    <div className="message-container">
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