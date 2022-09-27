import { useContext, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "../../hooks/localStoragehook";
import { joinInvitation } from "../../Utils/socketManager";
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
	const navigate = useNavigate();

	const handleJoinInvitation = () => {
		if (message.sender)
		{
			joinInvitation(message.sender.login)
			navigate('/pong/game');
		}
	}
    return(
        <div className={className}>
            {<h4 style={{
                color: "red"
            }}>
                {message.sender!.username}
            </h4>}
			{message.content}
			<br/>
            <button onClick={() => handleJoinInvitation()} className="button-action">join Invitation</button>
        </div>
    )
}