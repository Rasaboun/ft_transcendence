import React from "react";
import "../chat.css"
import { messageT } from "../ChatUtils/chatType";

type MessagePropsT = {
    className: string,
    message: messageT
}

export default function Message({className, message}:MessagePropsT)
{
    console.log(message.sender, message.content)
    return(
        <div className={className}>
            {<h4 style={{
                color: "red"
            }}>
                {message.sender}
            </h4>}
            {message.content}
        </div>
    )
}