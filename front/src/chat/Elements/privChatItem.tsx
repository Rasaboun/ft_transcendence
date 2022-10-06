import React from 'react'
import { Link } from "react-router-dom";
import { connectedUsersT, privChatP } from '../ChatUtils/chatType';

type PrivChatPropsT = {
    connectedUsers: connectedUsersT,
    handleJoinPrivChat: ( data:connectedUsersT) => void;
}

export default function PrivChatItem({ connectedUsers, handleJoinPrivChat }:PrivChatPropsT  )
{
    const handleSubmit = (e:React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        handleJoinPrivChat(connectedUsers)
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
            <h1>User: {connectedUsers.username}</h1>
            <button type="submit" style={{
                            height: "3vh",
                            width: "17vh",
                            marginLeft: "40px",
                            backgroundColor: "#00ffff",
                            borderRadius: "20px"
                        }} 
                   onClick={() =>
                        handleJoinPrivChat(connectedUsers)
                    }>
                            Send Message
                        </button>
            <button type="submit" style={{
                            height: "3vh",
                            width: "17vh",
                            marginLeft: "40px",
                            backgroundColor: "#00ffff",
                            borderRadius: "20px"
                        }} 
                   onClick={() =>
                        handleTest()
                    }>
                            Block User
                        </button>


        </div>
    )
}