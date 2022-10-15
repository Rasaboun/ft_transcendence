import { useEffect, useState } from 'react'
import {LobbiesInfoT} from "../GameUtils/type"
import { Link } from "react-router-dom";
import { getUsername, getUserPhoto } from '../../Requests/users';
import PlayersIngame from './playersIngame';
import { buttonClass } from '../../Utils/utils';
import Loader from '../../Elements/loader';

export default function LobbyItem(props:LobbiesInfoT)
{
	const [users, setUsers] = useState<{username: string, image: string}[]>([])

	useEffect(() => {
		if (props.playersId[0] !== "" && props.playersId[1] !== "")
		{
			const getProfile = async (login:string) => {
				const username = await getUsername(login);
				const image = await getUserPhoto(login);
				setUsers((prevUser) => {prevUser.push({username, image})
										return prevUser});
			}
			getProfile(props.playersId[0])
			getProfile(props.playersId[1])
		}
		
	// eslint-disable-next-line
	}, [props.playersId[0], props.playersId[1]])

    const PlayersIngameElem = users.map((elem, idx) => 
		<PlayersIngame key={idx} username={elem.username}
			image={elem.image}
			className={idx === 0 ? "float-left" : "float-right"}/>)

    return (
		<Loader condition={users.length === 2}>
			<div style={{
				padding: "1em",
				borderBottom: "1px solid black"
				}}>
				<div>
					{PlayersIngameElem}
				</div>         
				<Link  to="game" state={{socket : "socket"}}>
						<button  className={buttonClass} onClick={() => props.spectateMode(props.lobbyId)}>VIEW</button>

				</Link>
			</div>
		</Loader>	
    )
}