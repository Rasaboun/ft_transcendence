import React from 'react'
import { Link } from "react-router-dom";
import { connectedUsersT, privChatP } from '../ChatUtils/chatType';
type PrivChatPropsT = {
    user: connectedUsersT,
    handleJoinPrivChat: ( data:connectedUsersT) => void;
}

export default function PrivChatItem({ user, handleJoinPrivChat }:PrivChatPropsT  )
{
    const handleSubmit = (e:React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        handleJoinPrivChat(user)
    }
    
    const handleTest=()=>
    {
        //rien se passe
        console.log("function blocks the other");
        console.log("BUTTON DOES NOT WORK");
    }

    return (
        <div className="channel-item relative p-3 hover:bg-indigo-100 rounded-lg">
            <div className="flex flex-row">
            <h1 className="text-lg   ">User:</h1>
            <h2 className=" ml-2 font-semibold  text-lg">{user.username}</h2>
            </div>
            <button type="submit"
            className="text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:focus:ring-indigo-800 shadow-lg shadow-indigo-500/50 dark:shadow-lg dark:shadow-indigo-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2" 
                   onClick={() =>
                        handleJoinPrivChat(user)
                    }>
                            Join
                        </button>

        </div>
    )
}