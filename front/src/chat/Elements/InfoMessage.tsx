import "../chat.css"
import { messageT } from "../ChatUtils/chatType";

type PropsInfoT = {
    message: messageT
}

export default function InfoMessage({message}:PropsInfoT) {
    return (
        <div className="info-message">
           {message.content}
        </div>
    )
}