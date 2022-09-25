import React from 'react'
import { Link } from "react-router-dom";
import { connectedUsersT, privChatP } from '../ChatUtils/chatType';

type PrivChatPropsT = {
    connectedUsers: connectedUsersT,
    handleJoinPrivChat: ( data:string) => void;
}

export default function PrivChatItem({ connectedUsers, handleJoinPrivChat }:PrivChatPropsT  )
{
    console.log("Passe par ici lol");
    const handleSubmit = (e:React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
    }

    return (
        <div style={{
            padding: "1em",
            borderBottom: "1px solid black"
        }}>
            <h1>User: {connectedUsers.username}</h1>
            <button type="submit" style={{
                            height: "3vh",
                            width: "17vh",
                            marginLeft: "40px",
                            backgroundColor: "#00ffff",
                            borderRadius: "20px"
                        }} 
                  >
                            Send Message
                        </button>

        </div>
    )
}