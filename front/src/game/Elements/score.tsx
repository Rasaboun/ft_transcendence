import react from "react"
import "../game.css"

type propsType = {
    player1Score:number,
    player2Score:number,
}

export default function Score(props:propsType)
{
    return (
        <div className="score">
            <div>{props.player1Score}</div>
            <div>{props.player2Score}</div>
        </div>
    )
}