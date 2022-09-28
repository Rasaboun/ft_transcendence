import "../chat.css"
import { messageT } from "../ChatUtils/chatType";

type MessagePropsT = {
    className: string,
    message: messageT
}

export default function Message({className, message}:MessagePropsT)
{
    return(
        <div className={className}>
            {<h4 style={{
                color: "red"
            }}>
                {message.sender!.username}
            </h4>}
            {message.content}
        </div>
    )
}