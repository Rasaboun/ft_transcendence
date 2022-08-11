import react from "React"
import "../Components/Pong/pong.css"

type propsType = {
    playerScore:number,
    computerScore:number
}

export default function Score(props:propsType)
{
    return (
        <div className="score">
            <div>{props.playerScore}</div>
            <div>{props.computerScore}</div>
        </div>
    )
}