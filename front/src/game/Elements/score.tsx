import axios from "axios"
import { useEffect, useState } from "react"
import useLocalStorage from "../../hooks/localStoragehook"
import { getUserProfile } from "../../Requests/users"
import { Iuser } from "../../Utils/type"
import "../game.css"
import { GameData, GameState } from "../GameUtils/type"
import PlayersScores from "./playerScores"

const url: string = "http://localhost:3002/users/profile/";

type propsType = {
    gameData: GameData
}

export default function Score({ gameData }:propsType)
{
	const {storage} = useLocalStorage("gameState")
	const [users, setUsers] = useState<Iuser[]>([])
	useEffect(() => {
		if (gameData.players[0].id !== "" && gameData.players[1].id !== "")
		{
			const getProfile = async (login:string) => {
				console.log(login)
				const user = await axios.get<Iuser>(url, {params : {login:login}}).then((response) => {
					return response.data;
				});
				console.log(user)
				setUsers((prevUser) => {prevUser.push(user)
										return prevUser});
			}
			getProfile(gameData.players[0].id)
			getProfile(gameData.players[1].id)
		}
		
	}, [gameData.players[0].id, gameData.players[1].id])
	const PlayerScoreElem = users.map((elem, idx) => 
		<PlayersScores key={idx} username={elem.username}
			image={elem.photoUrl}
			score={gameData.players[idx].score}
			className={idx === 0 ? "float-left" : "float-right"}/>)
    return (
        <div className=" px-4 py-6 sm:px-0">
			
			<div className="border-2 bg-indigo-200 border-line border-gray-200 rounded-lg h-96">
			{
				gameData.players.length === 2 &&
				(parseInt(storage) === GameState.Started || parseInt(storage) === GameState.Spectacte) &&
				<div className="score--container ">
					{PlayerScoreElem}
				</div>
			}
			</div>
		</div>
    )
}