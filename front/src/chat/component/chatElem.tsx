import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../ChatContext/chatContext";
import { chatHandler, setSocketManager } from "../ChatUtils/socketManager";
import Message from "../Elements/message";
import {messageT} from "../ChatUtils/chatType"

export default function ChatElem()
{
    const {socket, setSocket} = useContext(ChatContext)
    const [message, setMessage] = useState<string>("")
    const [messagesList, setMessagesList] = useState<messageT[]>()
    
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value)
    }

    const handleSubmit = (e:React.ChangeEvent<HTMLFormElement>) => {
        if (message !== "")
        {
            setMessagesList((oldMessagesList) => (
                oldMessagesList === undefined ? [{senderId: socket!.id ,text: message}] :
                    [...oldMessagesList, {senderId: socket!.id ,text: message}]
            ))
        }
        e.preventDefault()

    }

    const handleMessageReceived = (senderId:string, message:string) => {
        setMessagesList((oldMessagesList) => (
            oldMessagesList === undefined ? [{senderId: socket!.id ,text: message}] :
                [...oldMessagesList, {senderId: socket!.id ,text: message}]
        ))
    }


    const messageElem = messagesList?.map((elem, index) => (
        <Message key={index} 
            className={elem.senderId === socket?.id ?
                "message message-right" : "message message-left"}
            message={elem}
            />
    ))

    useEffect(() => {
        setSocketManager(socket!)
        chatHandler(handleMessageReceived)

    })
    return (
        <div>
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96">
                <div className="message-container">
                    {messageElem}
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <input style={{
                    border: "1px solid black",
                    marginRight: "15px"
                }}
                type="text" value={message} onChange={handleChange}/>
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