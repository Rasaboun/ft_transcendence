import "../game.css"
import { Player } from "../GameUtils/type"

type propsType = {
    players: Player[]
}

export default function PlayersScores(props: propsType)
{
    const players = props.players;
    return(
        <div className="score--container ">
            <div className='score--elem float-left'>
                <h1 className="text-[40px]"> {players[0].id}    </h1>
                <img className="score--img" src="https://i.imgur.com/uhiPulC.jpg" alt="user-profile-pic" />
                <h1 className="text-[80px]"> {players[0].score} </h1>
            </div>
            <h1 className="score--vs">VS</h1>
            <div className='score--elem float-right'>
                <h1 className="text-[40px]"> {players[1].id}    </h1>
                <img className="score--img" src="https://i.imgur.com/uhiPulC.jpg" alt="user-profile-pic" />
                <h1 className="text-[80px]"> {players[1].score} </h1>
            </div>
        </div>
    )
}
