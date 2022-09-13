import React, { useContext, useState } from "react";
import "../chat.css"
import { ChatContext } from "../ChatContext/chatContext";
import { messageT } from "../ChatUtils/chatType";
import MessageOption from "./messageOption";

type MessagePropsT = {
    className: string,
    message: messageT
}

export default function Message({className, message}:MessagePropsT)
{
    const [isHover, setIsHover] = useState<boolean>(false)
    const {socket} = useContext(ChatContext)

    const handleOnMouseOver = () => {
        setIsHover(true)
    }

    const handleMouseLeave = () => {
        setIsHover(false)
    }

    return(
        <div className={className}>
            {
                isHover && socket?.id !== message.sender && !message.isInfo &&
                    <MessageOption handleMouseLeave={handleMouseLeave} sender={message.sender!}/>
            }
            {<h4 onMouseOver={handleOnMouseOver} style={{
                color: "red"
            }}>
                {message.sender}
            </h4>}
            {message.content}
        </div>
    )
}