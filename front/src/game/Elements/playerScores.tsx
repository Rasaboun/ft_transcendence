import "../game.css"
import { Player } from "../GameUtils/type"

type propsType = {
    username: string
    image: string
    score: number
    className: string
    
}

export default function PlayersScores(props: propsType)
{
    return(
            <div className={`score--elem + ${props.className}`}>
                <h1 className="text-[40px]"> {props.username}    </h1>
                <img className="score--img" src={props.image} alt="user-profile-pic" />
                <h1 className="text-[80px]"> {props.score} </h1>
            </div>
    )
}
