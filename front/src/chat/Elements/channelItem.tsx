import React, { useState } from 'react'
import { Link } from "react-router-dom";
import { ChannelModes, ChannelT, JoinChannelT } from '../ChatUtils/chatType';

export default function ChannelItem(props:ChannelT)
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
            data = {channelName:props.channelId, password}
            console.log(password)
			props.handleJoinChannel(data)
        }
        setPassword("")
    }
    console.log(props.mode)
    return (
        <div style={{
            padding: "1em",
            borderBottom: "1px solid black"
        }}>
            <h1>{props.channelId}</h1>
            <h2>{props.nbClients} client dans ce channel</h2> 
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
                    !(props.mode == ChannelModes.Password) ? 
                        props.handleJoinChannel({channelName:props.channelId}) :
                        setDisplayPassInput(true)
                    }>
                        JOIN
                </button>
            }
            
        </div>
    )
}