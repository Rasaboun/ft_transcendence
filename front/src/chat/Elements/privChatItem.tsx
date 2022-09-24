import React from 'react'
import { Link } from "react-router-dom";
import { privChatP } from '../ChatUtils/chatType';

export default function PrivChatItem(props:privChatP)
{
    return (
        <div style={{
            padding: "1em",
            borderBottom: "1px solid black"
        }}>
            <h1>{props.PrivChatId}</h1>
            <Link to="message">
                <button onClick={() =>
                    props.handleJoinPrivateChat
                    }>JOIN</button>
            </Link>
        </div>
    )
}