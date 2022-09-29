import React, { useEffect, useState } from 'react'
import {LobbiesInfoT} from "../GameUtils/type"
import { Link } from "react-router-dom";
import { getUserProfile } from '../../Requests/users';
import { Iuser } from '../../Utils/type';
import PlayersIngame from './playersIngame';

export default function LobbyItem(props:LobbiesInfoT)
{
	const [users, setUsers] = useState<Iuser[]>([])

	useEffect(() => {
		if (props.playersId[0] !== "" && props.playersId[1] !== "")
		{
			const getProfile = async (login:string) => {
				console.log(login)
				const user = await getUserProfile(login);
                if (!user)
                    return ;
				console.log(user)
				setUsers((prevUser) => {prevUser.push(user)
										return prevUser});
			}
			getProfile(props.playersId[0])
			getProfile(props.playersId[1])
		}
		
	}, [props.playersId[0], props.playersId[1]])

    const PlayersIngameElem = users.map((elem, idx) => 
		<PlayersIngame key={idx} username={elem.username}
			image={elem.photoUrl}
			className={idx === 0 ? "float-left" : "float-right"}/>)

    return (
        <div style={{
            padding: "1em",
            borderBottom: "1px solid black"
        }}>
            <div>
                {PlayersIngameElem}
            </div>         
            <Link to="game" state={{socket : "socket"}}>
                <button onClick={() => props.spectateMode(props.lobbyId)}>view</button>
            </Link>
        </div>
    )
}