import React, { useEffect, useState } from 'react'
import {LobbiesInfoT} from "../GameUtils/type"
import { Link } from "react-router-dom";
import { getUsername } from '../../Requests/users';

export default function LobbyItem(props:LobbiesInfoT)
{
	const [users, setUsers] = useState<string[]>([])

    useEffect(() => {

        const getPlayerUsername = async(login: string) =>
        {
            const username = await getUsername(login);
            console.log("username", username);
            setUsers((oldUsers) => {oldUsers.push(username);
                                    return oldUsers;})
        }
        getPlayerUsername(props.playersId[0]);
        getPlayerUsername(props.playersId[1]);
    }, [props.playersId[0], props.playersId[1]])

    return (
        <div style={{
            padding: "1em",
            borderBottom: "1px solid black"
        }}>
            {
                    <h2>`${users[0]} vs ${users[1]}`</h2>
            }
            
            <Link to="game" state={{socket : "socket"}}>
                <button onClick={() => props.spectateMode(props.lobbyId)}>view</button>
            </Link>
        </div>
    )
}