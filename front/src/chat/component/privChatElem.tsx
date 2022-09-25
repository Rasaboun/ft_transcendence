import React, { useRef, useContext, useEffect, useState } from "react";
import { chatHandler, getChatSocket, getClientInfo, getGameSocket, initiateSocket, sendMessage } from "../../Utils/socketManager";
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
    const {storage, setStorage} = useLocalStorage("intraLogin")

    const [messagesList, setMessagesList] = useState<messageT[]>()

    const handleSubmitMessage = (e:React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        const mutedMessage = "you are muted: 60sec left"
            setMessagesList((oldMessagesList) => (
                oldMessagesList === undefined ? [{content: mutedMessage, isInfo: true}] :
                    [...oldMessagesList, {content: mutedMessage, isInfo: true}]
            ))
    }

    const handleMessageReceived = (msg:messageT) => {
        setMessagesList((oldMessagesList) => (
            oldMessagesList === undefined ? [msg] :
                [...oldMessagesList, msg]
        ))
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

   return (<div className="chat">
            <div className="chat-right">
                <div className="h-96">
                    <div className="message-container">
                        {messageElem}
                    </div>
                </div>
                <PrivMessageInput handleSubmitMessage={handleSubmitMessage} sampleInfo="Hello World"/>
            </div>           
        </div>
    )
}