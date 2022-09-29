import React from 'react'
import { Link } from "react-router-dom";
import { connectedUsersT, privChatP } from '../ChatUtils/chatType';
import { buttonClass } from '../../Utils/utils';
type PrivChatPropsT = {
    connectedUsers: connectedUsersT,
    handleJoinPrivChat: ( data:string) => void;
}

export default function PrivChatItem({ connectedUsers, handleJoinPrivChat }:PrivChatPropsT  )
{
    const handleSubmit = (e:React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
    }

    return (
        <div style={{
            padding: "1em",
            borderBottom: "1px solid black"
        }}>
            <h1>User: {connectedUsers.username}</h1>
            <button type="submit" className="text-indigo-700 hover:text-white border border-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-indigo-400 dark:text-indigo-400 dark:hover:text-white dark:hover:bg-indigo-500 dark:focus:ring-indigo-900"
                   onClick={() =>
                        handleJoinPrivChat(connectedUsers.intraLogin)
                    }>
                            Send Message
                        </button>

        </div>
    )
}