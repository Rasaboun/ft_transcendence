import react, { useContext, useEffect } from "react"
import { SocketContext } from "../../Context/socketContext"
import useLocalStorage from "../../hooks/localStoragehook"
import "../game.css"
import { GameData, gameDataT, GameState } from "../GameUtils/type"

type propsType = {
    gameData: GameData
}

export default function Score({gameData}:propsType)
{
	const {storage} = useLocalStorage("gameState")

    return (
        <div className=" px-4 py-6 sm:px-0">
			
			{<div className="border-2 border-line border-gray-200 rounded-lg h-96">
			{
				gameData.players.length === 2 && parseInt(storage) === GameState.Started &&
				<div className='score--container'>
                    
					<h1 className='score--elem'> {gameData.players[0].id} {gameData.players[0].score} : {gameData.players[1].score} {gameData.players[1].id}</h1>
				</div>
			}
			</div>}
		</div>
    )
}