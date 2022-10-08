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
        <div style={{
            padding: "1em",
            borderBottom: "1px solid black"
        }}>
            <h1>User: {user.username}</h1>
            <button type="submit" style={{
                            height: "3vh",
                            width: "17vh",
                            marginLeft: "40px",
                            backgroundColor: "#00ffff",
                            borderRadius: "20px"
                        }}
                   onClick={() =>
                        handleJoinPrivChat(user)
                    }>
                            Join
                        </button>

        </div>
    )
}