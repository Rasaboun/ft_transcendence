import { useNavigate } from "react-router-dom";
import { joinInvitation } from "../../Utils/socketManager";
import "../chat.css"
import { messageT } from "../ChatUtils/chatType";

type MessagePropsT = {
    className: string,
    message: messageT
}



export default function InviteMessage({className, message}:MessagePropsT)
{
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
            <button onClick={() => handleJoinInvitation()} className="focus:outline-none text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-2.5 py-1 my-2 mx-2">join Invitation</button>
        </div>
    )
}