import React, { useRef, useContext, useEffect, useState } from "react";
import { chatHandler, chatHandlerPrivEl, getChatSocket, getClientInfo, getGameSocket, initiateSocket, sendMessage, sendPrivMessage } from "../../Utils/socketManager";
import Message from "../Elements/message";
import {ActionOnUser, ChannelModes, ChannelT, ClientInfoT, messageT, UserStateT} from "../ChatUtils/chatType"
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
    const {storage} = useLocalStorage("user")
	const {setStorage} = useLocalStorage()
	const [form, setForm] = useState({
        message:"",
    })
    // rajouter fct ype socket on pr recuperer inralogin
    const handlePrivChatJoined = (intraLogin: string) => {
        // set intra login
	}

    const [messagesList, setMessagesList] = useState<messageT[]>()

    const handleSubmitPrivMessage = (e:React.ChangeEvent<HTMLFormElement>) => {
        sendPrivMessage(storage?.intraLogin, form.message)
		setMessagesList((oldMessagesList) => (
			oldMessagesList === undefined ? [] :
				[...oldMessagesList]
		))
    }

    const handlePrivMessageReceived = (msg:messageT) => {
        setMessagesList((oldMessagesList) => (
            oldMessagesList === undefined ? [msg] :
                [...oldMessagesList, msg]
        ))
    }

    const handlePrivMessList = (msg:messageT[]) => {
        // fct appelee uniquement pour remplir les mess initialement 
        setMessagesList((oldMessagesList) => (
            [...msg]
        ))
    }

	const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setForm((oldForm) => ({
            ...oldForm,
            [e.target.name]: e.target.value
        }))
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
        initiateSocket("http://localhost:8002", getSession(), storage.login)
        setChatSocket(getChatSocket())
        if (chatSocket)
        {
           chatHandlerPrivEl(handlePrivMessageReceived, handlePrivMessList) 
        }
    }, [])

   return (<div className="chat">
            <div className="chat-right">
                <div className="h-96">
                    <div className="message-container">
                        {messageElem}
                    </div>
                </div>
                <PrivMessageInput handleSubmitMessage={handleSubmitPrivMessage}
                    sampleInfo={form.message} handleChange={handleChange}/>
            </div>           
        </div>
    )
}