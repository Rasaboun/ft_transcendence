import React, { useEffect, useState } from "react";
import Message from "../Elements/message";


export default function ChatElem()
{
    const [message, setMessage] = useState<string>("")
    const [messagesList, setMessagesList] = useState<string[]>()
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value)
    }

    const handleSubmit = (e:React.ChangeEvent<HTMLFormElement>) => {
        if (message !== "")
        {
            setMessagesList((oldMessagesList) => (
                oldMessagesList === undefined ? [message] :
                    [...oldMessagesList,message]
            ))
            e.preventDefault()
        }
    }

    useEffect = 

    const messageElem = messagesList?.map((elem, index) => (
        <Message key={index} 
            className="text-white bg-gray-400 px-3 py-2 rounded-md text-sm font-medium"
            message={elem}
            senderId={index}
            />
    ))

    return (
        <div>
            <div className="flex-col border-4 border-dashed border-gray-200 rounded-lg h-96">

                {messageElem}
            </div>
            <form onSubmit={handleSubmit}>
                <input style={{
                    border: "1px solid black",
                    marginRight: "15px"
                }}
                type="text" value={message} onChange={handleChange}/>
                <button type="submit" style={{
                    height: "5vh",
                    width: "20vh",
                    backgroundColor: "#00ffff",
                    borderRadius: "20px"
                }} >
                    Send
                </button>
                
            </form>          
        </div>
    )
}