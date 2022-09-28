import useLocalStorage from "../../hooks/localStoragehook"
import "../game.css"
import { GameData, GameState } from "../GameUtils/type"
import PlayersScores from "./playerScores"

type propsType = {
    gameData: GameData
}

export default function Score({gameData}:propsType)
{
	const {storage} = useLocalStorage("gameState")

    return (
        <div className=" px-4 py-6 sm:px-0">
			
			{<div className="border-2 bg-indigo-300 border-line border-gray-200 rounded-lg h-96">
			{
				gameData.players.length === 2 &&
				(parseInt(storage) === GameState.Started || parseInt(storage) === GameState.Spectacte) &&
				<PlayersScores players={gameData.players} />
			}
			</div>}
		</div>
    )
}