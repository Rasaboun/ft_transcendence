import { useContext } from "react";
import "../chat.css"
import { ChatContext } from "../ChatContext/chatContext";
import { messageT } from "../ChatUtils/chatType";

type MessagePropsT = {
    className: string,
    message: messageT
}

export default function InviteMessage({className, message}:MessagePropsT)
{
    const {socket} = useContext(ChatContext)

    return(
        <div className={className}>
            {<h4 style={{
                color: "red"
            }}>
                {message.sender!.username}
            </h4>}
			{message.content}
			<br/>
            <button className="button-action">join Invitation</button>
        </div>
    )
}