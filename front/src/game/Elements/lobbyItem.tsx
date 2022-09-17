import React from 'react'
import * as socketManager from "../GameUtils/socketManager"
import {LobbiesInfoT} from "../GameUtils/type"
import { Link } from "react-router-dom";

export default function LobbyItem(props:LobbiesInfoT)
{
    return (
        <div style={{
            padding: "1em",
            borderBottom: "1px solid black"
        }}>
            <h1>{props.lobbyId}</h1>
            {
                    <h2>`${props.playersId[0]} vs ${props.playersId[1]}`</h2>
            }
            
            <Link to="game" state={{socket : "socket"}}>
                <button onClick={() => props.spectateMode(props.lobbyId)}>view</button>
            </Link>
        </div>
    )
}