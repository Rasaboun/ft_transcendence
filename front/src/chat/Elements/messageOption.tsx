import React, { useContext } from "react";
import { ChatContext } from "../ChatContext/chatContext";
import { banUser, muteUser } from "../ChatUtils/socketManager";
import Message from "./message";

type MessagePropsT = {
    handleMouseLeave: () => void,
    sender: string
}



export default function MessageOption({ handleMouseLeave, sender }: MessagePropsT)
{
    const {channel} = useContext(ChatContext)
    const handleBan = () => {
        banUser({
            channelName: channel!,
            targetId: sender,
            duration: 60
        })
    }

    const handleMute = () => {
        muteUser({
            channelName: channel!,
            targetId: sender,
            duration: 60
        })
    }
    
    return (
        <div onMouseLeave={() => handleMouseLeave()} className="message-option">
            <h4>
                {sender}
            </h4>
            <div className="option-buttons">
                <button onClick={() => handleBan()}>ban</button>
                <button onClick={() => handleMute()}>Mute</button>
            </div>
            
        </div>
    )
}