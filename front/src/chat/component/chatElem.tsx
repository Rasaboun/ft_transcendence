import React, { useRef, useContext, useEffect, useState } from "react";
import { ChatContext } from "../ChatContext/chatContext";
import { chatHandler, sendMessage, setSocketManager } from "../ChatUtils/socketManager";
import Message from "../Elements/message";
import {messageT} from "../ChatUtils/chatType"

export default function ChatElem()
{
    const lastMessageRef = useRef<HTMLDivElement | null>(null)
    const {socket, channel} = useContext(ChatContext)
    const [message, setMessage] = useState<string>("")
    const [messagesList, setMessagesList] = useState<messageT[]>()
    
    const scrollToBottom = () => {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" })
      }

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value)
    }

    const handleSubmit = (e:React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (message !== "")
        {
            setMessagesList((oldMessagesList) => (
                oldMessagesList === undefined ? [{sender: socket!.id ,content: message}] :
                    [...oldMessagesList, {sender: socket!.id ,content: message}]
            ))
            console.log(message)
            sendMessage(channel!, message)
        }
        setMessage("")
        console.log(channel)
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

    const messageElem = messagesList?.map((elem, index) => (
        <Message key={index} 
            className={elem.sender === socket?.id ?
                "message message-right" : "message message-left"}
            message={elem}
            />
    ))

    useEffect(() => {
        setSocketManager(socket!)
        chatHandler(handleMessageReceived)

    }, [])

    useEffect(() => {
       scrollToBottom()
    }, [messagesList])

    return (
        <div>
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96">
                <div className="message-container">
                    {messageElem}
                    <div ref={lastMessageRef}/>
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