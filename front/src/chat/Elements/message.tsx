import "../chat.css"
import { messageT } from "../ChatUtils/chatType";

type MessagePropsT = {
    className: string,
    message: messageT
}

export default function Message({className, message}:MessagePropsT)
{
    var h4 = "text-white"
    if (className === "message  self-end bg-indigo-400")
    {
        h4 = "text-indigo-800";
    }
    else{
        h4 = "text-indigo-400";
    }
    return(
        <div className={className}>
            {
                <h4 className={h4}>
                {message.sender!.username}
            </h4>}
            {message.content}
        </div>
    )
}