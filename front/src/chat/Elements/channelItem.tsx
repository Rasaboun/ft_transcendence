import React, { useState } from 'react'
import { Link } from "react-router-dom";
import { ChannelModes, ChannelT, JoinChannelT } from '../ChatUtils/chatType';

type ChannelPropsT = {
    channel:ChannelT,
    handleJoinChannel: ( data:JoinChannelT ) => void;
}

export default function ChannelItem({channel, handleJoinChannel}:ChannelPropsT)
{
    const [displayPassInput, setDisplayPassInput] = useState<boolean>(false)
    const [password, setPassword] = useState<string>("")

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }

    const handleSubmit = (e:React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        let data:JoinChannelT
        if (password !== "")
        {
            data = {channelName:channel.channelId, password}
            console.log(password)
			handleJoinChannel(data)
        }
        setPassword("")
    }
    return (
        <div style={{
            padding: "1em",
            borderBottom: "1px solid black"
        }}>
            <h1>{channel.channelId}</h1>
            <h2>{channel.nbClients} client dans ce channel</h2> 
            {
                displayPassInput ?
                    <form onSubmit={handleSubmit}>
                        <input style={{
                            border: "1px solid black",
                            marginRight: "15px"
                        }}
                        type="text" value={password} onChange={handleChange}/>
                        <button type="submit" style={{
                            height: "3vh",
                            width: "17vh",
                            backgroundColor: "#00ffff",
                            borderRadius: "20px"
                        }} >
                            send password
                        </button>
                    </form> :
                <button onClick={() =>
                    !(channel.mode == ChannelModes.Password) ? 
                        handleJoinChannel({channelName:channel.channelId}) :
                        setDisplayPassInput(true)
                    }>
                        JOIN
                </button>
            }
            
        </div>
    )
}