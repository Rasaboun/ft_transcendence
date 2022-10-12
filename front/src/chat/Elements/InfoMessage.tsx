import "../chat.css"
import { messageT } from "../ChatUtils/chatType";

type PropsInfoT = {
    message: messageT
}

export default function InfoMessage({message}:PropsInfoT) {
	console.log("infoMessage is being called once");
    return (
        <div className="info-message">
           {message.content}
        </div>
    )
}