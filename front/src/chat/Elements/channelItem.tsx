import React from 'react'
import { Link } from "react-router-dom";
import { ChannelT } from '../ChatUtils/chatType';

export default function ChannelItem(props:ChannelT)
{
    return (
        <div style={{
            padding: "1em",
            borderBottom: "1px solid black"
        }}>
            <h1>{props.channelId}</h1>
            <h2>{props.clientsId.length} client dans ce channel</h2> 
            <Link to="message">
                <button onClick={() =>
                    props.handleJoinChannel(props.channelId)
                    }>JOIN</button>
            </Link>
        </div>
    )
}